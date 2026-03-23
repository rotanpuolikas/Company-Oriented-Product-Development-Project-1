import { createStackNavigator } from "@react-navigation/stack"
import Login from "../screens/Login"

const Stack = createStackNavigator()

// login only start screen

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
