import React, { useState, useContext } from "react"
import { View, Text, TextInput, TouchableOpacity, Alert, Keyboard,
         FlatList, ActivityIndicator, Pressable } from "react-native"
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase-auth"
import { AuthContext } from "../context/AuthContext"
import { styles } from '../theme/Theme.js'
import { colours } from '../theme/Colours.js'
import { useFocusEffect } from "@react-navigation/native"
import Ionicons from "@expo/vector-icons/Ionicons"

function parseMoneyInput(raw) {
  if (!raw) return 0
  let cleaned = raw.trim().replace(/\s/g, '')
  if (cleaned.includes(',') && cleaned.includes('.')) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.')
  } else {
    cleaned = cleaned.replace(',', '.')
  }
  const value = parseFloat(cleaned)
  if (isNaN(value)) return 0
  return Math.floor(value * 100)
}

const AddTab = () => {
  const { user } = useContext(AuthContext)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [rawAmount, setRawAmount] = useState("")
  const [ieState, setIEState] = useState(false)

  const handleAddIncome = async () => {
    Keyboard.dismiss()
    if (!name || !amount) { Alert.alert("Error", "Please enter name and amount"); return }
    try {
      await addDoc(collection(db, "users", user.uid, "userIncomes"), {
        name, description, amount,
        createdAt: serverTimestamp(),
      })
      Alert.alert("Success", "Income source added!")
      setName(""); setDescription(""); setAmount(""); setRawAmount("")
    } catch (error) {
      console.log(error)
      Alert.alert("Error", "Could not save income")
    }
  }

  const handleAddExpense = async () => {
    Keyboard.dismiss()
    if (!name || !amount) { Alert.alert("Error", "Please enter name and amount"); return }
    const today = new Date()
    const formatDay = today.toLocaleDateString('en-US', { month: 'long' }) + today.getFullYear()
    try {
      await addDoc(collection(db, "users", user.uid, `${formatDay}_expenses`), {
        name, description, amount,
        createdAt: new Date(),
      })
      Alert.alert("Success", "Expense added!")
      setName(""); setDescription(""); setAmount(""); setRawAmount("")
    } catch (error) {
      console.log(error)
      Alert.alert("Error", "Could not save expense")
    }
  }

  return (
    <View>
      <TouchableOpacity style={styles.devButton} onPress={() => setIEState(!ieState)}>
        <Text style={styles.buttonText}>Change to {ieState ? "expense" : "income"}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Add New {ieState ? "Income" : "Expense"}</Text>
      <TextInput
        placeholder={ieState ? "Income name" : "Expense name"}
        value={name} onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description} onChangeText={setDescription}
        style={styles.input} multiline
      />
      <TextInput
        placeholder="Amount"
        value={rawAmount}
        onChangeText={(text) => { setRawAmount(text); setAmount(parseMoneyInput(text)) }}
        style={styles.input}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={ieState ? handleAddIncome : handleAddExpense}>
        <Text style={styles.buttonText}>Save {ieState ? "income" : "expense"}</Text>
      </TouchableOpacity>
    </View>
  )
}

const removeButtonOnRight = true
const removeButtonSize = 20

