import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import MapView, { Circle, Marker, Callout } from 'react-native-maps';
import { getFirestore, collection, addDoc, onSnapshot } from 'firebase/firestore';
import Geocoder from 'react-native-geocoding';
import { useAuth } from '../context/authContext';
import { GOOGLE_MAPS_KEY } from '@env';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';
import { db } from '../firebase-config';

export default function HomeScreen() {
  const [streetAddress, setStreetAddress] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [reports, setReports] = useState([]);
  const { user } = useAuth()
  const [selectedReportId, setSelectedReportId] = useState('');

  const [report, setReport] = useState({
    hora: '',
    tipo: '',
    descripcion: '',
  });
  const [hour, setHour] = useState('');
  const [minutes, setMinutes] = useState('');

  const [mapLoaded, setMapLoaded] = useState(false);
  const [circleData, setCircleData] = useState(null);
  const [markerData, setMarkerData] = useState(null);
  const [userReports, setUserReports] = useState([]);
  Geocoder.init(GOOGLE_MAPS_KEY);
  const userId = user && user.uid ? user.uid : null;

  useEffect(() => {
    if (!mapLoaded || !userId ) return;

    const reportesRef = collection(db, 'reportes');

    const unsubscribe = onSnapshot(reportesRef, (snapshot) => {
      const reportArray = [];
      const userReportArray = [];
      snapshot.forEach((doc) => {
        const data = doc.data();

        if (data.coordinates && data.coordinates.latitude && data.coordinates.longitude) {
          reportArray.push({ id: doc.id, ...data });
        }
        if (userId && userId === data.createdBy) {
          userReportArray.push(doc.id);
        }
      });
      setUserReports(userReportArray);
      setReports(reportArray);
    });

    return () => {
      unsubscribe();
    };
  }, [mapLoaded, userId]);

  const handleChange = (name, value) => {
    setReport({ ...report, [name]: value });
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const getCoordinatesFromAddress = async () => {
    try {
      const fullAddress = `${streetAddress}, Neuquen, Neuquen, Argentina`;
      console.log('Intentando obtener coordenadas para la dirección:', fullAddress);

      if (!fullAddress) {
        console.error('La dirección no puede estar vacía');
        return null;
      }

      const response = await Geocoder.from(fullAddress);
      const { lat, lng } = response.results[0].geometry.location;
      console.log('Coordenadas obtenidas:', { latitude: lat, longitude: lng });
      return { latitude: lat, longitude: lng };
    } catch (error) {
      console.error('Error al obtener las coordenadas:', error);
      return null;
    }
  };

  const createReport = async () => {
    if (report.tipo === '') {
      alert('Por favor, elige una opción antes de crear el reporte.');
      return;
    }

    if (streetAddress === '') {
      alert('Complete con una dirección válida (Nombre de calle completo + Altura).');
      return;
    }

    if (!/^\d{2}$/.test(hour) || !/^\d{2}$/.test(minutes)) {
      alert('Por favor, ingrese una hora y minutos válidos (2 dígitos numéricos).');
      return;
    }

    const coordinates = await getCoordinatesFromAddress();

    if (!coordinates) {
      console.error('No se pudieron obtener las coordenadas');
      return;
    }

    const hora = `${hour}:${minutes}`;

    // Define las condiciones para determinar el color del círculo y el borde
    const fillColor = report.tipo === 'Accidente automovilístico' || report.tipo === 'Sospechoso/a' || report.tipo === 'Acoso'
      ? 'rgba(255, 255, 0, 0.2)'
      : 'rgba(255, 2, 15, 0.41)';
    const strokeColor = report.tipo === 'Accidente automovilístico' || report.tipo === 'Sospechoso/a' || report.tipo === 'Acoso'
      ? 'rgba(255, 255, 0, 0.7)'
      : 'rgba(255, 2, 15, 0.41)';

    const newReport = {
      hora: hora,
      tipo: report.tipo,
      descripcion: report.descripcion,
      coordinates: coordinates,
      fillColor,
      strokeColor,
      createdBy: user.uid,
    };

    try {
      const docRef = await addDoc(collection(db, 'reportes'), newReport);
      console.log('Reporte agregado con ID: ', docRef.id);
      setCircleData({
        center: coordinates,
        radius: 100,
        fillColor,
        strokeColor,
      });
      setMarkerData({
        coordinate: coordinates,
        report: newReport,
      });

      toggleModal();
    } catch (error) {
      console.error('Error al agregar el reporte: ', error);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        onLayout={() => setMapLoaded(true)}
        region={
          coordinates
            ? {
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }
            : {
              latitude: -38.952352,
              longitude: -68.059138,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }
        }
      >
        {circleData && markerData && (
          <>
            <Circle {...circleData} />
            <Marker coordinate={markerData.coordinate}>
              <Callout>
                <View>
                  <Text>Tipo: {markerData.report.tipo}</Text>
                  <Text>Descripción: {markerData.report.descripcion}</Text>
                  <Text>Hora: {markerData.report.hora}</Text>
                </View>
              </Callout>
            </Marker>
          </>
        )}
        {reports.map((report, index) => (
          <View key={index}>
            {report.coordinates && (
              <>
                <Circle
                  center={report.coordinates}
                  radius={100}
                  fillColor={report.fillColor || 'rgba(255, 2, 15, 0.41)'}
                  strokeColor={report.strokeColor || 'rgba(255, 2, 15, 0.41)'}
                />
                <Marker coordinate={report.coordinates}>
                  <Callout>
                    <View>
                      <Text>Tipo: {report.tipo}</Text>
                      <Text>Hora: {report.hora}</Text>
                      <Text>Descripción: {report.descripcion}</Text>
                      {user && user.uid === report.createdBy && (
                         <Text style={{fontSize:10,marginTop:5}} >ID del reporte: {report.id}</Text>
                       )}
                    </View>
                  </Callout>
                </Marker>
              </>
            )}
          </View>
        ))}
      </MapView>

      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 15,
          right: 10,
          backgroundColor: 'black',
          padding: 10,
          borderRadius: 5,
        }}
        onPress={toggleModal}
      >
        <Text style={{ color: 'white' }}>Reportar</Text>
      </TouchableOpacity>
      <Modal isVisible={isModalVisible}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            
            <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ marginTop:-110,position: 'absolute', fontSize: 20, fontWeight: 'bold' }}>Informacion del Reporte</Text>
              <Text style={{ marginLeft: 70 }}>Horas <Text style={{ fontSize: 10, color: 'gray' }}>24hs</Text> </Text>
              <TextInput
                value={hour}
                onChangeText={(value) => {
                  if (/^\d{0,2}$/.test(value)) {
                    setHour(value);
                  }
                }}
                style={{
                  width: '30%',
                  height: 40,
                  borderColor: 'gray',
                  borderWidth: 1,
                  marginBottom: 10,
                  paddingLeft: 15,
                  marginLeft: 70
                }}
              />
            </View>
            <Text>:</Text>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ marginRight: 70 }}>Minutos</Text>
              <TextInput
                value={minutes}
                onChangeText={(value) => {
                  if (/^\d{0,2}$/.test(value)) {
                    setMinutes(value);
                  }
                }}
                style={{
                  width: '30%',
                  height: 40,
                  borderColor: 'gray',
                  borderWidth: 1,
                  marginBottom: 10,
                  paddingLeft: 10,
                  marginRight: 70
                }}
              />
            </View>
          </View>
          <Picker
            selectedValue={report.tipo}
            onValueChange={(value) => handleChange('tipo', value)}
            style={{
              width: '80%',
              height: 40,
              borderWidth: 1,
              marginBottom: 10,
              paddingLeft: 10,
            }}
          >
            <Picker.Item label="Elige una opción" value="" />
            <Picker.Item label="Accidente automovilístico" value="Accidente automovilístico" />
            <Picker.Item label="Robo" value="Robo" />
            <Picker.Item label="Acoso" value="Acoso" />
            <Picker.Item label="Vandalismo" value="Vandalismo" />
            <Picker.Item label="Sospechoso/a" value="Sospechoso/a" />
            <Picker.Item label="Pelea" value="Pelea" />
          </Picker>
          <TextInput
            placeholder="Dirección de la calle y altura"
            value={streetAddress}
            onChangeText={setStreetAddress}
            style={{
              width: '80%',
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              marginBottom: 10,
              paddingLeft: 10,
            }}
          />
          <TextInput
            placeholder="Descripcion breve de lo ocurrido Ejemplo: 'Robaron un automovil a mano armada' "
            value={report.descripcion}
            onChangeText={(value) => handleChange('descripcion', value)}
            style={{
              width: '80%',
              height: 100,
              borderColor: 'gray',
              borderWidth: 1,
              marginBottom: 10,
              paddingBottom: 55,
              paddingLeft: 10,
              paddingTop: 10
            }}
          />
          <Button title="Crear Reporte" onPress={createReport} />
          <Button title="Cerrar" onPress={toggleModal} />
        </View>
      </Modal>
    </View>
  );
}
