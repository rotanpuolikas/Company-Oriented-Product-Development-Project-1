import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { styles } from '../theme/Theme.js'
import { colours } from '../theme/Colours.js'
import { useLocale } from '../context/LocaleContext'

const Settings = () => {
  const navigation = useNavigation()
  const { t, locale, setLocale } = useLocale()

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('StaticManagement')}
        style={[styles.card, { padding: 16 }]}
      >
        <View style={styles.cardTopRow}>
          <Text style={styles.name}>{t.manageStaticIncomesExpenses}</Text>
          <Ionicons name="chevron-forward-outline" size={20} color={colours.textPrimary} />
        </View>
      </TouchableOpacity>

      <View style={[styles.card, { padding: 16, marginTop: 8 }]}>
        <Text style={[styles.name, { marginBottom: 12 }]}>{t.language}</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            onPress={() => setLocale('en-US')}
            style={[
              styles.button,
              { flex: 1 },
              locale === 'en-US' && { backgroundColor: colours.secondary },
            ]}
          >
            <Text style={[styles.buttonText, locale === 'en-US' && { color: colours.card }]}>
              EN
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setLocale('fi-FI')}
            style={[
              styles.button,
              { flex: 1 },
              locale === 'fi-FI' && { backgroundColor: colours.secondary },
            ]}
          >
            <Text style={[styles.buttonText, locale === 'fi-FI' && { color: colours.card }]}>
              FI
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

export default Settings
