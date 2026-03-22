import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useContext } from "react"

import { TouchableOpacity, Text } from "react-native"

import { colours } from "../theme/Colours.js"

import { AuthContext } from "../context/AuthContext"

import Etusivu from "../screens/Etusivu"

const Tab = createBottomTabNavigator()

// basic bottom navigation bar thingy

const MainNavigator = () => {

  const { logout, user } = useContext(AuthContext)
  
  return (
    <Tab.Navigator // this looks terrible but i found this to look the best
      screenOptions={{
        headerRight: () => (
          <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
            <Text style={{ color: colours.primary, fontWeight: "600" }}>
              Logout
            </Text>
          </TouchableOpacity>), headerTitle: `Welcome ${user?.email}`,}}> 
        
      <Tab.Screen name="Locations" component={Etusivu} options={{tabBarIcon: ({color, size }) =>
        <Ionicons name="list-outline" size={size} color={color}/> // this is UGLY and horribly convoluted but eh it works
      }} />
      
      <Tab.Screen name="Add Location" component={Etusivu} options={{tabBarIcon: ({color, size }) =>
        <Ionicons name="add-outline" size={size} color={color}/>
      }} />
      
      <Tab.Screen name="Map" component={Etusivu} options={{tabBarIcon: ({color, size }) =>
        <Ionicons name="navigate-circle-outline" size={size} color={color}/>
      }} />
      
      <Tab.Screen name="Countries" component={Etusivu} options={{tabBarIcon: ({color, size }) =>
        <Ionicons name="earth-outline" size={size} color={color}/>
      }} />
      
    </Tab.Navigator>
  )
}

export default MainNavigator;
