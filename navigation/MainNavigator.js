import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useContext } from "react"

import { TouchableOpacity, Text } from "react-native"

import { colours } from "../theme/Colours.js"

import { AuthContext } from "../context/AuthContext"

import Etusivu from "../screens/Etusivu"
import DevelopDBAccess from "../screens/DevelopDBAccess"
import DevelopDBRead from "../screens/DevelopDBRead"

const Tab = createBottomTabNavigator()

// basic bottom navigation bar thingy

const MainNavigator = () => {

  const { logout, user } = useContext(AuthContext)
  
  return (
    <Tab.Navigator // this looks terrible but i found this to look the best (in-app)
      screenOptions={{
          tabBarStyle: {
            backgroundColor: colours.primary
          },
          tabBarActiveTintColor: colours.secondary,
          tabBarInactiveTintColor: 'gray',
        headerRight: () => (
          <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
            <Text style={{ color: colours.linkText, fontWeight: "600" }}>
              Logout
            </Text>
          </TouchableOpacity>), headerTitle: `Welcome ${user?.email}`,}}> 
        
      <Tab.Screen name="Etusivu" component={Etusivu} options={{tabBarIcon: ({color, size }) =>
        <Ionicons name="home-outline" size={size} color={color}/> // this is UGLY and horribly convoluted but eh it works
      }} />
      
      <Tab.Screen name="Dev db add" component={DevelopDBAccess} options={{tabBarIcon: ({color, size }) =>
        <Ionicons name="add-outline" size={size} color={color}/>
      }} />

      <Tab.Screen name="Dev db list" component={DevelopDBRead} options={{tabBarIcon: ({color, size }) =>
        <Ionicons name="archive-outline" size={size} color={color}/>
      }} />
    </Tab.Navigator>
  )
}

export default MainNavigator;
