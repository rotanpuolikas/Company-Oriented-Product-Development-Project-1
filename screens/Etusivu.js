import {styles} from "../theme/Theme.js"
import {colours} from "../theme/Colours.js"
import { View, ActivityIndicator} from "react-native"
import React, {useState, useContext } from "react"
import { db } from "../firebase-auth"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import Ionicons from "@expo/vector-icons/Ionicons"
import { PieChart } from "react-native-gifted-charts"
import { AuthContext } from "../context/AuthContext"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"


const Etusivu = () => {
  const { user } = useContext(AuthContext)
  const navigation = useNavigation()

  const [incomes, setIncomes] = useState([])
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [pieData, setPieData] = useState([])
  
  const fetchData = async () => {
  try {
    const userRefIncome = collection(db, "users", user.uid, "userIncomes")
    const userRefExpense = collection(db, "users", user.uid, "userExpenses")
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

    // use dataIncome/dataExpense, not incomes/expenses
    setPieData([
      ...dataIncome.map((item) => ({
        value: item.amount / 100,
        color: colours.income,
        text: item.name,
      })),
      ...dataExpense.map((item) => ({
        value: item.amount / 100,
        color: colours.expense,
        text: item.name,
      })),
    ])
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


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colours.primary} />
      </View>
    )
  }

  
  return(
    <View>
      <PieChart
        style={styles.piechart}
        data={pieData}
        donut
        innerRadius={60}
        showText
        textColor="white"
        textSize={12}
        focusOnPress
      />
    </View>
  )
}

export default Etusivu
