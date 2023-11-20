import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MainScreen from './src/components/Main';
import HomeScreen from './src/components/Home';
import ProfileScreen from './src/components/Profile';
import LoginScreen from './src/components/Login';
import RegisterScreen from './src/components/Register';
import { useAuth } from './src/context/authContext';
import AuthProvider from './src/context/authContext';
import Reportes from './src/components/Reportar';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { CommonActions } from '@react-navigation/native';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'user' : 'user';
          } else if (route.name === 'Reportar') {
            iconName = focused ? 'exclamation-triangle' : 'exclamation-triangle';
          }

          return <FontAwesome5 name={iconName} size={size} color={'lightblue'} />;
        },
      })}
    >
      <Tab.Screen name="Reportar" component={Reportes} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
       <NavigationContainer>
      <AppContent />
         </NavigationContainer>
    </AuthProvider>
  );
}


function AppContent() {
  const { user, loading,  getUserData  } = useAuth();
  const navigation = useNavigation(); // Mover el uso de useNavigation aquí


  if (loading) {
    return null; // or a loading indicator if needed
  }

  return (
    /*Esto es para los componentes que estan por fuera de login*/
   
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Tab" component={MainTabNavigator} />

          </>
        ) : (
          <>
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="Tab" component={MainTabNavigator} />
          </>

        )}
      </Stack.Navigator>
   
  );
}
