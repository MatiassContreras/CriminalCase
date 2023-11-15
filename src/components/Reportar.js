import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/authContext';
import { onSnapshot, collection, deleteDoc, doc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { db } from '../firebase-config';
import { Button as RNEButton, Icon } from 'react-native-elements';

const Reportes = ({ navigation }) => {
  const { user, logout, loading } = useAuth();
  const [selectedReportId, setSelectedReportId] = useState('');
  const [userReports, setUserReports] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const userId = user && user.uid ? user.uid : null;

  useEffect(() => {
    if (!userId) return;
    const reportesRef = collection(db, 'reportes');

    const unsubscribe = onSnapshot(reportesRef, (snapshot) => {
      const userReportArray = [];
      snapshot.forEach((doc) => {
        const data = doc.data();

        if (userId && userId === data.createdBy) {
          userReportArray.push({ id: doc.id, ...data });
        }
      });
      setUserReports(userReportArray);
    });

    return () => {
      unsubscribe();
    };
  }, [userId]);

  const deleteReport = async (reportId) => {
    try {
      const reportesRef = collection(db, 'reportes');
      await deleteDoc(doc(reportesRef, reportId));

      console.log('Reporte eliminado:', reportId);
    } catch (error) {
      console.error('Error al eliminar el reporte: ', error);
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setSelectedReportId('');
  };

  if (!user) {
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
      {selectedOption === null && (
        <>
          <View style={{ marginTop: 20 }}>
        <RNEButton
          title="Estadísticas"
          type="outline"
          icon={<Icon name="bar-chart" type="font-awesome" style={{marginRight:10}} />}
          onPress={() => handleOptionSelect('estadisticas')}
          buttonStyle={{ backgroundColor: 'lightgray' }}
        />
        <RNEButton
          title="Eliminar Reporte"
          type="outline"
          icon={<Icon name="times" type="font-awesome" style={{marginLeft:'auto', marginRight:10}} />}
          onPress={() => handleOptionSelect('eliminar')}
          buttonStyle={{ backgroundColor: 'lightgray', marginTop: 10 }}
        />
        <RNEButton
          title="Editar Reportes"
          type="outline"
          icon={<Icon name="pencil" type="font-awesome" style={{marginLeft:'auto', marginRight:10}} />}
          onPress={() => handleOptionSelect('editar')}
          buttonStyle={{ backgroundColor: 'lightgray', marginTop: 10 }}
        />
      </View>
        </>
      )}

      {selectedOption === 'estadisticas' && (
        <View>
          {/* Aquí puedes mostrar las estadísticas */}
          <Text style={styles.userInfo}>Cantidad de reportes creados: {userReports.length}</Text>
          <TouchableOpacity onPress={() => setSelectedOption(null)}>
            <Text style={styles.backButton}>Volver</Text>
          </TouchableOpacity>
        </View>
      )}

{selectedOption === 'eliminar' && (
  <View style={styles.container}>
      <Text style={{ fontWeight: 'bold', marginBottom: 'auto', marginRight: 'auto' }}>
        Por favor, seleccione un Reporte
      </Text>
    <Picker
      selectedValue={selectedReportId}
      onValueChange={(value) => setSelectedReportId(value)}
      style={{
        width: 300,
        height: 50,
        borderWidth: 5,
        marginBottom: 'auto',
      }}
    >
      <Picker.Item label="Selecciona un reporte" value="" />
      {userReports.map((report) => (
        <Picker.Item key={report.id} label={report.id} value={report.id} />
      ))}
    </Picker>
    <TouchableOpacity onPress={() => deleteReport(selectedReportId)} disabled={!selectedReportId}>
      <Text style={[styles.deleteButton, { color: selectedReportId ? 'red' : 'gray', borderColor: selectedReportId ? 'red' : 'gray' }]}>
        Eliminar Reporte
      </Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => setSelectedOption(null)}>
      <Text style={styles.backButton}>Volver</Text>
    </TouchableOpacity>
  </View>
)}
      {selectedOption === 'editar' && (
        <View>
          {/* Aquí puedes mostrar la lógica para editar reportes */}
          <Text>Editar reportes aquí...</Text>
          <TouchableOpacity onPress={() => setSelectedOption(null)}>
            <Text style={styles.backButton}>Volver</Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingBottom: 40,
  },
  userInfo: {
    fontSize: 16,
    marginBottom: 10,
    marginRight: 10,
    marginLeft: '-3%',
  },
  deleteButton: {
    color: 'red',
    fontSize: 16,
    borderWidth: 2,
    padding: 10,
    textAlign: 'center',
    borderColor: 'red',
    fontWeight: 'bold',
    marginBottom: 400,
  },
  backButton: {
    marginTop: 20,
    color: 'blue',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default Reportes;
