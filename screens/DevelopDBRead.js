import React, { useState, useEffect, useContext } from "react"
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Pressable, Alert} from "react-native"
import { styles } from "../theme/Theme.js"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { db } from "../firebase-auth"
import { AuthContext } from "../context/AuthContext"
import { colours } from "../theme/Colours.js"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import Ionicons from "@expo/vector-icons/Ionicons"

const removeButtonOnRight = true // which side should the button be on? also to have two buttons helps with the alignment of text on the top row of each entry
const removeButtonSize = 20

const DevelopDBRead = () => {
  const { user } = useContext(AuthContext)
  const navigation = useNavigation()

  const [incomes, setIncomes] = useState([])
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [ieState, setIEState] = useState(false)

  const fetchData = async () => {
    try {
      const userRefIncome = collection(
        db,
        "users",
        user.uid,
        "userIncomes"
      )
      
      const today = new Date()
      const formatDay = today.toLocaleDateString('en-US', {month: 'long'}) + today.getFullYear()
      const userRefExpense = collection(
        db,
        "users",
        user.uid,
        `${formatDay}_expenses`
      )

      const snapshotIncome = await getDocs(userRefIncome)
      const snapshotExpense = await getDocs(userRefExpense)

      const dataIncome = snapshotIncome.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      const dataExpense = snapshotExpense.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setIncomes(dataIncome)
      setExpenses(dataExpense)
    } catch (error) {
      console.log(error)
    }

    setLoading(false)
  }
  useFocusEffect(
    React.useCallback(() => {
      fetchData()
    }, [])
  )
  const handleRemoveIncome = async (incomeId) => {
    try{
      const locationRef = doc(
        db,
        "users",
        user.uid,
        "userIncomes",
        incomeId
      )

      await deleteDoc(locationRef)
      setIncomes((prev) => prev.filter((i) => i.id !== incomeId))
      Alert.alert("Success", "Income source removed!")
    } catch (err) {
      console.log(err)
      Alert.alert("Error", "Could not remove income source")
    }
  }
  const handleRemoveExpense = async (expenseId) => {
    try{
      const today = new Date()
      const formatDay = today.toLocaleDateString('en-US', {month: 'long'}) + today.getFullYear()
      const locationRef = doc(
        db,
        "users",
        user.uid,
        `${formatDay}_expenses`,
        expenseId
      )

      await deleteDoc(locationRef)
      setExpenses((prev) => prev.filter((i) => i.id !== expenseId))
      Alert.alert("Success", "Expense removed!")
    } catch (err) {
      console.log(err)
      Alert.alert("Error", "Could not remove expense")
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <Pressable onPress={removeButtonOnRight ? () => {} : () => {ieState ? handleRemoveIncome(item.id) : handleRemoveExpense(item.id)}}>
          <Ionicons name="close-outline" size={removeButtonSize} color={removeButtonOnRight ? colours.card : colours.error} />
        </Pressable>
        <Text style={styles.name}>{item.name}</Text>
        <Pressable onPress={removeButtonOnRight ? () => {ieState ? handleRemoveIncome(item.id) : handleRemoveExpense(item.id)} : () => {}}>
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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.devButton} onPress={() => {setIEState(!ieState)}}>
        <Text style={styles.buttonText}>Change to {ieState ? "expense" : "income"}</Text>
      </TouchableOpacity>

      <FlatList
        data={ieState ? incomes : expenses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>No {ieState ? "incomes" : "expenses"} added yet.</Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("Dev db add")}
      >
        <Text style={styles.addButtonText}>+ Add Data</Text>
      </TouchableOpacity>
    </View>
  )
}

export default DevelopDBRead;
