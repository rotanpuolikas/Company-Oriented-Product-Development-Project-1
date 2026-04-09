import { createContext, useEffect, useState } from 'react'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '../firebase-auth'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('webUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const currentUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        }
        setUser(currentUser)
        localStorage.setItem('webUser', JSON.stringify(currentUser))
      } else {
        setUser(null)
        localStorage.removeItem('webUser')
      }
    })

    return () => unsubscribe()
  }, [])

  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error('Missing credentials')
    }

    const credential = await signInWithEmailAndPassword(auth, email, password)
    const firebaseUser = credential.user
    const currentUser = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
    }

    setUser(currentUser)
    localStorage.setItem('webUser', JSON.stringify(currentUser))
    return currentUser
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
    localStorage.removeItem('webUser')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}