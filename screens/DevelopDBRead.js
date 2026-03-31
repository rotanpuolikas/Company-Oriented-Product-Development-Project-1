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

  const [staticIncomes, setStaticIncomes] = useState([])
  const [staticExpenses, setStaticExpenses] = useState([])
  const [monthIncomes, setMonthIncomes] = useState([])
  const [monthExpenses, setMonthExpenses] = useState([])
  
  const [loading, setLoading] = useState(true)
  const [ieState, setIEState] = useState(false)
  const [smState, setSMState] = useState(false)

  const [currentMonth, setCurrentMonth] = useState(new Date())

  function addMonths(date, months) {
    const d = new Date(date)
    const dayOfMonth = d.getDate()
    d.setMonth(d.getMonth() + months)
    if (d.getDate() !== dayOfMonth) {
      d.setDate(0)
    }
    return d
  }


  const fetchData = async () => {
    // mistä luetaan tulot
    try {
      const formatDay = currentMonth.toLocaleDateString('en-US', {month: 'long'}) + currentMonth.getFullYear()

      
      const userRefStaticIncome = collection(db, "users", user.uid, "userStaticIncomes")
      const userRefStaticExpense = collection(db, "users", user.uid, "userStaticExpenses")
      const userRefMonthExpense = collection(db, "users", user.uid, `${formatDay}_expenses`) // <- hakee tämänhetkisen kuukauden datat firebasesta, joku logiikkamuutos tehtävä jos halutaan aikaisempia kuukausia tutkia
      const userRefMonthIncome = collection(db, "users", user.uid, `${formatDay}_incomes`)
      
      const snapshotStaticIncome = await getDocs(userRefStaticIncome)
      const snapshotStaticExpense = await getDocs(userRefStaticExpense)
      const snapshotMonthExpense = await getDocs(userRefMonthExpense)
      const snapshotMonthIncome = await getDocs(userRefMonthIncome)
      
      const dataStaticIncome = snapshotStaticIncome.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      const dataStaticExpense = snapshotStaticExpense.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      const dataMonthIncome = snapshotMonthIncome.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      const dataMonthExpense = snapshotMonthExpense.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      
      setStaticIncomes(dataStaticIncome)
      setStaticExpenses(dataStaticExpense)
      setMonthIncomes(dataMonthIncome)
      setMonthExpenses(dataMonthExpense)
      
    } catch (error) { //jja jos tulee virhe databaseoperaatioissa, kerrotaan siitä ja jatketaan toimintaa, ei upota kuin titanic
      console.log(error)
    }

    setLoading(false)
  }
  // autorefresh
  useFocusEffect(
    React.useCallback(() => {
      fetchData()
    }, [])
  )

  // databasesta poistaminen, helpompaa ku kirjottaminen IMO
  const handleRemoveIncome = async (incomeId) => {
    try{
      const locationRef = doc(
        db,
        "users",
        user.uid,
        "userStaticIncomes",
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

  // jokasen elementin piirtäminen erikseen
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
    <View style={styles.hCenter}>
        <Text style={styles.kuukausiTeksti}>{currentMonth.toLocaleDateString('en-US', {month: 'long'}) + ' ' + currentMonth.getFullYear()}</Text>
        </View>

      <TouchableOpacity style={styles.devButton} onPress={() => {setIEState(!ieState)}}>
        <Text style={styles.buttonText}>Change to {ieState ? "expense" : "income"}</Text>
      </TouchableOpacity>

      <FlatList
        data={smState ? staticIncomes : staticExpenses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>No {smState ? "static" : "monthly"} incomes added yet.</Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("Dev db add")}
      >
        <Text style={styles.addButtonText}>+ Add Data</Text>
      </TouchableOpacity>
      <View style={styles.arrowsFrontpage}>
      <TouchableOpacity onPress={() => setCurrentMonth(addMonths(currentMonth, -1))}>
        <Ionicons name='arrow-back-outline' size={30} color={'#000'} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}>
        <Ionicons name='arrow-forward-outline' size={30} color={'#000'} />
      </TouchableOpacity>
      </View>

    </View>
  )
}

export default DevelopDBRead;
