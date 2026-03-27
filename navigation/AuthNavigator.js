import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Login from "../screens/Login"

const Stack = createNativeStackNavigator()

// login only start screen, still using stacknavigator just because

const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

export default AuthNavigator
