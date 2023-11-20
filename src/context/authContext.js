// AuthProvider.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider, signInWithRedirect } from '@firebase/auth';
import { authContextt } from "../firebase-config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth'



export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export default function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    getUserData();
  },[]);

  const getUserData = async() => {
    const UserLoggedInData = await AsyncStorage.getItem("UserLoggedInData");
    if (UserLoggedInData){
      let udata= JSON.parse(UserLoggedInData);
      setUser(udata.user2.user);
      return udata;
    }
    return null;
  }
  const signup = (email, password) => {
    createUserWithEmailAndPassword(authContextt, email, password); // Implement auth methods
  };

  const login = (email, password) => signInWithEmailAndPassword(authContextt, email, password);

  const loginWithGoogle = () => {
    const googleProvider = new GoogleAuthProvider();
    return signInWithRedirect(authContextt, googleProvider); // Implement auth methods
  };

  const loginWithFacebook = () => {
    // Implement auth methods for Facebook
  };

  const logout = async () => {
    signOut(authContextt)
    AsyncStorage.setItem(
      "UserLoggedInData",
      JSON.stringify({... user ,loggedIn: false})
      );
      console.log("Cerrando session");
    auth()
        .signOut()
        .then(()=> console.log("User Cerro session"))
        setLoading(false);
  }

  useEffect(() => {
    onAuthStateChanged(authContextt, currentUser => {
      setUser(currentUser);
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ signup, login, user, logout, loading, loginWithGoogle, getUserData }}>
      {children}
    </AuthContext.Provider>
  );
}
