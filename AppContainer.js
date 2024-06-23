import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, createStackNavigator } from '@react-navigation/native-stack';
import Home from './Home';
import ChartScreen from './ChartScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { StatusBar } from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const AppContainer = () => {
  return (
      <NavigationContainer>
          <StatusBar animated barStyle="dark-content" backgroundColor={'white'} />
        <MyStack />
      </NavigationContainer>
  );
}
function MyTabs() {
 
  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: {
          backgroundColor:'#fff',paddingBottom:16
        },
        tabBarActiveTintColor:'#000',
        tabBarInactiveTintColor:  '#fff',
        headerTintColor:'#fff',
        
      }}
    >
    <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: ({ focused, color, size }) => (
            <Text style={{ color: focused ? '#1E90FF' : '#666', fontSize: 20,fontWeight:'500'}}>
              Home
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Chart"
        component={ChartScreen}
        options={{
          tabBarLabel: ({ focused, color, size }) => (
            <Text style={{ color: focused ? '#1E90FF' : '#666', fontSize: 20,fontWeight:'500'}}>
              Charts
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
function MyStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tabssss" component={MyTabs} />
     <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ChartScreen" component={ChartScreen} />
    </Stack.Navigator>
  );
}

export default AppContainer;
