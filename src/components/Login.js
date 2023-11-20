import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Button } from 'react-native';
import { useAuth } from '../context/authContext';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
export default function LoginScreen() {
  const { login, loginWithGoogle, getUserData } = useAuth();
  const navigation = useNavigation();
GoogleSignin.configure({
  webClientId:"642989456458-9r88hmivlb5k1oa6unfjmo0qq1sk7mii.apps.googleusercontent.com"
});

const onGoogleButtonPress = async () =>{

    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog:true});
    const {idToken} = await GoogleSignin.signIn();
    const googleCredential= auth.GoogleAuthProvider.credential(idToken);
    //return auth().signInWithCredential(googleCredential);
    const user_sign_in = auth().signInWithCredential(googleCredential);
    user_sign_in.then((user2) => {
      
  if (user2){
    console.log("USUARIO LOGEADO");
    AsyncStorage.setItem(
      "UserLoggedInData",
      JSON.stringify({user2, loggedIn: true})
      );

      const fetchData = async () => {
      const Data = await getUserData();
      console.log(Data.user2.user);
      console.log('Entra aqui')
      if (Data.user2){
         console.log('ExiteUserdddd')
          navigation.navigate('Tab');
        }
      };
    
     fetchData();
    
    
  }else {
    console.log("No hay usuario")

  }
  
    }).catch((error)=> {
      console.log(error);
    });
  }

  const [user, setUser] = useState({
    email: '',
    password: '',
  });
 

 

  const [errors, setErrors] = useState({ email: null, password: null });
  const [initializing, setInitializing] = useState(true);
  const [user2, setUser2] = useState();

  function onAuthStateChanged(user2){
    setUser2(user2);
    if (initializing) setInitializing(false);
  }

  useEffect(()=> {
    const suscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return suscriber;
  },[])

  const handleChange = (name, value) => {
    setUser({ ...user, [name]: value });
    setErrors({ ...errors, [name]: null }); // Limpiar el mensaje de error del campo actual al realizar cambios
  };

  const validateEmail = (email) => {
    // Utiliza una expresión regular para verificar si el correo electrónico es válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    setErrors({ email: null, password: null }); // Limpiar errores al intentar iniciar sesión

    // Validaciones
    if (!validateEmail(user.email)) {
      setErrors({ ...errors, email: 'Ingrese un correo electrónico válido.' });
      return;
    }

    if (user.password.length < 6) {
      setErrors({ ...errors, password: 'La contraseña debe tener al menos 6 caracteres.' });
      return;
    }

    try {
      await login(user.email, user.password);
      navigation.navigate('Tab');
    } catch (error) {
      setErrors({ ...errors, email: 'No se pudo iniciar sesión. Verifique sus credenciales.' });
    }
  };


  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'ivory' }}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonIcon}>←</Text>
      </TouchableOpacity>
      <View style={{ padding: 8, width: '100%', maxWidth: 300 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: 'black', textAlign: 'center' }}>Iniciar sesión</Text>

        {/* Mostrar mensaje de error para el campo de correo electrónico */}
        {errors.email && (
          <Text style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>
            {errors.email}
          </Text>
        )}

        {/* Mostrar mensaje de error para el campo de contraseña */}
        {errors.password && (
          <Text style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>
            {errors.password}
          </Text>
        )}

        <TextInput
          style={[styles.input, errors.email && styles.inputError]} // Aplicar estilo de error si hay un error en el campo de correo electrónico
          placeholderTextColor="black"
          type="email"
          id="email"
          autoFocus
          name="email"
          required
          placeholder="Correo electrónico"
          onChangeText={(value) => handleChange('email', value)}
        />

        <TextInput
          style={[styles.input, errors.password && styles.inputError]} // Aplicar estilo de error si hay un error en el campo de contraseña
          placeholderTextColor="black"
          placeholder="Contraseña"
          type="password"
          id="password"
          name="password"
          secureTextEntry={true}
          onChangeText={(value) => handleChange('password', value)}
        />

        <TouchableOpacity
          style={{
            height: 48,
            borderWidth: 2,
            backgroundColor: 'black',
            borderColor: 'gray',
            borderRadius: 6,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingLeft: 10,
            paddingRight: 10,
            marginTop: 20,
            width: 130,
            marginLeft: 78,
          }}
          onPress={handleSubmit}
        >
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 15,  }}>Iniciar sesion</Text>
          </View>
        </TouchableOpacity>

        {/* Usar la imagen descargada del logo de Google en lugar del SVG */}
        <Button
        title='Iniciar Sesion con Google'
          onPress={()=> onGoogleButtonPress().then(()=>
              console.log("Signed in With Google")
            )
          }
          style={styles.googleButton}
        >
          <Image
            source={require('../img/google-logo.png')}
            style={styles.googleButtonImage}
          />
          <Text style={styles.googleButtonText}>Continuar con Google</Text>
        </Button>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  input: {
    width: '100%',
    color: 'black',
    backgroundColor: 'ivory',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'gray',
    height: 48,
    paddingLeft: 16,
    marginBottom: 4,
  },
  loginButton: {
    height: 30,
    borderWidth: 2,
    backgroundColor: 'black',
    borderColor: 'gray',
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 100,
    paddingRight: 100,
    marginTop: 20,
    marginLeft: 40,
    marginRight: 40,
    width: 20
  },
  loginButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  inputError: {
    borderColor: 'red', // Cambiar el borde a rojo en caso de error
  },
  googleButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"#40576D12",
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 6,
    marginTop: 20,
    marginLeft: 30,
    marginRight: 30,
    height: 48,
  },
  googleButtonImage: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  googleButtonText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  
});
