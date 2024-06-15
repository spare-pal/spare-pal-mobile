import {
  clearLogin,
  loginUser,
  sendCode,
  timeoutLogin,
} from '@app/actions/login'
import { CELL_COUNT, IconSizes } from '@app/constants'
import { ThemeStatic } from '@app/theme'
import { handleLoginError } from '@app/utils/authentication'
import {
  showErrorNotification,
  welcomeNotification,
} from '@app/utils/notifications'
import { loadToken, saveToken } from '@app/utils/reduxStore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { InputGroup } from 'native-base'
import React, { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field'
import FastImage from 'react-native-fast-image'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import PhoneInput from 'react-native-phone-number-input'
import { useDispatch, useSelector } from 'react-redux'
import LoadingIndicator from '../../../app/layout/misc/LoadingIndicator'
import { LeftArrow, StorageKey } from '../../utils/commonFuntions'
import { ISignInFormValues } from './interface'
import { styles } from './styles'

const LoginScreen: React.FC = ({ navigation, route }: any) => {
  const dispatch = useDispatch()

  const { navigate, goBack } = navigation
  const [initializing, setInitializing] = useState<boolean>(true)
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [password, setPassword] = useState<string>(null)
  const [loginStep, setLoginStep] = useState<number>(1)
  const [loadingUserLogin, setLoadingUserLogin] = useState<boolean>(false)

  const user = useSelector((state) => state.user)
  const { errorLogin } = user

  const phoneNumberRef = useRef<PhoneInput>(null)
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: password,
    setValue: setPassword,
  })
  const ref1 = useBlurOnFulfill({ value: password, cellCount: CELL_COUNT })
  const [authState, setAuthState] = useState<any>(null)
  const [errors, setError] = useState<ISignInFormValues>({
    phoneNumber: '',
    password: '',
  })
  const navigateBack = () => navigate('LaunchScreen')
  const saveTokenAndNavigate = async (token: string) => {
    try {
      await saveToken(token)
      setAuthState({})
      navigateToApp(token)
    } catch (err) {
      console.log(err)
    }
  }

  const navigateToApp = async (token: string) => {
    try {
      welcomeNotification()
      navigate('App')
    } catch (err) {
      return ''
    }
  }

  useEffect(() => {
    if (!phoneNumber) {
      setLoginStep(1)
    }
  }, [phoneNumber])

  const initialize = async () => {
    if (errorLogin) {
      if (
        user.profile !== null &&
        user.profile !== undefined &&
        user.profile !== ''
      ) {
        showErrorNotification(errorLogin)
        dispatch(clearLogin())
      }
    }
    dispatch(timeoutLogin())
    try {
      const token = await loadToken()
      navigateToApp(token)
      ;(async () => {
        let cachedAuth = await getCachedAuthAsync()
        if (cachedAuth && !authState) {
          setAuthState(cachedAuth)
        }
      })()
    } catch ({ message, name: errorType }) {
      handleLoginError(errorType)
      setInitializing(false)
    }
  }

  useEffect(() => {
    initialize()
  }, [])

  useEffect(() => {
    if (
      user.profile !== null &&
      user.profile !== undefined &&
      user.profile !== ''
    ) {
      if (user.success) navigateToApp(user?.profile?.token)
    }
  }, [!user.profile])

  async function getCachedAuthAsync() {
    let value = await AsyncStorage.getItem(StorageKey)
    let authState = JSON.parse(value)

    return authState
  }

  const _sendCode = () => {
    if (!phoneNumber) {
      const errors = {
        phoneNumber: !phoneNumber ? 'Phone Number is required' : '',
        password: '',
      }
      setError(errors)
      return
    } else if (!/^(\+251)9\d{8,10}$/.test(phoneNumber)) {
      const errors = {
        phoneNumber: 'Enter a valid phone number (e.g. +2519xxxxxxxxx)',
        password: '',
      }
      setError(errors)
      return
    } else {
      setLoadingUserLogin(true)

      let obj = {
        phone_number: phoneNumber,
        onSuccess: () => {
          setLoadingUserLogin(false)
          setLoginStep(2)
        },
        onFail: (err) => {
          setLoadingUserLogin(false)
          if (err.body && err.body.message) {
            showErrorNotification(err.body.message)
          }
          if (err.statusCode === 404) {
            navigate('RegisterScreen', { step: 0, phone_number: phoneNumber })
          }
        },
      }
      dispatch(sendCode(obj))
    }
  }

  const _signIn = async () => {
    if (!phoneNumber || !password) {
      const errors = {
        phoneNumber: !phoneNumber ? 'Phone Number is required' : '',
        password: !password ? 'Verification code is required' : '',
      }
      setError(errors)
      return
    } else if (!/^(\+251)9\d{8,10}$/.test(phoneNumber)) {
      const errors = {
        phoneNumber: 'Enter a valid Phone Number',
        password: '',
      }
      setError(errors)
      return
    } else {
      setLoadingUserLogin(true)
      let obj = {
        phone_number: phoneNumber,
        password,
        onSuccess: async (res: any) => {
          setLoadingUserLogin(false)
          if (res && res.accessToken) {
            setTimeout(() => {
              setPhoneNumber('')
              setPassword('')
            }, 2000)

            await saveTokenAndNavigate(res.accessToken)
          }
        },
        onFail: (response: any) => {
          setLoadingUserLogin(false)
          if (response && response.statusCode === 401) {
            navigate('RegisterScreen', { step: 2 })
          } else if (response && response.statusCode === 400) {
            if (
              response.body.non_field_errors[0] == 'User account is disabled.'
            ) {
              navigate('RegisterScreen', {
                step: 2,
                initialValues: {
                  phone_number: phoneNumber,
                  password: password,
                },
              })
            } else {
              showErrorNotification(
                response.body.phone_number
                  ? response.body.phone_number[0]
                  : response.body.non_field_errors[0]
              )
            }
          }
        },
      }
      dispatch(loginUser(obj))
    }
  }

  let content = (
    <LoadingIndicator color={ThemeStatic.accent} size={IconSizes.x1} />
  )

  if (!initializing) {
    content = (
      <>
        <KeyboardAwareScrollView>
          <View style={styles().content}>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <TouchableOpacity onPress={navigateBack}>
                <LeftArrow />
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles().signInContainer}>Sign In</Text>
              <FastImage
                style={{ flex: 1, height: 100 }}
                source={require('@app/assets/images/app-auth-bg.png')}
              />
            </View>
            <View style={[styles().roundedView, { flex: 1, padding: 20 }]}>
              <View style={styles().roundedViewInner}>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                  <View style={styles().roundedContent}>
                    {loginStep === 1 ? (
                      <View style={styles().loginItem}>
                        {errors.phoneNumber ? (
                          <Text
                            style={[
                              styles().sectionText,
                              { color: ThemeStatic.badge },
                            ]}
                          >
                            {errors.phoneNumber}
                          </Text>
                        ) : (
                          <Text style={styles().sectionText}>
                            {phoneNumber && 'Phone Number'}
                          </Text>
                        )}
                        <View>
                          <PhoneInput
                            ref={phoneNumberRef}
                            autoFocus
                            defaultCode='ET'
                            layout='first'
                            onChangeFormattedText={(text) => {
                              setPhoneNumber(text)
                            }}
                            flagButtonStyle={{
                              backgroundColor: '#EFEFEF',
                              borderRadius: 10,
                              marginLeft: 10,
                              marginRight: -5,
                            }}
                            containerStyle={{
                              width: '100%',
                              borderRadius: 10,
                            }}
                            textContainerStyle={{
                              backgroundColor: '#EFEFEF',
                              borderRadius: 10,
                              marginLeft: -10,
                            }}
                            value={phoneNumber}
                            placeholder={'Phone Number'}
                          />
                        </View>
                      </View>
                    ) : (
                      <View style={[styles().loginItem, { marginTop: 10 }]}>
                        {errors.password ? (
                          <Text
                            style={[
                              styles().sectionText,
                              { color: ThemeStatic.badge },
                            ]}
                          >
                            {errors.password}
                          </Text>
                        ) : (
                          <Text>Enter the OTP sent to {phoneNumber}</Text>
                        )}
                        <InputGroup borderType='underline'>
                          <SafeAreaView style={styles().root}>
                            <CodeField
                              ref={ref1}
                              {...props}
                              value={password}
                              onChangeText={(password) => {
                                setPassword(password)
                                setError((error) => ({
                                  ...error,
                                  password: '',
                                }))
                              }}
                              cellCount={4}
                              rootStyle={styles().codeFieldRoot}
                              keyboardType='number-pad'
                              textContentType='oneTimeCode'
                              renderCell={({ index, symbol, isFocused }) => (
                                <Text
                                  key={index}
                                  style={[
                                    styles().cell,
                                    isFocused && styles().focusCell,
                                  ]}
                                  onLayout={getCellOnLayoutHandler(index)}
                                >
                                  {symbol || (isFocused ? <Cursor /> : null)}
                                </Text>
                              )}
                              accessibilityLabel={'Login_Password'}
                            />
                          </SafeAreaView>
                        </InputGroup>
                      </View>
                    )}
                    <TouchableOpacity
                      accessibilityLabel={'Login_SignIn'}
                      style={[
                        styles().button,
                        { backgroundColor: ThemeStatic.accent },
                      ]}
                      onPress={
                        loadingUserLogin
                          ? () => {}
                          : loginStep === 1
                            ? _sendCode
                            : _signIn
                      }
                    >
                      {loadingUserLogin ? (
                        <ActivityIndicator size='small' color='#FFFFFF' />
                      ) : (
                        <Text
                          style={{
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        >
                          {(loginStep === 1 && 'Send Code') ||
                            (loginStep === 2 && 'Sign In')}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles().separatorStyle}></View>
          </View>
        </KeyboardAwareScrollView>
      </>
    )
  }
  return <View style={styles().container}>{content}</View>
}

export default LoginScreen
