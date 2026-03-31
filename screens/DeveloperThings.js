import { useState, useContext, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, Alert, Keyboard,
         FlatList, ActivityIndicator, Pressable, ScrollView } from "react-native"
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase-auth"
import { AuthContext } from "../context/AuthContext"
import { styles } from '../theme/Theme.js'
import { colours } from '../theme/Colours.js'
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
  const [amount, setAmount] = useState(0)
  const [rawAmount, setRawAmount] = useState("")
  const [isIncome, setIsIncome] = useState(true)
  const [isStatic, setIsStatic] = useState(false)

  const handleAdd = async () => {
    Keyboard.dismiss()
    if (!name || !amount) { Alert.alert("Error", "Please enter name and amount"); return }

    const today = new Date()
    const formatDay = today.toLocaleDateString('en-US', { month: 'long' }) + today.getFullYear()

    let collectionName
    if (isIncome && isStatic)   collectionName = 'userStaticIncomes'
    else if (isIncome)          collectionName = `${formatDay}_incomes`
    else if (isStatic)          collectionName = 'userStaticExpenses'
    else                        collectionName = `${formatDay}_expenses`

    try {
      await addDoc(collection(db, "users", user.uid, collectionName), {
        name,
        description,
        amount,
        createdAt: serverTimestamp(),
      })
      Alert.alert("Success", `${isStatic ? 'Static ' : ''}${isIncome ? 'income' : 'expense'} added!`)
      setName(""); setDescription(""); setRawAmount(""); setAmount(0)
    } catch (error) {
      console.log(error)
      Alert.alert("Error", "Could not save")
    }
  }

  const typeLabel = `${isStatic ? 'Static ' : 'Monthly '}${isIncome ? 'Income' : 'Expense'}`

  return (
    <ScrollView>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
        <TouchableOpacity
          style={[styles.button, { flex: 1, backgroundColor: isIncome ? colours.secondary : colours.button }]}
          onPress={() => setIsIncome(!isIncome)}
        >
          <Text style={[styles.buttonText, { color: isIncome ? colours.card : colours.blackText }]}>
            {isIncome ? 'Income' : 'Expense'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { flex: 1, backgroundColor: isStatic ? colours.secondary : colours.button }]}
          onPress={() => setIsStatic(!isStatic)}
        >
          <Text style={[styles.buttonText, { color: isStatic ? colours.card : colours.blackText }]}>
            {isStatic ? 'Static' : 'Monthly'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Add New {typeLabel}</Text>
      <TextInput
        placeholder={`${typeLabel} name`}
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
      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Save {typeLabel}</Text>
      </TouchableOpacity>
    </ScrollView>
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
    setLoading(true)
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

  useEffect(() => { fetchData() }, [currentMonth])

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
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
        <TouchableOpacity
          style={[styles.button, { flex: 1, backgroundColor: ieState ? colours.secondary : colours.button }]}
          onPress={() => setIEState(!ieState)}
        >
          <Text style={[styles.buttonText, { color: ieState ? colours.card : colours.blackText }]}>
            {ieState ? 'Incomes' : 'Expenses'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { flex: 1, backgroundColor: smState ? colours.secondary : colours.button }]}
          onPress={() => setSmState(!smState)}
        >
          <Text style={[styles.buttonText, { color: smState ? colours.card : colours.blackText }]}>
            {smState ? 'Static' : 'Monthly'}
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={{ flex: 1 }}
        data={listData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>No {smState ? "static" : "monthly"} {ieState ? "incomes" : "expenses"} yet.</Text>
        }
      />
      <View style={[styles.arrowsFrontpage, { marginTop: 12 }]}>
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
