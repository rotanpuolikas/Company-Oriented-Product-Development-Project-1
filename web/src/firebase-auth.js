import { initializeApp, getApps, getApp } from 'firebase/app'
import { initializeAuth, browserLocalPersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { firebaseConfig } from '../../firebaseConfig'

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
export const auth = initializeAuth(app, { persistence: browserLocalPersistence })
export const db = getFirestore(app)
