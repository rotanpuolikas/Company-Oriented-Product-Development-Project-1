import {useContext} from 'react'
import { NavigationContainer } from "@react-navigation/native"

import { AuthProvider, AuthContext } from "./context/AuthContext"
import AuthNavigator from "./navigation/AuthNavigator"
import MainNavigator from "./navigation/MainNavigator"

const RootNavigation = () => {
  const { user } = useContext(AuthContext) // käyttäjätunnari / käyttähäinfot

  return ( 
    <NavigationContainer> {/* näytetään joko päänäkymä (MainNavigator) tai login (AuthNavigator), riippuu onko käyttäjä kirjautunut sisälle */}
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  )
}
