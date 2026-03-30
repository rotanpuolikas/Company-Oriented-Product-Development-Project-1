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
    <Tab.Navigator // yläpalkissa oleva logout nappi
      screenOptions={{
          tabBarStyle: {
            backgroundColor: colours.primary
          },
          tabBarActiveTintColor: colours.secondary,
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: colours.primary,
            height: 110,
          },
        headerLeft: () => (
          <TouchableOpacity onPress={() => {}} style={{margin: 'auto', marginLeft: 10}}>
            <Ionicons name="menu-outline" color={'#000000'} size={30}/>
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
            <Text style={{ color: colours.linkText, fontWeight: "600" }}>
              Logout
            </Text>
          </TouchableOpacity>), headerTitle: `MassiMappi`,}}> 
        
      <Tab.Screen name="Etusivu" component={Etusivu} options={{tabBarIcon: ({color, size }) =>
        <Ionicons name="home-outline" size={size} color={color}/> // alareunan valikkonapit, temporary, tullaan siirtyyn toisenlaiseen navigaatioon joskus
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
