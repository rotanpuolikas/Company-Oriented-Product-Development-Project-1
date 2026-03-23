import { createContext, useState, useEffect } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-auth";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // onAuthStateChanged works on both mobile and web via Firebase's built-in persistence
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? null)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged handles setUser automatically
  };

  const logout = async () => {
    await signOut(auth)
    // onAuthStateChanged handles setUser(null) automatically
  };

  if (loading) return null

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
