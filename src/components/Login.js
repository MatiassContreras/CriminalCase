import React from 'react';
import { View, Text, Button } from 'react-native';

const LoginScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Inicia sesión aquí</Text>
      <Button
        title="Volver a Main"
        onPress={() => navigation.navigate('Main')}
      />
    </View>
  );
};

export default LoginScreen;
