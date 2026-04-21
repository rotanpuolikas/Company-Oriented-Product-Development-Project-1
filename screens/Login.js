import { useState, useContext } from "react"
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Platform } from "react-native";
import { AuthContext } from "../context/AuthContext"
import { useLocale } from "../context/LocaleContext"
import { styles } from "../theme/Theme.js"
import { colours } from "../theme/Colours.js"

const KeyboardWrapper = Platform.OS === 'web' ? View : KeyboardAvoidingView;

const Login = () => {
  const { login, register } = useContext(AuthContext)
  const { t } = useLocale()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [devPassword, setDevPassword] = useState("")

  // for testing, remove to make public
  const DEV_PASSWORD = "kissa1234"

  const handleLogin = async () => {
    setError("")
    setLoading(true)

    try {
      await login(email, password);
    }
    catch (err) {
      setError(t.invalidEmailOrPassword)
    }

    setLoading(false)
  }

  const handleRegister = async () => {
    setError("")
    if (devPassword !== DEV_PASSWORD) { // for testing, remove to make public
      setError(t.invalidDeveloperPassword)
      return
    }
    if (!email || !password) {
      setError(t.pleaseEnterEmailAndPassword)
      setLoading(false)
      return
    }
    setLoading(true)

    try {
      await register(email, password);
    }
    catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError(t.emailAlreadyInUse)
      } else if (err.code === "auth/weak-password") {
        setError(t.passwordTooShort)
      } else if (err.code === "auth/invalid-email") {
        setError(t.invalidEmail)
      } else {
        setError(t.couldNotCreateAccount)
      }
    }

    setLoading(false)
  }

  const switchMode = () => {
    setIsRegistering(!isRegistering)
    setError("")
    setEmail("")
    setPassword("")
    setDevPassword("") // for testing, remove to make public
  }

  return (
    <KeyboardWrapper style={styles.loginContainer} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Platform.OS === 'web' ? () => {} : Keyboard.dismiss}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={styles.title}>{isRegistering ? t.createAccount : t.welcomeBack}</Text>

          <TextInput
            placeholder={t.email}
            placeholderTextColor={colours.textSecondary}
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            inputMode="email"
          />

          <TextInput
            placeholder={t.password}
            placeholderTextColor={colours.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            onSubmitEditing={isRegistering ? handleRegister : handleLogin}
          />

          {/* for testing, remove to make public */}
          {isRegistering && (
            <TextInput
              placeholder={t.developerPassword}
              placeholderTextColor={colours.textSecondary}
              value={devPassword}
              onChangeText={setDevPassword}
              secureTextEntry
              style={styles.input}
              onSubmitEditing={handleRegister}
            />
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={isRegistering ? handleRegister : handleLogin}>
            {loading ? (
              <ActivityIndicator color={colours.whiteText} />
            ) : (
              <Text style={styles.buttonText}>{isRegistering ? t.createAccount : t.login}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={switchMode} style={{ marginTop: 16, alignItems: "center" }}>
            <Text style={{ color: colours.textSecondary }}>
              {isRegistering ? t.alreadyHaveAccount : t.dontHaveAccount}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardWrapper>
  )
}

export default Login
