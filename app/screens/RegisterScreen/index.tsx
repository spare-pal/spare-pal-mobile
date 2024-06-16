import { clearLogin, loginUser, timeoutLogin } from '@app/actions/login'
import { signupUser } from '@app/actions/signup'
import { handleLoginError, signOut } from '@app/utils/authentication'
import {
  showErrorNotification,
  welcomeNotification,
} from '@app/utils/notifications'
import { loadToken } from '@app/utils/reduxStore'
import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useDispatch, useSelector } from 'react-redux'
import { LeftArrow } from '../../utils/commonFuntions'
import { saveToken } from '../../utils/reduxStore'
import LoginDetail from './components/step1'
import VerificationCode from './components/step2'
import { ISignUpStepFirstValues, ISignUpStepSecondValues } from './interface'
import { styles } from './styles'

const LoginScreen: React.FC = ({ navigation, route }: any) => {
  const dispatch = useDispatch()
  const { navigate, goBack } = navigation
  const [initializing, setInitializing] = useState(true)
  const [loginDetailData, setLoginDetailData] =
    useState<ISignUpStepFirstValues>({
      email: null,
      phone_number: '',
      first_name: '',
      last_name: '',
    })
  const [validationCodeValues, setValidationCodeValues] =
    useState<ISignUpStepSecondValues>({
      phone_number: '',
      password: '',
    })

  const steps = route.params?.step ?? 1
  const initialValues = route.params?.initialValues ?? 'initialValues'
  const [step, setStep] = useState<number>(steps)

  useEffect(() => {
    setValidationCodeValues(initialValues)
  }, [])

  const saveTokenAndNavigate = async (token: string) => {
    try {
      await saveToken(token)
      navigateToApp(token)
    } catch (err) {
      console.log(err)
    }
  }
  const user = useSelector((state) => state.user)
  const { success, error, loadingUserLogin } = user

  const cartData = useSelector((state) => state.cart)
  const { carts } = cartData

  const navigateBack = () => goBack()

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

  useEffect(() => {
    return () => {
      dispatch(clearLogin())
    }
  }, [])

  useEffect(() => {
    initialize()
  }, [success, error])

  const initialize = async () => {
    dispatch(timeoutLogin())
    try {
      const token = await loadToken()
      navigateToApp(token)
    } catch ({ message, name: errorType }) {
      handleLoginError(errorType as any)
      setInitializing(false)
    }
  }

  const goToStep = (n: number, values: any) => {
    if (n === 1) {
      setLoginDetailData(values)
      onSubmit(values)
    } else if (n === 2) {
      if (values.otp === '') {
        showErrorNotification('Verification code is required!')
      } else {
        const obj = {
          phone_number: loginDetailData.phone_number,
          password: values.otp,
          onSuccess: async (res: any) => {
            if (res && res.accessToken) {
              await saveTokenAndNavigate(res.accessToken)
            }
          },
        }
        console.log(obj)
        dispatch(loginUser(obj))
      }
    }
  }

  const onSubmit = (values: any) => {
    let data = {} as any
    data = { ...values }
    let email = data.email?.toLowerCase()
    data.email = email

    if (values.first_name === '') {
      showErrorNotification('First name is required.')
    } else if (values.last_name === '') {
      showErrorNotification('Last name is required.')
    } else if (values.phone_number === '') {
      showErrorNotification('Phone is required.')
    } else {
      processNewUser(data)
    }
  }

  const processNewUser = (data: any) => {
    let obj = {
      item: data,
      onSuccess: (res) => {
        setStep(2)
      },
      onFail: (err) => {
        if (err && err.firstname) {
          showErrorNotification(err.firstname)
        } else if (err && err.lastname) {
          showErrorNotification(err.lastname)
        } else if (err && err.email) {
          showErrorNotification(err.email)
        } else if (err && err.password) {
          showErrorNotification(err.password)
        }
      },
    }
    dispatch(signupUser(obj))
  }

  let content = <View />

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
              <Text style={styles().registerInContainer}>
                {step == 1 ? (
                  <Text>Sign up</Text>
                ) : <Text></Text> && step == 2 ? (
                  <Text>Enter 4-Digit Code</Text>
                ) : (
                  <Text></Text>
                )}
              </Text>
              <Text style={styles().registerInDescription}>
                {step == 2 ? (
                  <Text>Please enter the code sent to your phone</Text>
                ) : (
                  <Text></Text>
                )}
              </Text>
            </View>
            {step == 1 && (
              <LoginDetail
                step={step}
                formValues={loginDetailData}
                loadingUserLogin={loadingUserLogin}
                onNext={goToStep}
              />
            )}
            {step == 2 && (
              <VerificationCode
                step={step}
                formValues={validationCodeValues}
                loadingUserLogin={loadingUserLogin}
                onNext={goToStep}
              />
            )}
          </View>
        </KeyboardAwareScrollView>
      </>
    )
  }

  return <View style={styles().container}>{content}</View>
}

export default LoginScreen
