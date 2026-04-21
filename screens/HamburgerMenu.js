import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import { styles } from '../theme/Theme.js'
import { useLocale } from '../context/LocaleContext'

const HamburgerMenu = ({ visible, onClose, navigation, logout }) => {
  const { t } = useLocale()

  const handleSettings = () => {
    onClose()
    navigation.navigate('Settings')
  }

  const handleDeveloperThings = () => {
    onClose()
    navigation.navigate('DeveloperThings')
  }

  const handleLogout = () => {
    onClose()
    logout()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.hamburgerOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.hamburgerContainer}>
              <TouchableOpacity style={styles.hamburgerItem} onPress={handleSettings}>
                <Text style={styles.hamburgerItemText}>{t.settings}</Text>
              </TouchableOpacity>
              <View style={styles.hamburgerSeparator} />
              <TouchableOpacity style={styles.hamburgerItem} onPress={handleDeveloperThings}>
                <Text style={styles.hamburgerItemText}>{t.developerThings}</Text>
              </TouchableOpacity>
              <View style={styles.hamburgerSeparator} />
              <TouchableOpacity style={styles.hamburgerItem} onPress={handleLogout}>
                <Text style={styles.hamburgerItemTextDanger}>{t.logOut}</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default HamburgerMenu
