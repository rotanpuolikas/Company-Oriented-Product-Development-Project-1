import { createStackNavigator } from "@react-navigation/stack"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useContext, useState, useLayoutEffect } from "react"
import { Pressable, View } from "react-native"
import { colours } from "../theme/Colours.js"
import { AuthContext } from "../context/AuthContext"
import Etusivu from "../screens/Etusivu"
import HamburgerMenu from "../screens/HamburgerMenu"
import Settings from "../screens/Settings"
import StaticManagement from "../screens/StaticManagement"
import DeveloperThings from "../screens/DeveloperThings"

const Stack = createStackNavigator()

const HomeScreen = ({ navigation }) => {
  const { logout } = useContext(AuthContext)
  const [showHamburger, setShowHamburger] = useState(false)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          onPress={() => setShowHamburger(true)}
          android_ripple={null}
          style={{ alignSelf: 'stretch', justifyContent: 'center', paddingHorizontal: 18 }}
        >
          <Ionicons name="menu-outline" color={'#000000'} size={32} />
        </Pressable>
      ),
    })
  }, [navigation])

  return (
    <View style={{ flex: 1 }}>
      <Etusivu />
      <HamburgerMenu
        visible={showHamburger}
        onClose={() => setShowHamburger(false)}
        navigation={navigation}
        logout={logout}
      />
    </View>
  )
}

const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colours.primary,
          height: 110,
        },
        headerTitleStyle: {
          fontSize: 24,
          fontWeight: 'bold',
        },
        cardStyle: { flex: 1 },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerTitle: 'MassiMappi' }} />
      <Stack.Screen name="Settings" component={Settings} options={{ title: 'Settings' }} />
      <Stack.Screen name="StaticManagement" component={StaticManagement} options={{ title: 'Static Incomes & Expenses' }} />
      <Stack.Screen name="DeveloperThings" component={DeveloperThings} options={{ title: 'Developer' }} />
    </Stack.Navigator>
  )
}

export default MainNavigator
