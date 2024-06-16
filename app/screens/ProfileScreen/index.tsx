import { getUserProfile, logoutUser } from '@app/actions/login'
import { ThemeStatic } from '@app/theme'
import { removeToken } from '@app/utils/reduxStore'
import { Text } from 'native-base'
import React, { Fragment, useEffect } from 'react'
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

const ProfileScreen: React.FC = ({ navigation }: any) => {
  const user = useSelector((state) => state.user)

  const { profile } = user
  const avatarBackground = require('@app/assets/images/canvaspurple.png')

  const { navigate } = navigation
  const dispatch = useDispatch()
  const logOut = async () => {
    await removeToken()
    dispatch(logoutUser())
    navigate('Auth')
  }

  useEffect(() => {
    dispatch(getUserProfile())
  }, [])

  const { first_name, last_name, phone_number } =
    profile !== null ? profile : {}

  const checkNameValue = (name: string | string[]) => {
    if (typeof name === 'string' && !name.startsWith('This field')) {
      return name
    }
  }
  const renderHeader = () => {
    if (profile !== null) {
      return (
        <View style={styles().headerContainer}>
          <ImageBackground
            style={[
              styles().headerBackgroundImage,
              { backgroundColor: ThemeStatic.accent },
            ]}
            blurRadius={10}
            source={avatarBackground}
          >
            <View style={styles().headerColumn}>
              <TouchableOpacity>
                <Image
                  style={styles().userImage}
                  source={require('@app/assets/images/default_user.jpg')}
                />
              </TouchableOpacity>
              <Text style={styles().userNameText}>{`${
                checkNameValue(first_name) ?? 'New'
              } ${checkNameValue(last_name) ?? 'User'}`}</Text>
              <View style={styles().userAddressRow}>
                <View style={styles().userCityRow}>
                  <Text style={styles().usernameText}>{phone_number}</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
      )
    }
  }

  const Divider = () => (
    <View
      style={{
        height: 0.5,
        width: '100%',
        marginVertical: 12,
        backgroundColor: 'lightgray',
      }}
    />
  )

  const content = (
    <Fragment>
      <ScrollView>
        <View style={{ padding: 15 }}>
          <Divider />
          <Text style={styles().noteText}>ACCOUNT</Text>
          <Divider />
          <>
            <TouchableOpacity onPress={logOut}>
              <Text style={[{ marginStart: 10 }, styles().balanceText]}>
                Sign Out
              </Text>
            </TouchableOpacity>
            <Divider />
          </>
        </View>
      </ScrollView>
    </Fragment>
  )

  if (profile !== null) {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles().scroll}>
          {renderHeader()}
          {content}
        </ScrollView>
      </View>
    )
  }
  return <Text></Text>
}

const styles = (theme = {}) =>
  StyleSheet.create({
    balanceText: {
      fontSize: 16,
    },
    aboutText: {
      fontSize: 14,
      color: 'black',
    },
    aboutTextHeader: {
      fontSize: 20,
      color: '#666',
    },
    userRating: {
      fontSize: 10,
      color: 'green',
      textAlign: 'right',
    },

    titleText: {
      fontSize: 16,
      alignItems: 'flex-end',
      color: 'black',
    },
    bottomButton: {
      marginTop: 50,
      alignContent: 'space-around',
      alignItems: 'center',
    },
    userLogo: {
      height: 128,
      width: 128,
      borderRadius: 128,
    },
    userContainer: {
      flex: 1,
      alignItems: 'center',
    },
    cardContainer: {
      backgroundColor: '#FFF',
      borderWidth: 0,
      flex: 1,
      margin: 0,
      padding: 0,
    },
    container: {
      flex: 1,
    },
    emailContainer: {
      backgroundColor: '#FFF',
      flex: 1,
      paddingTop: 30,
    },
    headerBackgroundImage: {
      paddingBottom: 20,
      paddingTop: 35,
    },
    headerContainer: {},
    headerColumn: {
      backgroundColor: 'transparent',
      ...Platform.select({
        ios: {
          alignItems: 'center',
          elevation: 1,
          marginTop: 5,
        },
        android: {
          alignItems: 'center',
        },
      }),
    },
    placeIcon: {
      color: 'white',
      fontSize: 26,
    },
    scroll: {
      backgroundColor: '#FFF',
    },
    telContainer: {
      backgroundColor: '#FFF',
      flex: 1,
      paddingTop: 30,
    },
    userAddressRow: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    userCityRow: {
      backgroundColor: 'transparent',
    },
    usernameText: {
      color: ThemeStatic.accentLight,
      fontSize: 15,
      fontWeight: '600',
      textAlign: 'center',
    },
    userImage: {
      borderColor: ThemeStatic.accent,
      borderRadius: 85,
      borderWidth: 0,
      height: 100,
      marginBottom: 10,
      marginTop: 10,
      width: 100,
    },
    userNameText: {
      color: '#FFF',
      fontSize: 22,
      fontWeight: 'bold',
      paddingBottom: 8,
      textAlign: 'center',
    },
    centeredBadgeText: {
      height: 48,
      justifyContent: 'center',
      alignContent: 'center',
      textAlign: 'center',
      borderRadius: 14,
    },
    noteText: {
      color: 'darkgray',
      fontWeight: '300',
    },
  })

export default ProfileScreen
