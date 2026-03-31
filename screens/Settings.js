import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { styles } from '../theme/Theme.js'
import { colours } from '../theme/Colours.js'

const Settings = () => {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('StaticManagement')}
        style={[styles.card, { padding: 16 }]}
      >
        <View style={styles.cardTopRow}>
          <Text style={styles.name}>Manage static incomes and expenses</Text>
          <Ionicons name="chevron-forward-outline" size={20} color={colours.textPrimary} />
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default Settings
