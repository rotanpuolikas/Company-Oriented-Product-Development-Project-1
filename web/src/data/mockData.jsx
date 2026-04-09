import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { db } from '../firebase-auth'

const userBudgetCollection = (uid) => collection(db, 'users', uid, 'budgetItems')

const toItem = (docSnap) => ({ id: docSnap.id, ...docSnap.data() })

export async function fetchItemsByType(uid, type) {
  if (!uid) return []
  const q = query(userBudgetCollection(uid), where('type', '==', type))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(toItem)
}

export async function addItem(uid, item) {
  if (!uid) throw new Error('Missing user uid')
  const docRef = await addDoc(userBudgetCollection(uid), {
    name: item.name,
    description: item.description || '',
    amount: item.amount,
    type: item.type,
    createdAt: new Date().toISOString(),
  })

  return {
    id: docRef.id,
    name: item.name,
    description: item.description || '',
    amount: item.amount,
    type: item.type,
    createdAt: new Date().toISOString(),
  }
}

export async function deleteItem(uid, itemId) {
  if (!uid || !itemId) throw new Error('Missing uid or item id')
  return deleteDoc(doc(db, 'users', uid, 'budgetItems', itemId))
}
// mockData.js - simuloitu tietolähde, joka käyttää Firebase Firestorea tietojen tallentamiseen ja hakemiseen, halusin itkeä tämän kanssa