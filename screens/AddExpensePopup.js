import { Modal, View, Text, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback} from 'react-native'
import { styles } from '../theme/Theme.js'
import { colours } from '../theme/Colours.js'
import { collection, addDoc } from "firebase/firestore"
import { db } from "../firebase-auth"
import { AuthContext } from "../context/AuthContext"
import { useState, useContext } from "react";

export default function AddExpensePopup({visible, onClose}) {
  const { user } = useContext(AuthContext)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [rawAmount, setRawAmount] = useState("")

  function parseMoneyInput(raw) { // we save the inputted amounts x 100, ignoring every decimal after the second. javascript does funky stuff with floats sometimes so better to avoid using them
    // tää on kaikki siis vaan koska eri maat eri desimaalierotin, joissaki , (suomi) ja joissaki . (usa)
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

    return Math.floor(value * 100) // jjaaa palautetaan satakertasena ettei tartte tallentaa floatteja/doubleja
}

  const handleAddExpense = async () => {
    Keyboard.dismiss() // get that keyboard out of the way
    
    if (!name || !amount) { // ei tule koskaan erroraamaan tähän
      Alert.alert("Error", "Please enter name and amount")
      return
    }

    if (amount < 0) { // eikä tähän, mutta pidetään failsafena täällä jos tapahtuu jotain kauheaa
      Alert.alert("Error", "Expense must be higher than 0€")
      return
    }

    const today = new Date() // muodostetaan se KuukausiVuosi formaatti millä nää tallennetaan
    const formatDay = today.toLocaleDateString('en-US', {month: 'long'}) + today.getFullYear()

    // expense pathing, eli mihin firestoressa ne laitetaan
    try {
      const userRef = collection(
        db,
        "users",
        user.uid,
        `${formatDay}_expenses`
      )

      // jjaaa laitetaan ne sinne
      await addDoc(userRef, {
        name,
        description,
        amount: amount,
        createdAt: new Date(),
      })

      Alert.alert("Success", "Expense added!")

      // resetoidaan tekstikentät tyhjiksi et seuraavan menon lisäys ois helpompaa
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
    <Modal transparent animationType="slide" visible={visible}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.popupOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ width: '100%', alignItems: 'center' }}
            keyboardVerticalOffset={20}
          >
            <View style={styles.popup}>
              <Text style={styles.title}>Add a new expense</Text>
              <TextInput
                placeholder="Expense name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholderTextColor={colours.grayText}
              />
              <TextInput
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
                placeholderTextColor={colours.grayText}
                multiline
              />
              <TextInput
                placeholder="Amount"
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
                }} // napin teksti ja action riippuu siitä mitkä kentät täytettyjä
              >
                <Text style={styles.buttonText}>
                  {name !== "" && amount !== "" ? "Save Expense" : "Close"}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}
