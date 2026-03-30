import {styles} from "../theme/Theme.js"
import {colours} from "../theme/Colours.js"
import { View, ActivityIndicator, TouchableOpacity} from "react-native"
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
  
  const fetchData = async () => {
  try {
    
    const today = new Date() // muodostetaan se firebasen käyttämä March2026 / April2026 formaatti collectioneille
    const formatDay = today.toLocaleDateString('en-US', {month: 'long'}) + today.getFullYear()
    
    const userRefIncome = collection(db, "users", user.uid, "userIncomes")
    const userRefExpense = collection(db, "users", user.uid, `${formatDay}_expenses`) // <- hakee tämänhetkisen kuukauden datat firebasesta, joku logiikkamuutos tehtävä jos halutaan aikaisempia kuukausia tutkia
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

    // piirretään firebasesta haettu data piirakkadiagrammiin
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
  useFocusEffect( // autorefresh aina kun klikataan takasin etusivulle
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
    <View style={styles.etusivu}>
      <View style={styles.hCenter}>
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
      
      <AddExpensePopup visible={showPopup} onClose={(added) => {setShowPopup(false); if(added){fetchData()}}} />
    </View>
  )
}

export default Etusivu
