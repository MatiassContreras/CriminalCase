// Home.js
import React from 'react';
import { View, Text, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>¡Bienvenido a la pantalla de inicio!</Text>
      <Button title="Iniciar sesión" onPress={() => navigation.navigate('Profile')} />
    </View>
  );
};

export default HomeScreen;
