import { styles } from "../theme/Theme.js"
import { colours } from "../theme/Colours.js"
import { View, Animated, ActivityIndicator, TouchableOpacity, Text, FlatList, Platform } from "react-native"
import React, { useState, useContext, useRef } from "react"
import { db } from "../firebase-auth"
import { useFocusEffect } from "@react-navigation/native"
import Ionicons from "@expo/vector-icons/Ionicons"
import { PieChart } from "react-native-gifted-charts"
import { AuthContext } from "../context/AuthContext"
import { useLocale } from "../context/LocaleContext"
import { collection, getDocs } from "firebase/firestore"
import AddExpensePopup from './AddExpensePopup.js'

const EXPENSE_PALETTE = [
  '#D96060',
  '#D99040',
  '#C06090',
  '#9060B0',
  '#6080B0',
  '#A06040',
]

const Etusivu = () => {
  const { user } = useContext(AuthContext)
  const { t } = useLocale()

  const [loading, setLoading] = useState(true)
  const [monthExpenses, setMonthExpenses] = useState([])
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalStaticExpense, setTotalStaticExpense] = useState(0)
  const [showPopup, setShowPopup] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedId, setSelectedId] = useState(null)

  const controlsTranslateY = useRef(new Animated.Value(0)).current
  const lastScrollY = useRef(0)
  const controlsVisible = useRef(true)

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

      const ti =
        snapSI.docs.reduce((s, d) => s + d.data().amount, 0) +
        snapMI.docs.reduce((s, d) => s + d.data().amount, 0)
      const tse = snapSE.docs.reduce((s, d) => s + d.data().amount, 0)
      const me = snapME.docs.map(d => ({ id: d.id, ...d.data() }))

      setTotalIncome(ti)
      setTotalStaticExpense(tse)
      setMonthExpenses(me)
      setSelectedId(null)
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  useFocusEffect(
    React.useCallback(() => { fetchData() }, [currentMonth])
  )

  const handleScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y
    const scrollingDown = y > lastScrollY.current
    lastScrollY.current = y

    if (scrollingDown && controlsVisible.current && y > 20) {
      controlsVisible.current = false
      Animated.timing(controlsTranslateY, { toValue: 140, duration: 220, useNativeDriver: Platform.OS !== 'web' }).start()
    } else if (!scrollingDown && !controlsVisible.current) {
      controlsVisible.current = true
      Animated.timing(controlsTranslateY, { toValue: 0, duration: 220, useNativeDriver: Platform.OS !== 'web' }).start()
    }
  }

  const totalMonthExpense = monthExpenses.reduce((s, e) => s + e.amount, 0)
  const remaining = Math.max(0, totalIncome - totalStaticExpense - totalMonthExpense)
  const balance = totalIncome - totalStaticExpense - totalMonthExpense
  const pieData = []
  if (remaining > 0) {
    pieData.push({
      value: remaining,
      color: colours.income,
      strokeColor: 'white',
      strokeWidth: 2,
      onPress: () => setSelectedId(null),
    })
  }
  if (totalStaticExpense > 0) {
    pieData.push({
      value: Math.min(totalStaticExpense, totalIncome || totalStaticExpense),
      color: '#A05050',
      strokeColor: 'white',
      strokeWidth: 2,
    })
  }
  monthExpenses.forEach((e, i) => {
    pieData.push({
      value: e.amount,
      color: EXPENSE_PALETTE[i % EXPENSE_PALETTE.length],
      strokeColor: 'white',
      strokeWidth: 2,
      focused: e.id === selectedId,
      onPress: () => setSelectedId(selectedId === e.id ? null : e.id),
    })
  })
  if (pieData.length === 0) {
    pieData.push({ value: 1, color: colours.borderColour, strokeColor: 'white', strokeWidth: 2 })
  }

  const now = new Date()
  const isCurrentMonth =
    currentMonth.getFullYear() === now.getFullYear() &&
    currentMonth.getMonth() === now.getMonth()

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colours.primary} />
      </View>
    )
  }

  const renderExpenseItem = ({ item, index }) => {
    const isSelected = item.id === selectedId
    const color = EXPENSE_PALETTE[index % EXPENSE_PALETTE.length]
    return (
      <TouchableOpacity
        onPress={() => setSelectedId(selectedId === item.id ? null : item.id)}
        style={[
          styles.card,
          { marginHorizontal: 16, borderLeftWidth: 4, borderLeftColor: color },
          isSelected && { borderWidth: 2, borderColor: color },
        ]}
      >
        <View style={styles.cardTopRow}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={{ color: colours.error, fontWeight: '600' }}>
            -{(item.amount / 100).toFixed(2)}€
          </Text>
        </View>
        {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.etusivu}>
      <FlatList
        ListHeaderComponent={
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.kuukausiTeksti}>
              {currentMonth.toLocaleDateString('en-US', { month: 'long' }) + ' ' + currentMonth.getFullYear()}
            </Text>
            <Text>
              {(balance / 100).toFixed(2)} €
            </Text>
            <PieChart
              data={pieData}
              initialAngle={Math.PI}
              focusOnPress={false}
            />
          </View>
        }
        data={monthExpenses}
        keyExtractor={item => item.id}
        renderItem={renderExpenseItem}
        ListEmptyComponent={<Text style={styles.empty}>{t.noExpensesThisMonth}</Text>}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 160 }}
      />

      <Animated.View style={[styles.floatingControls, { transform: [{ translateY: controlsTranslateY }] }]}>
        <TouchableOpacity style={styles.buttonFrontpage} onPress={() => setShowPopup(true)}>
          <Ionicons name="add" size={28} color={'#fff'} />
        </TouchableOpacity>
        <View style={styles.arrowsFrontpage}>
          <TouchableOpacity
           style={styles.arrowButton}
           onPress={() => setCurrentMonth(addMonths(currentMonth, -1))}
          >
            <Ionicons name='arrow-back-outline' size={22} color={'#000'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => !isCurrentMonth && setCurrentMonth(addMonths(currentMonth, 1))}
            disabled={isCurrentMonth}
          >
            <Ionicons 
              name='arrow-forward-outline'
              size={22}
              color={isCurrentMonth ? '#ccc' : '#000'} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <AddExpensePopup
        selectedMonth={currentMonth}
        visible={showPopup}
        onClose={(added) => { setShowPopup(false); if (added) fetchData() }}
      />
    </View>
  )
}

export default Etusivu
