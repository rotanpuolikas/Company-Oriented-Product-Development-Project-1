import React, { useState, useEffect, useContext } from "react"
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Pressable, Alert} from "react-native"
import { styles } from "../theme/theme.js"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { db } from "../firebase"
import { AuthContext } from "../context/AuthContext"
import { colours } from "../theme/colours.js"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import RatingStars from "../components/RatingStars.js"
import Ionicons from "@expo/vector-icons/Ionicons"

const removeButtonOnRight = true // which side should the button be on? also to have two buttons helps with the alignment of text on the top row of each entry
const removeButtonSize = 20

const LocationListScreen = () => {
  const { user } = useContext(AuthContext)
  const navigation = useNavigation()

  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchLocations = async () => {
    try {
      const userRef = collection(
        db,
        "locations",
        user.uid,
        "userLocations"
      )

      const snapshot = await getDocs(userRef)

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setLocations(data)
    } catch (error) {
      console.log(error)
    }

    setLoading(false)
  }
  // changed again to use normal useEffect for automatic updates after entry removal
  useEffect(
    React.useCallback(() => {
      fetchLocations()
    }, [])
  )

  const handleRemoveLocation = async (locationId) => {
    try{
      const locationRef = doc(
        db,
        "locations",
        user.uid,
        "userLocations",
        locationId
      )

      await deleteDoc(locationRef)

      Alert.alert("Success", "Location removed!")
    } catch (err) {
      console.log(err)
      Alert.alert("Error", "Could not remove location")
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <Pressable onPress={removeButtonOnRight ? () => {} : () => handleRemoveLocation(item.id)}>
          <Ionicons name="close-outline" size={removeButtonSize} color={removeButtonOnRight ? colours.card : colours.error} />
        </Pressable>
        <Text style={styles.name}>{item.name}</Text>
        <Pressable onPress={removeButtonOnRight ? () => {handleRemoveLocation(item.id)} : () => {}}>
          <Ionicons name="close-outline" size={removeButtonSize} color={removeButtonOnRight ? colours.error : colours.card} />
        </Pressable>
      </View>
      <Text style={styles.description}>{item.description}</Text>
      <RatingStars amount={item.rating} />

      <TouchableOpacity
        style={styles.mapButton}
        onPress={() =>
          navigation.navigate("Map", { locationName: item.name })
        }
      >
        <Text style={styles.mapButtonText}>View on Map</Text>
      </TouchableOpacity>
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
      <FlatList
        data={locations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>No locations added yet.</Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("Add Location")}
      >
        <Text style={styles.addButtonText}>+ Add Location</Text>
      </TouchableOpacity>
    </View>
  )
}

export default LocationListScreen;
