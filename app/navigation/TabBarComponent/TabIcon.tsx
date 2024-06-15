import { IconSizes } from '@app/constants'
import { AppContext } from '@app/context'
import { Feather, FontAwesome5 } from '@expo/vector-icons'
import React, { useContext } from 'react'
import { View } from 'react-native'
import { Badge } from 'react-native-elements'
import { useSelector } from 'react-redux'
import { ThemeStatic } from '../../theme'

const TabIcon = ({ route, isActive }) => {
  const { theme } = useContext(AppContext)
  const carts = useSelector((state) => state.cart.carts)

  const user = useSelector((state) => state.user)

  const { profile } = user

  switch (route) {
    case 'HomeScreen':
      return (
        <Feather
          name='shopping-bag'
          color={isActive ? ThemeStatic.accent : theme.text02}
          size={IconSizes.x6}
          accessibilityLabel={route}
        />
      )
    case 'CartScreen':
      return (
        <View>
          <FontAwesome5
            name='shopping-cart'
            color={isActive ? ThemeStatic.accent : theme.text02}
            size={IconSizes.x6}
            accessibilityLabel={route}
          />
          {carts.length > 0 && (
            <Badge
              status='error'
              containerStyle={{ position: 'absolute', top: -4, right: -4 }}
            />
          )}
        </View>
      )

    case 'SellingScreen':
      return (
        <FontAwesome5
          light
          name='gifts'
          color={isActive ? ThemeStatic.accent : theme.text02}
          size={IconSizes.x6}
          accessibilityLabel={route}
        />
      )
    case 'CameraScreen':
      return (
        <FontAwesome5
          light
          name='camera'
          color={isActive ? ThemeStatic.accent : theme.text02}
          size={IconSizes.x6}
          accessibilityLabel={route}
        />
      )
    case 'ProfileScreen':
      return (
        <FontAwesome5
          light
          name='user-circle'
          color={isActive ? ThemeStatic.accent : theme.text02}
          size={IconSizes.x6}
          accessibilityLabel={route}
        >
          {profile &&
            profile.account &&
            profile.account.requirements &&
            profile.account.requirements.currently_due &&
            profile.account.requirements.currently_due.length > 0 && (
              <Badge
                status='error'
                containerStyle={{ position: 'absolute', top: -4, right: -4 }}
              />
            )}
        </FontAwesome5>
      )

    default:
      return null
  }
}

export default TabIcon
