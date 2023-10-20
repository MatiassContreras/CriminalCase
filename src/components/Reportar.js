import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from "../context/authContext";

const Reportes = ({ navigation }) => {
  const { user, logout, loading } = useAuth();
  if (!user) {
    // El usuario no está autenticado, puedes redirigirlo a la pantalla de inicio de sesión u otra acción
    return (
      <View style={styles.container}>
        <Text>Pantalla de Reportes</Text>
        <Text>Usuario no autenticado</Text>
        <Button title="Ir a Home" onPress={() => navigation.navigate('Tabs', { screen: 'Main' })} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Pantalla de Reportes</Text>
      <Text style={styles.userInfo}>Nombre de usuario: {user.displayName}</Text>
      <Text style={styles.userInfo}>Email: {user.email}</Text>
      <Button title="Ir a Home" onPress={() => navigation.navigate('Tabs', { screen: 'Home' })} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userInfo: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default Reportes;
