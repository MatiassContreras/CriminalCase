import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import MapView, { Circle, Marker, Callout } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import Modal from 'react-native-modal';
import { GOOGLE_MAPS_KEY } from '@env';

export default function HomeScreen() {
  const [streetAddress, setStreetAddress] = useState('');
  const [address, setAddress] = useState(''); // Dirección completa
  const [coordinates, setCoordinates] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [horario, setHorario] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState('');
  const [reports, setReports] = useState([]);

  Geocoder.init(GOOGLE_MAPS_KEY);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const getCoordinatesFromAddress = async () => {
    try {
      // Combina la dirección de la calle y la altura con "Neuquen, Neuquen, Argentina"
      const fullAddress = `${streetAddress}, Neuquen, Neuquen, Argentina`;

      if (!fullAddress) {
        console.error('La dirección no puede estar vacía');
        return;
      }

      const response = await Geocoder.from(fullAddress);
      const { lat, lng } = response.results[0].geometry.location;
      setCoordinates({ latitude: lat, longitude: lng });
    } catch (error) {
      console.error('Error al obtener las coordenadas:', error);
    }
  };

  const createReport = () => {
    getCoordinatesFromAddress();
    toggleModal();
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
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
        {coordinates && (
          <>
            <Circle
              center={coordinates}
              radius={100}
              fillColor="rgba(255, 0, 0, 0.2)"
              strokeColor="red"
            />
            <Marker coordinate={coordinates}>
              {/* Agrega un Callout para mostrar la información del reporte */}
              <Callout>
                <View>
                  <Text>Tipo: {tipo}</Text>
                  <Text>Descripción: {descripcion}</Text>
                  <Text>Hora: {horario}</Text>
                </View>
              </Callout>
            </Marker>
          </>
        )}
      </MapView>

      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          backgroundColor: 'blue',
          padding: 10,
          borderRadius: 5,
        }}
        onPress={toggleModal}
      >
        <Text style={{ color: 'white' }}>Agregar Reporte</Text>
      </TouchableOpacity>
      <Modal isVisible={isModalVisible}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
          <TextInput
            placeholder="Horario del Reporte"
            value={horario}
            onChangeText={setHorario}
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
            value={descripcion}
            onChangeText={setDescripcion}
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
            placeholder="Tipo (ejemplo: Robo, Accidente, etc.)"
            value={tipo}
            onChangeText={setTipo}
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
          <Button title="Crear Reporte" onPress={createReport} />
          <Button title="Cerrar" onPress={toggleModal} />
        </View>
      </Modal>
    </View>
  );
}
