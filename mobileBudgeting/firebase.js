import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage"

import firebaseConfig from './firebase-auth.js' // contains secrets :)


const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app); shows a warning but doesn't really break anything...
export const auth = initializeAuth(app, {persistence: getReactNativePersistence(ReactNativeAsyncStorage)})
export const db = getFirestore(app);
