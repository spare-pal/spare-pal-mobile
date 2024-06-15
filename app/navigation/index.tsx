import { ThemeStatic } from '@app/theme'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { CommonActions, NavigationContainer } from '@react-navigation/native'
import {
  TransitionPresets,
  createStackNavigator,
} from '@react-navigation/stack'
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import LaunchScreen from '../screens/LaunchScreen'
import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen'
import { StackRoutes, TabBarRoutes } from './Routes'
import TabBarComponent from './TabBarComponent'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

function ProfileStack() {
  return (
    <Stack.Navigator
      initialRouteName='ProfileScreen'
      screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}
      headerMode='none'
    >
      <Stack.Screen
        name='ProfileScreen'
        component={TabBarRoutes.ProfileScreen}
      />
    </Stack.Navigator>
  )
}

function TabNavigator() {
  return (
    <Tab.Navigator
      lazy={true}
      tabBarOptions={{
        showLabel: false,
        activeTintColor: ThemeStatic.accent,
      }}
      tabBar={(props) => <TabBarComponent {...props} />}
    >
      <Tab.Screen name='HomeScreen' component={TabBarRoutes.HomeScreen} />
      <Tab.Screen name='CartScreen' component={TabBarRoutes.CartScreen} />
      <Tab.Screen name='ProfileScreen' component={ProfileStack} />
    </Tab.Navigator>
  )
}

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName='LaunchScreen' headerMode='none'>
      <Stack.Screen name='LaunchScreen' component={LaunchScreen} />
      <Stack.Screen name='LoginScreen' component={LoginScreen} />
      <Stack.Screen name='RegisterScreen' component={RegisterScreen} />
    </Stack.Navigator>
  )
}

function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null
  }
  const route = navigationState.routes[navigationState.index]

  if (route.state) {
    return getActiveRouteName(route.state)
  }
  return route.name
}

export default ({ initialScreen }) => {
  const routeNameRef = useRef()
  const navigationRef = useRef()

  const user = useSelector((state) => state?.user)
  const isLoggedIn = !!user?.profile?.email

  useEffect(() => {
    if (!isLoggedIn) {
      navigationRef.current?.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Auth' }],
        })
      )
    }
  }, [isLoggedIn])

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={() => {
        const previousRouteName = routeNameRef.current
        const currentRouteName = getActiveRouteName(
          navigationRef?.current?.getRootState()
        )
        if (previousRouteName !== currentRouteName) {
          console.log('Current route name:', currentRouteName)
        }
        routeNameRef.current = currentRouteName
      }}
    >
      <Stack.Navigator
        headerMode='none'
        screenOptions={{
          ...TransitionPresets.SlideFromRightIOS,
          gestureEnabled: false,
        }}
      >
        <>
          {!isLoggedIn && (
            <>
              <Stack.Screen name='Auth' component={AuthStack} />
            </>
          )}
          <Stack.Screen name='App' component={TabNavigator} />
          <Stack.Screen
            name='CheckoutScreen'
            component={StackRoutes.CheckoutScreen}
          />
        </>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
