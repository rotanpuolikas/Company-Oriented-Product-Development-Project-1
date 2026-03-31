import {styles} from "../theme/Theme.js"
import {colours} from "../theme/Colours.js"
import { View, ActivityIndicator, TouchableOpacity, Text} from "react-native"
import React, {useState, useContext } from "react"
import { db } from "../firebase-auth"
import { useFocusEffect } from "@react-navigation/native"
import Ionicons from "@expo/vector-icons/Ionicons"
import { PieChart } from "react-native-gifted-charts"
import { AuthContext } from "../context/AuthContext"
import { collection, getDocs } from "firebase/firestore"
import AddExpensePopup from './AddExpensePopup.js'

const Etusivu = () => {
  const { user } = useContext(AuthContext)

  const [loading, setLoading] = useState(true)
  const [pieData, setPieData] = useState([])

  const [showPopup, setShowPopup] = useState(false)

  const [currentMonth, setCurrentMonth] = useState(new Date())

  function addMonths(date, months) { // simppeli kuukausien välillä siirtymisen helpperfunction
    const d = new Date(date)
    const dayOfMonth = d.getDate()
    d.setMonth(d.getMonth() + months)
    if (d.getDate() !== dayOfMonth) {
      d.setDate(0)
    }
    return d
  }

  const fetchData = async () => {
  try {
    const formatDay = currentMonth.toLocaleDateString('en-US', {month: 'long'}) + currentMonth.getFullYear()

    const userRefStaticIncome = collection(db, "users", user.uid, "userStaticIncomes")
    const userRefStaticExpense = collection(db, "users", user.uid, "userStaticExpenses")
    const userRefMonthExpense = collection(db, "users", user.uid, `${formatDay}_expenses`)
    const userRefMonthIncome = collection(db, "users", user.uid, `${formatDay}_incomes`)

    const [snapSI, snapSE, snapME, snapMI] = await Promise.all([
      getDocs(userRefStaticIncome),
      getDocs(userRefStaticExpense),
      getDocs(userRefMonthExpense),
      getDocs(userRefMonthIncome),
    ])

    const totalIncome =
      snapSI.docs.reduce((sum, d) => sum + d.data().amount, 0) +
      snapMI.docs.reduce((sum, d) => sum + d.data().amount, 0)

    const totalExpense =
      snapSE.docs.reduce((sum, d) => sum + d.data().amount, 0) +
      snapME.docs.reduce((sum, d) => sum + d.data().amount, 0)

    // piirakkadiagrammi täyttyy ylhäältä incomella ja 'tyhjenee' alhaalta päin.
    
    if (totalIncome === 0 && totalExpense === 0) {
      setPieData([{ value: 1, color: colours.borderColour }])
    } else if (totalExpense >= totalIncome) {
      setPieData([{ value: 1, color: colours.expense }])
    } else {
      const remaining = totalIncome - totalExpense
      setPieData([
        { value: remaining, color: colours.income },
        { value: totalExpense, color: colours.expense },
      ])
    }
  } catch (error) {
    console.log(error)
  }
  setLoading(false)
}

  useFocusEffect(
    React.useCallback(() => {
      fetchData()
    }, [currentMonth])
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

  return(
    <View style={styles.etusivu}>
      <View style={styles.hCenter}>
        <Text style={styles.kuukausiTeksti}>{currentMonth.toLocaleDateString('en-US', {month: 'long'}) + ' ' + currentMonth.getFullYear()}</Text>
        <PieChart
          data={pieData}
          initialAngle={Math.PI}
        />
      </View>



      <TouchableOpacity style={styles.buttonFrontpage} onPress={() => setShowPopup(true)}>
        <Ionicons name="add-outline" size={30} color={'#000'}/>
      </TouchableOpacity>


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
      <AddExpensePopup selectedMonth={currentMonth} visible={showPopup} onClose={(added) => {setShowPopup(false); if(added){fetchData()}}} />
    </View>
  )
}

export default Etusivu
