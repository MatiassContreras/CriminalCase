import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from "../context/authContext";
import { FontAwesome5 } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, loading } = useAuth();
  if (!user) {
    // El usuario no está autenticado, puedes redirigirlo a la pantalla de inicio de sesión u otra acción
    // En este ejemplo, simplemente mostramos un mensaje
    return (
      <View style={styles.container}>
        <Text>Perfil</Text>
        <Text>Usuario no autenticado</Text>
        <Button title="Ir a Home" onPress={() => navigation.navigate('Tabs', { screen: 'Main' })} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.profileBox}>
      <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}>
        <Text>
      <FontAwesome5 name="cog" size={20} color="#555" /> {/* Icono de configuración */}
      </Text>
      </TouchableOpacity>
        <Text style={styles.heading}>Perfil</Text>
        <View style={styles.userInfoContainer}>
          <View style={styles.userInfoRow}>
            <Text style={styles.label}>Nombre de usuario:</Text>
            <Text style={styles.userInfo}>{user.displayName}</Text>
          </View>
          <View style={styles.userInfoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.userInfo}>{user.email}</Text>
          </View>
        </View>
        <Button title="Ir a Home" onPress={() => navigation.navigate('Tabs', { screen: 'Home' })} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  settingsButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    borderRadius: 50,
    backgroundColor: 'white',
    elevation: 5,
  },
  profileBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userInfoContainer: {
    marginTop: 20,
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userInfo: {
    fontSize: 16,
  },
});

export default ProfileScreen;