const ListTab = () => {
  const { user } = useContext(AuthContext)
  const [staticIncomes, setStaticIncomes] = useState([])
  const [staticExpenses, setStaticExpenses] = useState([])
  const [monthIncomes, setMonthIncomes] = useState([])
  const [monthExpenses, setMonthExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [ieState, setIEState] = useState(false)
  const [smState, setSmState] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  function addMonths(date, months) {
    const d = new Date(date)
    const dayOfMonth = d.getDate()
    d.setMonth(d.getMonth() + months)
    if (d.getDate() !== dayOfMonth) d.setDate(0)
    return d
  }

  const fetchData = async () => {
    try {
      const formatDay = currentMonth.toLocaleDateString('en-US', { month: 'long' }) + currentMonth.getFullYear()
      const [snapSI, snapSE, snapME, snapMI] = await Promise.all([
        getDocs(collection(db, "users", user.uid, "userStaticIncomes")),
        getDocs(collection(db, "users", user.uid, "userStaticExpenses")),
        getDocs(collection(db, "users", user.uid, `${formatDay}_expenses`)),
        getDocs(collection(db, "users", user.uid, `${formatDay}_incomes`)),
      ])
      setStaticIncomes(snapSI.docs.map(d => ({ id: d.id, ...d.data() })))
      setStaticExpenses(snapSE.docs.map(d => ({ id: d.id, ...d.data() })))
      setMonthIncomes(snapMI.docs.map(d => ({ id: d.id, ...d.data() })))
      setMonthExpenses(snapME.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  useFocusEffect(React.useCallback(() => { fetchData() }, [currentMonth]))

  const handleRemoveIncome = async (id) => {
    try {
      await deleteDoc(doc(db, "users", user.uid, "userStaticIncomes", id))
      setStaticIncomes(prev => prev.filter(i => i.id !== id))
      Alert.alert("Success", "Income source removed!")
    } catch (err) {
      console.log(err)
      Alert.alert("Error", "Could not remove income source")
    }
  }

  const handleRemoveExpense = async (id) => {
    try {
      const formatDay = currentMonth.toLocaleDateString('en-US', { month: 'long' }) + currentMonth.getFullYear()
      await deleteDoc(doc(db, "users", user.uid, `${formatDay}_expenses`, id))
      setMonthExpenses(prev => prev.filter(i => i.id !== id))
      Alert.alert("Success", "Expense removed!")
    } catch (err) {
      console.log(err)
      Alert.alert("Error", "Could not remove expense")
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <Pressable onPress={removeButtonOnRight ? () => {} : () => { ieState ? handleRemoveIncome(item.id) : handleRemoveExpense(item.id) }}>
          <Ionicons name="close-outline" size={removeButtonSize} color={removeButtonOnRight ? colours.card : colours.error} />
        </Pressable>
        <Text style={styles.name}>{item.name}</Text>
        <Pressable onPress={removeButtonOnRight ? () => { ieState ? handleRemoveIncome(item.id) : handleRemoveExpense(item.id) } : () => {}}>
          <Ionicons name="close-outline" size={removeButtonSize} color={removeButtonOnRight ? colours.error : colours.card} />
        </Pressable>
      </View>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.description}>{item.amount / 100}€</Text>
    </View>
  )

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colours.primary} />
      </View>
    )
  }

  const now = new Date()
  const isCurrentMonth =
    currentMonth.getFullYear() === now.getFullYear() &&
    currentMonth.getMonth() === now.getMonth()

  const listData = ieState
    ? (smState ? staticIncomes : monthIncomes)
    : (smState ? staticExpenses : monthExpenses)

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.kuukausiTeksti}>
        {currentMonth.toLocaleDateString('en-US', { month: 'long' }) + ' ' + currentMonth.getFullYear()}
      </Text>
      <TouchableOpacity style={styles.devButton} onPress={() => setIEState(!ieState)}>
        <Text style={styles.buttonText}>Showing {ieState ? "incomes" : "expenses"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.devButton} onPress={() => setSmState(!smState)}>
        <Text style={styles.buttonText}>Showing {smState ? "static" : "monthly"}</Text>
      </TouchableOpacity>
      <FlatList
        data={listData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>No {smState ? "static" : "monthly"} {ieState ? "incomes" : "expenses"} yet.</Text>
        }
        scrollEnabled={false}
      />
      <View style={styles.arrowsFrontpage}>
        <TouchableOpacity onPress={() => setCurrentMonth(addMonths(currentMonth, -1))}>
          <Ionicons name='arrow-back-outline' size={30} color={'#000'} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => !isCurrentMonth && setCurrentMonth(addMonths(currentMonth, 1))}
          disabled={isCurrentMonth}
        >
          <Ionicons name='arrow-forward-outline' size={30} color={isCurrentMonth ? '#ccc' : '#000'} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const DeveloperThings = () => {
  const [tab, setTab] = useState('add')

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', marginBottom: 20, gap: 10 }}>
        <TouchableOpacity
          style={[styles.button, { flex: 1, backgroundColor: tab === 'add' ? colours.secondary : colours.button }]}
          onPress={() => setTab('add')}
        >
          <Text style={[styles.buttonText, { color: tab === 'add' ? colours.card : colours.blackText }]}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { flex: 1, backgroundColor: tab === 'list' ? colours.secondary : colours.button }]}
          onPress={() => setTab('list')}
        >
          <Text style={[styles.buttonText, { color: tab === 'list' ? colours.card : colours.blackText }]}>List</Text>
        </TouchableOpacity>
      </View>
      {tab === 'add' ? <AddTab /> : <ListTab />}
    </View>
  )
}

export default DeveloperThings
