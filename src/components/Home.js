// Home.js
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../context/authContext';

const HomeScreen = ({ navigation }) => {
  const {user, logout , loading} =useAuth();
  const handleLogout = async()=> {
      await logout();
  }    
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>¡Bienvenido a la pantalla de inicio!</Text>
      <Button title="Iniciar sesión" onPress={() => navigation.navigate('Profile')} />
      <Button title="Logout" onPress={(handleLogout)} />
    </View>
  );
};

export default HomeScreen;
