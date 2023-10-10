import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '../context/authContext';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function LoginScreen() {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const { login, loginWithGoogle } = useAuth();
  const navigation = useNavigation();
  const [error, setError] = useState();

  const handleChange = ({ name, value }) => {
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async () => {
    setError('');
    try {
      await login(user.email,user.password);
      navigation.navigate('Home');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSign = async () => {
    await loginWithGoogle();
    navigation.navigate('Home');
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'black' }}>
       <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonIcon}>←</Text>
      </TouchableOpacity>
    <View style={{ padding: 8, width: '100%', maxWidth: 300 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: 'white', textAlign:'center' }}>Iniciar sesion</Text>

      <TextInput
        style={{ width: '100%',color:'white', backgroundColor: 'black', borderRadius: 6,borderWidth: 2, borderColor: 'white', height: 48, paddingLeft: 16, marginBottom: 4 }}
        placeholderTextColor="white"
           type="email"
            id="email"
            autoFocus
            name="email"
            required
        placeholder="Correo electronico"
        onChangeText={value => handleChange('email', value)}
      />

      <TextInput
        style={{ width: '100%', backgroundColor: 'black',color:'white', borderRadius: 6,borderWidth: 2, borderColor: 'white', height: 48, paddingLeft: 16 }}
        placeholderTextColor="white"
        placeholder="Contraseña"
        type="password"
        id="password"
        name="password"
        secureTextEntry={true}
        onChangeText={value => handleChange('password', value)}
      />
      <Pressable
        style={{ height: 48, borderWidth: 2, borderColor: 'white', borderRadius: 6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 24, paddingRight: 24, marginTop:20 }}
        onPress={handleSubmit}
      >
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Login</Text>
        </View>
      </Pressable>
      <TouchableOpacity
                onPress={handleGoogleSign}
                style={{ marginLeft: 10, marginTop:20,  height: 48, borderWidth: 2, borderColor: 'white', paddingLeft: 24, paddingRight: 24, borderRadius: 6, flexDirection: 'row', justifyContent: 'center' }}
      >
                <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'white', marginTop:7 }}>Iniciar sesión con Google</Text>
      </TouchableOpacity>
    </View>
  </View>

  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  backButtonIcon: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
});
