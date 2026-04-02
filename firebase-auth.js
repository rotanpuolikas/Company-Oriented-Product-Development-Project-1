import { initializeApp } from "firebase/app"
import { initializeAuth, getReactNativePersistence, browserLocalPersistence } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { Platform } from "react-native"
import { firebaseConfig } from "./firebaseConfig"

const app = initializeApp(firebaseConfig)

const getAuthPersistence = () => {
  if (Platform.OS === 'web') {
    return browserLocalPersistence
  }
  const ReactNativeAsyncStorage = require("@react-native-async-storage/async-storage").default
  return getReactNativePersistence(ReactNativeAsyncStorage)
}

export const auth = initializeAuth(app, { persistence: getAuthPersistence() })
export const db = getFirestore(app)
