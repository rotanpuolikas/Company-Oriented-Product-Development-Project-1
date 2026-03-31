import {styles} from "../theme/Theme.js"
import {colours} from "../theme/Colours.js"
import { View, ActivityIndicator, TouchableOpacity, Text} from "react-native"
import React, {useState, useContext } from "react"
import { db } from "../firebase-auth"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import Ionicons from "@expo/vector-icons/Ionicons"
import { PieChart } from "react-native-gifted-charts"
import { AuthContext } from "../context/AuthContext"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import AddExpensePopup from './AddExpensePopup.js'

const Etusivu = () => {
  const { user } = useContext(AuthContext)

  const [loading, setLoading] = useState(true)
  const [pieData, setPieData] = useState([])

  const [showPopup, setShowPopup] = useState(false)

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

    // piirretään firebasesta haettu data piirakkadiagrammiin
    setPieData([
      ...dataStaticIncome.map((item) => ({
        value: item.amount / 100,
        color: colours.income,
        text: item.name,
      })),
      ...dataMonthExpense.map((item) => ({
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
  useFocusEffect( // autorefresh aina kun klikataan takasin etusivulle
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

  
  return(
    <View style={styles.etusivu}>
      <View style={styles.hCenter}>
        <Text style={styles.kuukausiTeksti}>{currentMonth.toLocaleDateString('en-US', {month: 'long'}) + ' ' + currentMonth.getFullYear()}</Text>
        <PieChart
          data={pieData}
          textColor="black"
          textSize={12}
          focusOnPress
        />
      </View>



      <TouchableOpacity style={styles.buttonFrontpage} onPress={() => setShowPopup(true)}>
        <Ionicons name="add-outline" size={30} color={'#000'}/>
      </TouchableOpacity>
      

      <View style={styles.arrowsFrontpage}>
      <TouchableOpacity onPress={() => setCurrentMonth(addMonths(currentMonth, -1))}>
        <Ionicons name='arrow-back-outline' size={30} color={'#000'} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}>
        <Ionicons name='arrow-forward-outline' size={30} color={'#000'} />
      </TouchableOpacity>
      </View>
      <AddExpensePopup selectedMonth={currentMonth} visible={showPopup} onClose={(added) => {setShowPopup(false); if(added){fetchData()}}} />
    </View>
  )
}

export default Etusivu
