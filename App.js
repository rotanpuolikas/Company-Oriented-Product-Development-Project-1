import {useContext} from 'react'
import { NavigationContainer } from "@react-navigation/native"

import { AuthProvider, AuthContext } from "./context/AuthContext"
import { LocaleProvider } from "./context/LocaleContext"
import AuthNavigator from "./navigation/AuthNavigator"
import MainNavigator from "./navigation/MainNavigator"

const RootNavigation = () => {
  const { user } = useContext(AuthContext) // käyttäjätunnari / käyttähäinfot

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <LocaleProvider>
        <RootNavigation />
      </LocaleProvider>
    </AuthProvider>
  )
}
