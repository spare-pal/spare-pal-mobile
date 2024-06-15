import { getUserProfile } from '@app/actions/login'
import { ThemeStatic } from '@app/theme'
import { handleLoginError, signOut } from '@app/utils/authentication'
import { welcomeNotification } from '@app/utils/notifications'
import { loadToken, saveToken } from '@app/utils/reduxStore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Linking from 'expo-linking'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useDispatch, useSelector } from 'react-redux'
import BackgroundView from '../../components/common/BackGroundView'
import ButtonView from '../../components/common/Button'
import { IconSizes, hp, wp } from '../../constants'
import LoadingIndicator from '../../layout/misc/LoadingIndicator'
import { StorageKey, cacheAuthAsync } from '../../utils/commonFuntions'

const LaunchScreen: React.FC = ({ navigation }: any) => {
  const { navigate } = navigation
  const dispatch = useDispatch()
  const [initializing, setInitializing] = useState(true)
  const [authState, setAuthState] = useState(null)

  const user = useSelector((state) => state.user)
  const { profile, success } = user

  useEffect(() => {
    if (
      user.profile !== null &&
      user.profile !== undefined &&
      user.profile !== ''
    ) {
      if (success && profile?.access_token?.[0] !== 'Invalid token')
        navigateToApp(profile?.token)
    }
  }, [!user.profile])

  const initialize = async () => {
    Linking.getInitialURL().then(async (url) => {
      if (url) {
        let { queryParams } = Linking.parse(url)
        let token = queryParams && queryParams.token ? queryParams.token : null
        if (token !== null) {
          await saveToken(token)
          let obj = {
            onSuccess: () => {},
            onFail: () => {},
          }
          dispatch(getUserProfile(obj))
          navigateToApp(token)
        }
      }
    })

    try {
      const token = await loadToken()
      if (token) navigateToApp(token)
      else
        (async () => {
          let cachedAuth = await getCachedAuthAsync()
          if (cachedAuth && !authState) {
            setAuthState(cachedAuth)
          }
        })()
    } catch ({ message, name: errorType }) {
      handleLoginError(errorType)
    }
    setInitializing(false)
  }

  useEffect(() => {
    initialize()
  }, [])

  async function getCachedAuthAsync() {
    let value = await AsyncStorage.getItem(StorageKey)
    let authState: any
    if (value) authState = JSON.parse(value)
    return authState
  }

  cacheAuthAsync(authState)
  const goToLoginScreen = () => {
    navigate('LoginScreen')
  }

  const goToRegisterScreen = () => {
    navigation.navigate('RegisterScreen')
  }

  const navigateToApp = async (token: string) => {
    try {
      welcomeNotification()
      navigate('App')
    } catch {
      if (!__DEV__) {
        signOut()
      }
    }
  }

  const contentLoader = () => {
    return <LoadingIndicator color={ThemeStatic.accent} size={IconSizes.x1} />
  }

  const containerView = () => {
    return (
      <SafeAreaView style={style.mainContainer}>
        <View style={style.mainContainer}>
          <FastImage
            style={{
              flex: 1,
              margin: 10,
              marginTop: 60,
            }}
            source={require('@app/assets/images/app-auth-bg.png')}
          />
          <View style={style.cardViewStyle}>
            <Text style={[style.welcomeTextStyle, { marginBottom: 30 }]}>
              {'Welcome to Spare Pal!'}
            </Text>
            <ButtonView
              onPress={goToLoginScreen}
              title={'Sign In'}
              buttonStyle={style.signInButtonView}
              buttonTextStyle={{ fontSize: hp(2.2) }}
              loading={false}
              testIDs={'Launch_SignIn'}
            />
            <View />
            <ButtonView
              onPress={goToRegisterScreen}
              title={'Sign Up'}
              buttonStyle={style.signUpButtonView}
              buttonTextStyle={{
                color: ThemeStatic.accent,
                fontSize: hp(2.2),
              }}
              loading={false}
              testIDs={'Launch_SignUp'}
            />
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <BackgroundView
      contentView={!initializing ? containerView() : contentLoader()}
    ></BackgroundView>
  )
}

const style = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
    resizeMode: 'contain',
    justifyContent: 'center',
  },
  mainContainer: { flex: 1 },
  container: {
    flex: 1,
    alignItems: 'center',
  },

  roundedView: {
    height: hp(90),
    width: wp(90),
    backgroundColor: '#fff',
    borderRadius: hp(3),
    paddingVertical: hp(3),
  },
  conditionView: {
    height: hp(10),
    alignItems: 'center',
    justifyContent: 'center',
  },

  signInButtonView: {
    borderWidth: wp(0.6),
    borderRadius: 15,
    borderColor: ThemeStatic.accent,
    backgroundColor: ThemeStatic.accent,
  },
  signUpButtonView: {
    borderWidth: wp(0.6),
    borderRadius: 15,
    borderColor: ThemeStatic.accent,
    backgroundColor: ThemeStatic.white,
  },
  cardViewStyle: {
    flex: 1,
    gap: 10,
    alignItems: 'center',
  },
  closeButtonStyle: { flexDirection: 'row-reverse' },
  closeIconStyle: {
    marginTop: wp(4.5),
    fontSize: 30,
    padding: 20,
    color: ThemeStatic.white,
  },
  welcomeTextStyle: { fontSize: hp(2.2), marginBottom: 5, fontWeight: '700' },
  subTitleTextStyle: { width: wp(90), textAlign: 'center' },
  separatorStyle: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})

export default LaunchScreen
