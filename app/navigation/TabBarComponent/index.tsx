import { AppContext } from '@app/context'
import { ThemeColors } from '@app/types/theme'
import { useNavigationState } from '@react-navigation/native'
import { Text } from 'native-base'
import React, { useContext } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import { TabBarRoutes } from '../Routes'
import TabIcon from './TabIcon'
import { ThemeStatic } from '../../theme'

const TabBarComponent = ({ navigation, ...data }) => {
  const { theme, toggleSetOpenModal } = useContext(AppContext)

  const currentRouteName = useNavigationState((state) => state.routes)

  const user = useSelector((state) => state.user)

  const labels = {
    HomeScreen: 'Shop',
    CartScreen: 'Cart',
    CameraScreen: 'Post',
    SellingScreen: 'Selling',
    ProfileScreen: 'Profile',
  }
  const routeKey = {
    HomeScreen: 'HomeStack',
  }

  const TextBar = ({ value, isActive }) => {
    return (
      <Text
        style={[
          styles(theme).iconText,
          { color: isActive ? ThemeStatic.accent : theme.text02 },
        ]}
        accessibilityLabel={value}
      >
        {value}
      </Text>
    )
  }
  const { index, routes } = navigation?.getState()
  const currentRoute = routes[index].name
  return (
    <View style={styles(theme).container}>
      {Object.keys(TabBarRoutes).map((key) => (
        <TouchableOpacity
          key={key}
          activeOpacity={0.95}
          style={styles().icon}
          onPress={() => {
            if (labels[key] == labels.CameraScreen) toggleSetOpenModal(true)
            if (key === 'HomeScreen' || key === 'CartScreen') {
              navigation.navigate(key)
            } else if (
              (key === 'CameraScreen' ||
                key === 'SellingScreen' ||
                key === 'ProfileScreen') &&
              user.profile !== null
            ) {
              navigation.navigate(key)
            } else {
              navigation.navigate('Auth')
            }
          }}
        >
          <TabIcon
            route={key}
            isActive={currentRoute === key || currentRoute === routeKey[key]}
          />
          <TextBar
            value={labels[key]}
            isActive={currentRoute === key || currentRoute === routeKey[key]}
          />
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    containerOuter: {
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: 'green',
      alignSelf: 'center',
    },
    container: {
      flexDirection: 'row',
      padding: 15,
      backgroundColor: theme.base,
    },
    icon: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconText: {
      fontSize: 13,
      marginTop: 4,
    },
  })

export default TabBarComponent
