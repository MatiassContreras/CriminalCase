import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, TouchableHighlight, ScrollView, StyleSheet } from 'react-native';
import { useAuth } from '../context/authContext';
import { useNavigation } from '@react-navigation/native';

export default function Register() {
  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const { signup, loginWithGoogle } = useAuth();
  const navigation = useNavigation();
  const [error, setError] = useState();
  const [buttonFocused, setButtonFocused] = useState(false);

  const handleChange = (name, value) => {
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async () => {
    setError(null);
    if (!user.email) {
      setError('Falta completar el correo electrónico');
      return;
    }

    if (!user.password) {
      setError('Falta completar la contraseña');
      return;
    }

    if (user.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Validación de formato de correo electrónico
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(user.email)) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }

    try {
      await signup(user.email, user.password);
      navigation.navigate('Home');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleGoogleSign = async () => {
    await loginWithGoogle();
    navigation.navigate('Home');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonIcon}>←</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Registrarse</Text>
        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor="black"
          onChangeText={(value) => handleChange('email', value)}
          value={user.email}
          style={styles.input}
        />
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="black"
          secureTextEntry
          onChangeText={(value) => handleChange('password', value)}
          value={user.password}
          style={styles.input}
        />
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              {error} {' '}
            </Text>
            <TouchableOpacity onPress={handleCloseError}>
              <Text style={styles.errorClose}>X</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
          <Text style={styles.registerButtonText}>Registrarse</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>
            ¿Ya tienes una cuenta? Inicia sesión aquí
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleGoogleSign}>
          <Text style={styles.socialLink}>Registrarse con Google</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.socialLink}>Registrarse con Facebook</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'ivory', // Cambiar el fondo del contenedor a color marfil
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  backButtonIcon: {
    color: 'black',
    fontSize: 40,
    fontWeight: 'bold',
  },
  content: {
    maxWidth: 500,
    width: '100%',
    padding: 20,
    backgroundColor: 'ivory', // Cambiar el fondo de la caja a color marfil
    borderRadius: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  input: {
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
    color: 'white',
    width: '100%',
  },
  errorBox: {
    backgroundColor: 'black',
    padding: 8,
    borderRadius: 5,
    borderColor: 'red',
    borderWidth: 1,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    color: 'white',
    flex: 1,
  },
  errorIcon: {
    fontWeight: 'bold',
  },
  errorClose: {
    color: 'white',
  },
  registerButton: {
    backgroundColor: 'black',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  registerButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  loginLink: {
    color: 'black',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  socialLink: {
    color: 'black',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
});