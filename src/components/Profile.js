// ProfileScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';

const ProfileScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Pantalla de Perfil</Text>
      <Button title="Ir a Home" onPress={() => navigation.navigate('Tabs', { screen: 'Home' })} />
    </View>
  );
};

export default ProfileScreen;
