import { Modal, View, Text, TouchableOpacity } from 'react-native'
import { styles } from '../theme/Theme.js'

export default function AddExpensePopup({visible, onClose}) {

  return(
    <Modal transparent animationType='fade' visible={visible}>
      <View style={styles.popupOverlay}>
        <View style={styles.popup}>
          <Text>Hello there</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
