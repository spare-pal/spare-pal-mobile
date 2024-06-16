import { AppContext } from '@app/context'
import { ThemeStatic } from '@app/theme'
import { signOut } from '@app/utils/authentication'
import { signUpFirstValidationSchema } from '@app/utils/validation'
import { FontAwesome, MaterialIcons, Zocial } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { Formik } from 'formik'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Animated, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Button } from 'react-native-elements'
import { useSelector } from 'react-redux'
import { welcomeNotification } from '../../../utils/notifications'
import { ISignUpStepFirstValues } from '../interface'
import { styles } from '../styles'
import PhoneInput from 'react-native-phone-number-input'

interface Step1Interface {
  step: number
  loadingUserLogin: boolean
  formValues: ISignUpStepFirstValues
  onNext: (n: number, values: any) => void
  terms?: any
}
const Step1: React.FC<Step1Interface> = ({
  formValues,
  loadingUserLogin,
  step,
  onNext,
  terms,
}) => {
  const { navigate } = useNavigation()
  const { theme } = useContext(AppContext)
  const opacity = new Animated.Value(0)

  const emailRef = useRef(null)
  const [email, setEmail] = useState<string | null>(null)
  const [phone, setPhone] = useState<string>('')
  const phoneNumberRef = useRef(null)

  const user = useSelector((state) => state.user)

  useEffect(() => {
    if (
      user.profile !== null &&
      user.profile !== undefined &&
      user.profile !== ''
    ) {
      if (user.success) navigateToApp(user?.profile?.token)
    }
  }, [!user.profile])

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: step == 1 ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start()
  }, [step])

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

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={[
          styles().roundedView,
          {
            flex: 1,
            opacity: opacity,
          },
        ]}
      >
        <View style={styles(theme).roundedViewInner}>
          <View>
            <Formik
              initialValues={{ ...formValues }}
              validationSchema={signUpFirstValidationSchema}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View style={styles(theme).roundedContent}>
                  <View style={styles(theme).sectionRow}>
                    <View style={styles(theme).fullName}>
                      <View
                        style={{
                          display: 'flex',
                          width: '48%',
                          marginRight: '4%',
                        }}
                      >
                        {errors.first_name && errors.first_name.length > 1 ? (
                          <Text
                            style={[
                              styles(theme).sectionText,
                              { color: ThemeStatic.badge },
                            ]}
                          >
                            {errors.first_name}
                          </Text>
                        ) : (
                          <Text style={styles(theme).sectionText}>
                            {!!values.first_name.length && 'First Name'}
                          </Text>
                        )}
                        <View style={styles().textField}>
                          <FontAwesome
                            name='user-circle'
                            style={styles().icons}
                          />
                          <TextInput
                            autoFocus
                            getRef={(input) => {
                              this.firstNameRef = input
                            }}
                            returnKeyType={'next'}
                            onSubmitEditing={() => {}}
                            blurOnSubmit={false}
                            defaultValue={values.first_name}
                            onChangeText={handleChange('first_name')}
                            style={styles(theme).input}
                            placeholderTextColor={ThemeStatic.text02}
                            placeholder={'First Name'}
                            accessibilityLabel={'Register_FirstName'}
                          />
                        </View>
                        {/* </InputGroup> */}
                      </View>
                      <View style={{ display: 'flex', width: '48%' }}>
                        {errors.last_name && errors.last_name.length > 1 ? (
                          <Text
                            style={[
                              styles(theme).sectionText,
                              { color: ThemeStatic.badge },
                            ]}
                          >
                            {errors.last_name}
                          </Text>
                        ) : (
                          <Text style={styles(theme).sectionText}>
                            {!!values.last_name.length && 'Last Name'}
                          </Text>
                        )}
                        <View style={styles().textField}>
                          <FontAwesome
                            name='user-circle'
                            style={styles().icons}
                          />
                          <TextInput
                            Ref={(input) => {
                              this.lastNameRef = input
                            }}
                            returnKeyType={'next'}
                            onSubmitEditing={() => {}}
                            blurOnSubmit={false}
                            defaultValue={values.last_name}
                            onChangeText={handleChange('last_name')}
                            style={styles(theme).input}
                            placeholderTextColor={ThemeStatic.text02}
                            placeholder={'Last Name'}
                            accessibilityLabel={'Register_LastName'}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles().EmailField}>
                    <View style={styles().textField}>
                      <Zocial name='email' style={styles().icons} />
                      <TextInput
                        ref={emailRef}
                        returnKeyType={'next'}
                        onSubmitEditing={() => {
                          email.current._root.focus()
                        }}
                        blurOnSubmit={false}
                        style={styles().input}
                        placeholderTextColor={ThemeStatic.text02}
                        value={values.email}
                        returnKeyType='next'
                        onChangeText={handleChange('email')}
                        placeholder={'Email'}
                        keyboardType='email-address'
                        accessibilityLabel={'Register_Email'}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      margin: 20,
                    }}
                  >
                    <PhoneInput
                      ref={phoneNumberRef}
                      autoFocus
                      defaultCode='ET'
                      layout='first'
                      onChangeFormattedText={(text) => {
                        setPhone(text)
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
                      value={phone}
                      placeholder={'Phone Number'}
                    />
                  </View>

                  <Button
                    onPress={() => {
                      onNext(1, { ...values, phone_number: phone })
                    }}
                    loading={loadingUserLogin}
                    fontWeight='bold'
                    fontFamily='sans-serif'
                    buttonStyle={[
                      styles().button,
                      { backgroundColor: ThemeStatic.accent },
                    ]}
                    title='Sign Up'
                    accessibilityLabel={'Register_SignUp'}
                  />
                </View>
              )}
            </Formik>
          </View>
        </View>
      </Animated.View>
    </View>
  )
}

export default Step1
