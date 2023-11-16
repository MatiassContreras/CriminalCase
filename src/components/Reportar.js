import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useAuth } from '../context/authContext';
import { onSnapshot, collection, deleteDoc, doc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { db } from '../firebase-config';
import { Button as RNEButton, Icon } from 'react-native-elements';
import { updateDoc } from 'firebase/firestore';

const Reportes = ({ navigation }) => {
  const { user, logout, loading } = useAuth();
  const [selectedReportId, setSelectedReportId] = useState('');
  const [userReports, setUserReports] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const userId = user && user.uid ? user.uid : null;
  const [newHour, setNewHour] = useState('');
  const [newType, setNewType] = useState('');
  const [newMinutes, setNewMinutes] = useState('');
  const [isPressed, setIsPressed] = useState(false);
  const [newDescription, setNewDescription] = useState('');


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
 // Función para obtener colores basados en el tipo
const getColorsByType = (type) => {
  const fillColor = type === 'Accidente automovilístico' || type === 'Sospechoso/a' || type === 'Acoso'
    ? 'rgba(255, 255, 0, 0.2)'
    : 'rgba(255, 2, 15, 0.41)';
  const strokeColor = type === 'Accidente automovilístico' || type === 'Sospechoso/a' || type === 'Acoso'
    ? 'rgba(255, 255, 0, 0.7)'
    : 'rgba(255, 2, 15, 0.41)';

  return { fillColor, strokeColor };
};

// ...

const handleEditReport = async (reportId, newHour, newMinutes, newType, newDescription) => {
  try {
    // Realiza la lógica para actualizar la hora, tipo y descripción en la base de datos
    // Utiliza el reportId para identificar el reporte específico

    // Ejemplo (no olvides importar las funciones necesarias de Firebase):
    const reportesRef = collection(db, 'reportes');
    const reportDoc = doc(reportesRef, reportId);

    // Combina los valores de hora y minutos
    const combinedTime = newHour && newMinutes ? `${newHour}:${newMinutes}` : '';

    // Obtén los colores basados en el nuevo tipo
    const { fillColor, strokeColor } = getColorsByType(newType);

    // Actualiza todos los campos en la base de datos, incluyendo los colores
    await updateDoc(reportDoc, {
      hora: combinedTime,
      tipo: newType,
      descripcion: newDescription,
      fillColor,
      strokeColor,
    });

    // Limpiar los campos de entrada después de la actualización
    setNewHour('');
    setNewMinutes('');
    setNewType('');
    setNewDescription('');

    console.log('Reporte modificado:', reportId);
  } catch (error) {
    console.error('Error al modificar el reporte: ', error);
  }
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
      {selectedOption === null && (
        <>
          <View style={{ marginTop: 20 }}>
          <Text style={styles.heading}>Reportes</Text>
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
        marginTop:10
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
  <View style={styles.editContainer}>
    <Text style={styles.heading}>Editar Reporte</Text>
    <Text >En esta seccion podras modificar un reporte, en caso de que te hallas equivocado en la creacion del mismo. </Text>
    <Text style={{fontWeight:'bold', marginTop:10}}> Porfavor, seleccione un reporte</Text>
    <Picker
      selectedValue={selectedReportId}
      onValueChange={(value) => setSelectedReportId(value)}
      style={{
        width: 300,
        height: 50,
        borderWidth: 5,
        marginBottom: 5,
        marginTop: 10,
      }}
    >
      <Picker.Item label="Selecciona un reporte" value="" />
      {userReports.map((report) => (
        <Picker.Item key={report.id} label={report.id} value={report.id} />
      ))}
    </Picker>
    <Text style={{ marginLeft:140 }}>
      Horas <Text style={{ fontSize: 10, color: 'gray' }}>24hs</Text>
    </Text>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft:'15%' }}>
      <TextInput
        value={newHour}
        onChangeText={(value) => {
          if (/^\d{0,2}$/.test(value)) {
            setNewHour(value);
          }
        }}
        style={{
          width: '15%',
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 10,
          paddingLeft: 15,
          marginLeft: 70,
        }}
      />
      <Text>:</Text>
      <TextInput
        value={newMinutes}
        onChangeText={(value) => {
          if (/^\d{0,2}$/.test(value)) {
            setNewMinutes(value);
          }
        }}
        style={{
          width: '15%',
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 10,
          paddingLeft: 10,
          marginRight: 70,
        }}
      />
    </View>

    <Text style={{ marginLeft: 70 }}>Tipo</Text>
    <Picker
      selectedValue={newType}
      onValueChange={(value) => setNewType(value)}
      style={{
        width: 200,
        height: 60,
        borderWidth: 1,
        marginBottom: 10,
        marginLeft: 100,
      }}
    >
      <Picker.Item label="Elige una opción" value="" />
      <Picker.Item label="Accidente automovilístico" value="Accidente automovilístico" />
      <Picker.Item label="Robo" value="Robo" />
      <Picker.Item label="Acoso" value="Acoso" />
      <Picker.Item label="Vandalismo" value="Vandalismo" />
      <Picker.Item label="Sospechoso/a" value="Sospechoso/a" />
      <Picker.Item label="Pelea" value="Pelea" />
    </Picker>

    <TextInput
      placeholder="Descripcion breve de lo ocurrido "
      value={newDescription}
      onChangeText={(value) => setNewDescription(value)}
      style={{
        width: 340,
        height: '20%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingBottom: 55,
        paddingLeft: 10,
        paddingTop: 10,
      }}
    />

    <TouchableOpacity onPress={() => handleEditReport(selectedReportId, newHour, newMinutes, newType, newDescription)} disabled={!selectedReportId}>
      <Text style={[styles.editButton, { color: selectedReportId ? 'green' : 'gray', borderColor: selectedReportId ? 'green' : 'gray' }]}>
        Modificar Reporte
      </Text>
    </TouchableOpacity>

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
  editContainer: {
    backgroundColor: '#fff', // Color de fondo de la caja de edición
    padding: 20, // Espaciado interno
    borderRadius: 10, // Bordes redondeados
    borderWidth: 2, // Ancho del borde
    borderColor: '#ddd', // Color del borde
    marginBottom: 20, // Margen inferior
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  picker: {
    width: 300,
    height: 50,
    borderWidth: 5,
    marginBottom: 'auto',
    marginTop: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeLabel: {
    marginLeft: 70,
    fontSize: 16,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    width: '30%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 15,
    marginRight: 10,
  },
  label: {
    marginLeft: 70,
    fontSize: 16,
  },
  descriptionInput: {
    width: 400,
    height: '20%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingBottom: 55,
    paddingLeft: 10,
    paddingTop: 10,
  },
  editButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: 'transparent',
    marginBottom: 20,
    textAlign: 'center',
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
    marginBottom: 350,
    marginTop:10
  },
  backButton: {
    fontSize: 20,
    fontWeight:'bold',
    borderWidth:1,
    width:100,
    height:30,
    textAlign:'center',
    margin:'auto'
  },
});

export default Reportes;
