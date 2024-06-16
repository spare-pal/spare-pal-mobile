import { AntDesign } from '@expo/vector-icons'
import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import * as AppleAuthentication from 'expo-apple-authentication'
import { socialApple, socialLogin } from '../../app/actions/login'
import Config from '@app/config/index'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import { showErrorNotification } from './notifications'
import { saveTokenAndNavigate } from './common'
import { ThemeStatic } from '../theme'

export function LeftArrow() {
  return (
    <View style={style.container}>
      <AntDesign name='arrowleft' style={style.closeIconStyle} />
    </View>
  )
}

export function Logo() {
  return (
    <View style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
      <Image style={style.logoImage} source={require('@app/assets/icon.png')} />
    </View>
  )
}

export const loginWithApple = async (dispatch, navigate) => {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    })
    if (credential) {
      let obj = {
        email: credential?.email,
        fname: credential?.fullName?.familyName,
        lname: credential?.fullName?.givenName,
        token: credential?.authorizationCode,
        onSuccess: async (res) => {
          if (res && res.token) {
            await saveTokenAndNavigate(res, navigate)
          }
        },
        onFail: (response) => {
          if (response && response.statusCode === 401) {
            navigate('LaunchScreen')
          } else if (response && response.statusCode === 400) {
            if (
              response.body.non_field_errors[0] == 'User account is disabled.'
            ) {
              navigate('LaunchScreen')
            } else {
              showErrorNotification(
                response.body.email
                  ? response.body.email[0]
                  : response.body.non_field_errors[0]
              )
            }
          }
        },
      }
      dispatch(socialApple(obj))
    }
  } catch (e) {
    if (e.code === 'ERR_CANCELED') {
    } else {
    }
  }
}

export function getGoogleAuthConfig(): AppAuth.OAuthProps {
  const { env } = Config
  const releaseChannel = env
  if (
    releaseChannel === 'STAGING' ||
    releaseChannel === 'staging' ||
    releaseChannel === 'PRODUCTION' ||
    releaseChannel === 'production'
  ) {
    return {
      issuer: 'https://accounts.google.com',
      scopes: ['openid', 'profile', 'email'],
      clientId: '1011628648286-ivjbnrcn50rubnl8a.apps.googleusercontent.com',
    }
  } else {
    return {
      issuer: 'https://accounts.google.com',
      scopes: ['openid', 'profile', 'email'],
      clientId: '1011628648286-227t4ihv2s89jbma.apps.googleusercontent.com',
    }
  }
}

export const StorageKey = '@MyApp:CustomGoogleOAuthKey'

export async function cacheAuthAsync(authState) {
  return await AsyncStorage.setItem(StorageKey, JSON.stringify(authState))
}

export async function signInAsync(dispatch, saveTokenAndNavigate) {}

export async function signInWithGoogleAsync(dispatch, navigate) {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    forceCodeForRefreshToken: true,
  })

  try {
    await GoogleSignin.hasPlayServices()
    const userInfo = await GoogleSignin.signIn()
    const tokens = await GoogleSignin.getTokens()
    await cacheAuthAsync(userInfo)

    dispatch(
      socialLogin({
        provider: 'google-oauth2',
        token: tokens?.accessToken,
        navigate,
      })
    )

    return userInfo
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    } else if (error.code === statusCodes.IN_PROGRESS) {
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    } else {
    }
  }
}

export async function fbLogIn(dispatch, navigate) {
  try {
    await Facebook.initializeAsync('174051176589391')
    const { type, token } = await Facebook.logInWithReadPermissionsAsync({
      permissions: ['public_profile', 'email'],
    })
    if (type === 'success') {
      const response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}`
      )
      dispatch(
        socialLogin({
          provider: 'facebook',
          token: token,
          navigate,
        })
      )
    }
  } catch ({ message }) {
    console.log(`Facebook Login Error: ${message}`)
  }
}

const style = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  closeIconStyle: {
    fontSize: 30,
    padding: 5,
    color: ThemeStatic.white,
    marginLeft: -6,
  },
  logoImage: { width: 45, height: 45, position: 'relative', left: -25 },
})
