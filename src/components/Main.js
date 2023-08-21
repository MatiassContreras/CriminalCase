// MainScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';

const MainScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Pantalla Main</Text>
      <Button title="Ir a Home" onPress={() => navigation.navigate('Tabs', { screen: 'Home' })} />
      <Button
        title="Ir a Login"
        onPress={() => navigation.navigate('Login')}
      />
      <Button
        title="Ir a Register"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
};

export default MainScreen;
