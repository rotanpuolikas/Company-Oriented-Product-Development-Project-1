import { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Keyboard } from "react-native"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase-auth"
import { AuthContext } from "../context/AuthContext"
import { styles } from '../theme/Theme.js'

const DevelopDBAccess = () => {
  const { user } = useContext(AuthContext)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [rawAmount, setRawAmount] = useState("")
  const [ieState, setIEState] = useState(false)

  function parseMoneyInput(raw) { // we save the inputted amounts x 100, ignoring every decimal after the second. javascript does funky stuff with floats sometimes so better to avoid using them
  if (!raw) return 0;
  let cleaned = raw.trim().replace(/\s/g, '')

  if (cleaned.includes(',') && cleaned.includes('.')) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.')
  }
  else {
    cleaned = cleaned.replace(',', '.')
  }

  const value = parseFloat(cleaned)
  if (isNaN(value)) return 0

  return Math.floor(value * 100)
}

  const handleAddIncome = async () => {
    Keyboard.dismiss() // get that keyboard out of the way
    
    if (!name || !amount) {
      Alert.alert("Error", "Please enter name and amount")
      return
    }

    if (amount < 0) {
      Alert.alert("Error", "Income source must be higher than 0€")
      return
    }

    try {
      const userRef = collection(
        db,
        "users",
        user.uid,
        "userIncomes"
      )

      await addDoc(userRef, {
        name,
        description,
        amount: amount,
        createdAt: serverTimestamp(),
      })

      Alert.alert("Success", "Income source added!")

      setName("")
      setDescription("")
      setAmount("")
      setRawAmount("")

    } catch (error) {
      console.log(error)
      Alert.alert("Error", "Could not save income")
    }
  }
  const handleAddExpense = async () => {
    Keyboard.dismiss() // get that keyboard out of the way
    
    if (!name || !amount) {
      Alert.alert("Error", "Please enter name and amount")
      return
    }

    if (amount < 0) { 
      Alert.alert("Error", "Expense must be higher than 0€")
      return
    }

    const today = new Date()
    const formatDay = today.toLocaleDateString('en-US', {month: 'long'}) + today.getFullYear()
    
    try {
      const userRef = collection(
        db,
        "users",
        user.uid,
        `${formatDay}_expenses`
      )

      await addDoc(userRef, {
        name,
        description,
        amount: amount,
        createdAt: new Date(),
      })

      Alert.alert("Success", "Expense added!")

      setName("")
      setDescription("")
      setAmount("")
      setRawAmount("")

    } catch (error) {
      console.log(error)
      Alert.alert("Error", "Could not save expense")
    }
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.devButton} onPress={() => {setIEState(!ieState)}}>
        <Text style={styles.buttonText}>Change to {ieState ? "expense" : "income"}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Add New {ieState ? "Income" : "Expense"}</Text>

      <TextInput
        placeholder={ieState ? "Income name" : "Expense name"}
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
        onChangeText={(text) => {
          setRawAmount(text)
          const parsed = parseMoneyInput(text)
          setAmount(parsed)
        }}
        style={styles.input}
        multilinei
        keyboardType="numeric"
      />
            
      <TouchableOpacity style={styles.button} onPress={ieState ? handleAddIncome : handleAddExpense}>
        <Text style={styles.buttonText}>Save {ieState ? "income" : "expense"}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default DevelopDBAccess
