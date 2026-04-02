import { createContext, useState, useEffect } from "react";
import { Platform } from "react-native";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase-auth";

const storage = Platform.OS === 'web'
  ? {
      getItem: (key) => Promise.resolve(localStorage.getItem(key)),
      setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
      removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
    }
  : require("@react-native-async-storage/async-storage").default;

export const AuthContext = createContext()

// magic file, do not touch

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await storage.getItem("user"); // autologin
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }
    loadUser()
  }, [])

  const login = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    setUser(res.user)
    await storage.setItem("user", JSON.stringify(res.user)) // set asyncstorage for autologin
  };

  const logout = async () => {
    await signOut(auth)
    await storage.removeItem("user")
    setUser(null) //null user proved to cause problems sometimes, but not looking for a fix
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
