import React from 'react';
import { View, Text, Button } from 'react-native';

const RegisterScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Regístrate aquí</Text>
      <Button
        title="Volver a Main"
        onPress={() => navigation.navigate('Main')}
      />
    </View>
  );
};

export default RegisterScreen;
