import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase-auth";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        };
        setUser(userData)
        AsyncStorage.setItem("user", JSON.stringify(userData))
      } else {
        setUser(null);
        AsyncStorage.removeItem("user")
      }
    })
    return unsubscribe;
  }, []);
  
  const login = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const userData = {
      uid: res.user.uid,
      email: res.user.email,
      displayName: res.user.displayName,
    }
    setUser(userData)
    await AsyncStorage.setItem("user", JSON.stringify(userData)) // set asyncstorage for autologin
  };

  const logout = async () => {
    await signOut(auth)
    await AsyncStorage.removeItem("user")
    setUser(null) //null user proved to cause problems sometimes, looking for a fix
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
