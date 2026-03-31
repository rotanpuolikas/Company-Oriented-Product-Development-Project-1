import { useState, useContext, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, Alert, Keyboard, ScrollView } from "react-native"
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase-auth"
import { AuthContext } from "../context/AuthContext"
import { styles } from '../theme/Theme.js'
import { colours } from '../theme/Colours.js'

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

const StaticManagement = () => {
  const { user } = useContext(AuthContext)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [rawAmount, setRawAmount] = useState("")
  const [amount, setAmount] = useState(0)
  const [isIncome, setIsIncome] = useState(true)
  const [staticIncomes, setStaticIncomes] = useState([])
  const [staticExpenses, setStaticExpenses] = useState([])

  const fetchStatic = async () => {
    try {
      const incomeRef = collection(db, "users", user.uid, "userStaticIncomes")
      const expenseRef = collection(db, "users", user.uid, "userStaticExpenses")
      const [incomeSnap, expenseSnap] = await Promise.all([getDocs(incomeRef), getDocs(expenseRef)])
      setStaticIncomes(incomeSnap.docs.map(d => ({ id: d.id, ...d.data() })))
      setStaticExpenses(expenseSnap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => { fetchStatic() }, [])

  const handleAdd = async () => {
    Keyboard.dismiss()
    if (!name || !amount) {
      Alert.alert("Error", "Please enter name and amount")
      return
    }
    try {
      const collectionName = isIncome ? "userStaticIncomes" : "userStaticExpenses"
      await addDoc(collection(db, "users", user.uid, collectionName), {
        name,
        description,
        amount,
        createdAt: serverTimestamp(),
      })
      Alert.alert("Success", `Static ${isIncome ? "income" : "expense"} added!`)
      setName("")
      setDescription("")
      setRawAmount("")
      setAmount(0)
      fetchStatic()
    } catch (error) {
      console.log(error)
      Alert.alert("Error", "Could not save")
    }
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.devButton} onPress={() => setIsIncome(!isIncome)}>
        <Text style={styles.buttonText}>Change to {isIncome ? "expense" : "income"}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Add Static {isIncome ? "Income" : "Expense"}</Text>

      <TextInput
        placeholder={isIncome ? "Income name" : "Expense name"}
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
      />
      <TextInput
        placeholder="Amount"
        value={rawAmount}
        onChangeText={(text) => { setRawAmount(text); setAmount(parseMoneyInput(text)) }}
        style={styles.input}
        keyboardType="numeric"
      />
      <TouchableOpacity style={[styles.button, { marginBottom: 30 }]} onPress={handleAdd}>
        <Text style={styles.buttonText}>Save static {isIncome ? "income" : "expense"}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Static Incomes</Text>
      {staticIncomes.length === 0 && <Text style={styles.empty}>No static incomes yet</Text>}
      {staticIncomes.map(item => (
        <View key={item.id} style={[styles.card, { borderLeftWidth: 4, borderLeftColor: colours.income }]}>
          <View style={styles.cardTopRow}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={{ color: colours.secondary, fontWeight: '600' }}>
              +€{(item.amount / 100).toFixed(2)}
            </Text>
          </View>
          {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
        </View>
      ))}

      <Text style={[styles.title, { marginTop: 20 }]}>Static Expenses</Text>
      {staticExpenses.length === 0 && <Text style={styles.empty}>No static expenses yet</Text>}
      {staticExpenses.map(item => (
        <View key={item.id} style={[styles.card, { borderLeftWidth: 4, borderLeftColor: colours.expense }]}>
          <View style={styles.cardTopRow}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={{ color: colours.error, fontWeight: '600' }}>
              -€{(item.amount / 100).toFixed(2)}
            </Text>
          </View>
          {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
        </View>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  )
}

export default StaticManagement
