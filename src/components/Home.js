import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Circle, Marker, Callout } from 'react-native-maps';
import { getFirestore, collection, addDoc, onSnapshot } from 'firebase/firestore';
import Geocoder from 'react-native-geocoding';
import { GOOGLE_MAPS_KEY } from '@env';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';
import { db } from '../firebase-config';

export default function HomeScreen() {
  const [streetAddress, setStreetAddress] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [reports, setReports] = useState([]);
  const [report, setReport] = useState({
    hora: '',
    tipo: '',
    descripcion: '',
  });

  // Nuevo estado para controlar si el mapa se ha cargado
  const [mapLoaded, setMapLoaded] = useState(false);

  // Estados para el círculo y el marcador
  const [circleData, setCircleData] = useState(null);
  const [markerData, setMarkerData] = useState(null);

  // Reemplaza 'app' con tu instancia de Firebase
  Geocoder.init(GOOGLE_MAPS_KEY);

  useEffect(() => {
    if (!mapLoaded) return;

    const reportesRef = collection(db, 'reportes');

    const unsubscribe = onSnapshot(reportesRef, (snapshot) => {
      const reportArray = [];
      snapshot.forEach((doc) => {
        const data = doc.data();

        if (data.coordinates && data.coordinates.latitude && data.coordinates.longitude) {
          reportArray.push(data);
        }
      });
      setReports(reportArray);
    });

    return () => {
      unsubscribe();
    };
  }, [mapLoaded]);

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
    const coordinates = await getCoordinatesFromAddress(); // Espera a que se obtengan las coordenadas
  
    if (!coordinates) {
      // Si no se pudieron obtener las coordenadas, mostrar un mensaje de error o manejarlo de acuerdo a tus necesidades
      console.error('No se pudieron obtener las coordenadas');
      return;
    }
  
    const newReport = {
      hora: report.hora,
      tipo: report.tipo,
      descripcion: report.descripcion,
      coordinates: coordinates,
    };
  
    try {
      const docRef = await addDoc(collection(db, 'reportes'), newReport);
      console.log('Reporte agregado con ID: ', docRef.id);
  
      // Crear el marcador y el círculo al mismo tiempo
      setCircleData({
        center: coordinates,
        radius: 100,
        fillColor: 'rgba(255, 0, 0, 0.2)',
        strokeColor: 'red',
      });
      setMarkerData({
        coordinate: coordinates,
        report: newReport,
      });
  
      toggleModal(); // Mover la apertura del modal aquí
    } catch (error) {
      console.error('Error al agregar el reporte: ', error);
    }
  };
  

  const reloadMapData = () => {
    // Este código se ha movido a la función `useEffect` que se ejecuta al cargar el mapa
    // Puedes eliminar esta función para evitar errores.
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        onLayout={() => setMapLoaded(true)} // Marca el mapa como cargado
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
                  fillColor="rgba(255, 0, 0, 0.2)"
                  strokeColor="red"
                />
                <Marker
                  coordinate={report.coordinates}
                >
                  <Callout>
                    <View>
                      <Text>Tipo: {report.tipo}</Text>
                      <Text>Descripción: {report.descripcion}</Text>
                      <Text>Hora: {report.hora}</Text>
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
          top: 60,
          right: 10,
          backgroundColor: 'blue',
          padding: 10,
          borderRadius: 5,
        }}
        onPress={toggleModal} // Botón para agregar un reporte
      >
        <Text style={{ color: 'white' }}>Agregar Reporte</Text>
      </TouchableOpacity>
      <Modal isVisible={isModalVisible}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
          <TextInput
            placeholder="Horario del Reporte"
            value={report.hora}
            onChangeText={(value) => handleChange('hora', value)}
            style={{
              width: '80%',
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              marginBottom: 10,
              paddingLeft: 10,
            }}
          />
          <Picker
            onValueChange={(value) => handleChange('tipo', value)}
            style={{
              width: '80%',
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              marginBottom: 10,
              paddingLeft: 10,
            }}
          >
            <Picker.Item label="Accidente automovilístico" value="Accidente automovilístico" />
            <Picker.Item label="Robo" value="Robo" />
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
            placeholder="Descripción de lo Ocurrido"
            value={report.descripcion}
            onChangeText={(value) => handleChange('descripcion', value)}
            style={{
              width: '80%',
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              marginBottom: 10,
              paddingLeft: 10,
            }}
          />
          <Button title="Crear Reporte" onPress={createReport} />
          <Button title="Cerrar" onPress={toggleModal} />
        </View>
      </Modal>
    </View>
  );
}
