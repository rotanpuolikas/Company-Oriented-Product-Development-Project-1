import { useState, useContext } from "react"
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Platform } from "react-native";
import { AuthContext } from "../context/AuthContext"
import { styles } from "../theme/Theme.js"
import { colours } from "../theme/Colours.js"

const Login = () => {
  const { login } = useContext(AuthContext)
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setError("")
    setLoading(true)

    try {
      await login(email, password);
    }
    catch (err) {
      setError("Invalid email or password")
    }

    setLoading(false)
  }

  return (
    <KeyboardAvoidingView style={styles.loginContainer} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Platform.OS === 'web' ? () => {} : Keyboard.dismiss}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={styles.title}>Welcome Back</Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor={colours.textSecondary}
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            inputMode="email"
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor={colours.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            onSubmitEditing={handleLogin} // enter nii pääset sisälle matrixiin
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            {loading ? (
              <ActivityIndicator color={colours.whiteText} />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default Login
