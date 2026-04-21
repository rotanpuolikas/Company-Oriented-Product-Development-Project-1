import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase-auth'

function formatMonth(date = new Date()) {
  return date.toLocaleDateString('en-US', { month: 'long' }) + date.getFullYear()
}

function getCollectionName(type, month) {
  const fmt = formatMonth(month)
  switch (type) {
    case 'staticIncome':   return 'userStaticIncomes'
    case 'staticExpense':  return 'userStaticExpenses'
    case 'monthlyIncome':  return `${fmt}_incomes`
    case 'monthlyExpense': return `${fmt}_expenses`
    default: throw new Error(`Unknown item type: ${type}`)
  }
}

const userCol = (uid, name) => collection(db, 'users', uid, name)

export async function fetchItemsByType(uid, type, month) {
  if (!uid) return []
  const name = getCollectionName(type, month)
  const snapshot = await getDocs(userCol(uid, name))
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function addItem(uid, item, month) {
  if (!uid) throw new Error('Missing user uid')
  const name = getCollectionName(item.type, month)
  const payload = {
    name: item.name,
    description: item.description || '',
    amount: item.amount,
    createdAt: serverTimestamp(),
  }
  const docRef = await addDoc(userCol(uid, name), payload)
  return { id: docRef.id, ...payload, createdAt: new Date().toISOString() }
}

export async function deleteItem(uid, itemId, type, month) {
  if (!uid || !itemId) throw new Error('Missing uid or item id')
  const name = getCollectionName(type, month)
  return deleteDoc(doc(db, 'users', uid, name, itemId))
}
