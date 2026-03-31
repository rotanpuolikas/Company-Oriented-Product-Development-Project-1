import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import { styles } from '../theme/Theme.js'

const HamburgerMenu = ({ visible, onClose, navigation, logout }) => {
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
                <Text style={styles.hamburgerItemText}>Settings</Text>
              </TouchableOpacity>
              <View style={styles.hamburgerSeparator} />
              <TouchableOpacity style={styles.hamburgerItem} onPress={handleDeveloperThings}>
                <Text style={styles.hamburgerItemText}>Developer things</Text>
              </TouchableOpacity>
              <View style={styles.hamburgerSeparator} />
              <TouchableOpacity style={styles.hamburgerItem} onPress={handleLogout}>
                <Text style={styles.hamburgerItemTextDanger}>Log out</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default HamburgerMenu
