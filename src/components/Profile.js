import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useAuth } from "../context/authContext";
import { FontAwesome5 } from '@expo/vector-icons';
import { sendEmailVerification, updateProfile } from '@firebase/auth';

const ProfileScreen = ({navigation}) => {
  const { user, logout, loading } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(user?.displayName || '');

  const handleLogout = async () => {
    await logout();
    navigation.navigate('Main');
  }

  const handleConfigurations = () => {
    setModalVisible(true);
  };

  const handleSaveChanges = async () => {
    try {
      if (user) {
        // Actualizar el nombre de usuario en Firebase Auth
        await updateProfile(user, { displayName: newDisplayName });
      }

      // Cerrar el modal después de guardar los cambios
      setModalVisible(false);
    } catch (error) {
      console.error('Error al actualizar el nombre de usuario:', error);
      // Manejar el error, por ejemplo, mostrar un mensaje al usuario
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileBox}>
        <TouchableOpacity style={styles.settingsButton} onPress={handleConfigurations}>
          <Text>
            <FontAwesome5 name="cog" size={20} color="#555" />
          </Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Perfil</Text>
        <View style={styles.userInfoContainer}>
          <View style={styles.userInfoRow}>
            <Text style={styles.label}>Nombre de usuario:</Text>
            <Text style={styles.userInfo}>{user?.displayName || 'Usuario no autenticado'}</Text>
          </View>
          <View style={styles.userInfoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.userInfo}>{user?.email || 'Usuario no autenticado'}</Text>
          </View>
        </View>
        <Button title="Cerrar Sesion" onPress={handleLogout} />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <Text style={styles.modalHeading}>Configuraciones</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Nuevo nombre de usuario"
                value={newDisplayName}
                onChangeText={(text) => setNewDisplayName(text)}
              />
              <Button title="Guardar cambios" onPress={handleSaveChanges} />
              <Button title="Cerrar" onPress={() => setModalVisible(!modalVisible)} />
            </View>
          </View>
        </Modal>
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
    width: 60,
    top: 20,
    right: 20,
    padding: 20,
    marginLeft: '90%',
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
  // Estilos para el modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
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
  modalHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default ProfileScreen;
