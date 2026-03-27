import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase-auth";

export const AuthContext = createContext()

// magic file, do not touch

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user"); // autologin
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }
    loadUser()
  }, [])

  const login = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    setUser(res.user)
    await AsyncStorage.setItem("user", JSON.stringify(res.user)) // set asyncstorage for autologin
  };

  const logout = async () => {
    await signOut(auth)
    await AsyncStorage.removeItem("user")
    setUser(null) //null user proved to cause problems sometimes, but not looking for a fix
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
