import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const MainScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.heading}>Seleccione una opcion</Text>
        <Button
          title="Login"
          onPress={() => navigation.navigate('Login')}
          color="black"
        />
        <Button
          title="Registrarse"
          onPress={() => navigation.navigate('Register')}
          color="black"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'ivory', // Color marfil
  },
  box: {
    width: '80%', // Ancho del 80% de la pantalla
    padding: 20,
    borderRadius: 10, // Agrega un borde redondeado
    backgroundColor: 'white', // Color blanco
    borderWidth: 1, // Agrega un borde
    borderColor: 'gray', // Color del borde
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center', 
  },
});

export default MainScreen;