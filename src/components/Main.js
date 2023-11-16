import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, ImageBackground } from 'react-native';

const MainScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../img/criminal_casesx.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.overlay}>
          <View style={styles.box}>
            <Image
              source={require('../img/logo_ccb.png')}
              style={styles.logo}
              
            />
            <Text style={{color:'black', fontSize:13, textAlign:'center', fontWeight:'bold'}}> ¿Que desea hacer? </Text>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={[styles.buttonText, {shadowColor:'#9400D3'}]}> INICIAR SESION </Text>
            </TouchableOpacity>
            <Text style={{color:'black', fontSize:10, textAlign:'center', fontWeight:'bold'}}> ――― o ――― </Text>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.buttonText}>REGISTRARSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  
  box: {
    width: 250,
    marginTop: '30%',  // Ajusta esta altura según tus necesidades
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(230, 230, 230, 0.9)',
    shadowColor: '#000',
    
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'center',
  },
  buttonContainer: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 16,
    borderWidth:1,
    textDecorationColor:'#9400D3',
    backgroundColor: 'rgba(230, 230, 230, 0.9)',
    borderColor:'#9400D3',
    shadowOpacity:1,
    shadowRadius:16,
    shadowColor: '#9400D3',
    elevation: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  buttonText: {
    color:'#9400D3',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default MainScreen;