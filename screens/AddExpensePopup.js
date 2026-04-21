import { Modal, View, Text, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback} from 'react-native'
import { styles } from '../theme/Theme.js'
import { colours } from '../theme/Colours.js'
import { collection, addDoc } from "firebase/firestore"
import { db } from "../firebase-auth"
import { AuthContext } from "../context/AuthContext"
import { useLocale } from "../context/LocaleContext"
import { useState, useContext } from "react";

const KeyboardWrapper = Platform.OS === 'web' ? View : KeyboardAvoidingView;
const DismissWrapper = Platform.OS === 'web' ? View : TouchableWithoutFeedback;

export default function AddExpensePopup({selectedMonth, visible, onClose}) {
  const { user } = useContext(AuthContext)
  const { t } = useLocale()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [rawAmount, setRawAmount] = useState("")

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

  const handleAddExpense = async () => {
    if (Platform.OS !== 'web') Keyboard.dismiss()

    if (!name || !amount) {
      Alert.alert(t.error, t.pleaseEnterNameAndAmount)
      return
    }

    if (amount < 0) {
      Alert.alert(t.error, t.expenseMustBeHigher)
      return
    }

    const formatDay = selectedMonth.toLocaleDateString('en-US', {month: 'long'}) + selectedMonth.getFullYear()

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

      Alert.alert(t.success, t.expenseAdded)

      setName("")
      setDescription("")
      setAmount("")
      setRawAmount("")

    } catch (error) {
      console.log(error)
      Alert.alert(t.error, t.couldNotSaveExpense)
    }
  }

  return (
    <Modal transparent animationType="slide" visible={visible}>
      <DismissWrapper onPress={Platform.OS !== 'web' ? Keyboard.dismiss : undefined}>
        <View style={styles.popupOverlay}>
          <KeyboardWrapper
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ width: '100%', alignItems: 'center' }}
            keyboardVerticalOffset={20}
          >
            <View style={styles.popup}>
              <Text style={styles.title}>{t.addNewExpense}</Text>
              <TextInput
                placeholder={t.expenseName}
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholderTextColor={colours.grayText}
              />
              <TextInput
                placeholder={t.description}
                value={description}
                onChangeText={setDescription}
                style={styles.input}
                placeholderTextColor={colours.grayText}
                multiline
              />
              <TextInput
                placeholder={t.amount}
                value={rawAmount}
                onChangeText={(text) => {
                  setRawAmount(text)
                  setAmount(parseMoneyInput(text))
                }}
                placeholderTextColor={colours.grayText}
                style={styles.input}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  if (name !== "" && amount !== "") {
                    handleAddExpense()
                    onClose(true)
                  }
                  onClose(false)
                }}
              >
                <Text style={styles.buttonText}>
                  {name !== "" && amount !== "" ? t.saveExpense : t.close}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardWrapper>
        </View>
      </DismissWrapper>
    </Modal>
  )
}
