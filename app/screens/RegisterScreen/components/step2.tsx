import { ThemeStatic } from '@app/theme'
import { signUpSecondValidationSchema } from '@app/utils/validation'
import * as Linking from 'expo-linking'
import { Formik } from 'formik'
import { InputGroup } from 'native-base'
import React, { useEffect, useState } from 'react'
import { Animated, SafeAreaView, Text, View } from 'react-native'
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field'
import { Button } from 'react-native-elements'
import { ISignUpStepSecondValues } from '../interface'
import { styles } from '../styles'

interface Step2Interface {
  step: number
  loadingUserLogin: boolean
  formValues: ISignUpStepSecondValues
  onNext: (n: number, values: any) => void
}
const Step2: React.FC<Step2Interface> = ({
  formValues,
  loadingUserLogin,
  step,
  onNext,
}) => {
  const opacity = new Animated.Value(0)

  useEffect(() => {
    const handleOpenURL1 = (e: Linking.EventType | string) => {}
    Linking.getInitialURL()
      .then((ev) => {
        if (ev) {
          handleOpenURL1(ev)
        }
      })
      .catch((err) => {
        console.warn('An error occurred', err)
      })
  }, [])

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: step == 2 ? 2 : 1,
      duration: 400,
      useNativeDriver: true,
    }).start()
  }, [step])

  const CELL_COUNT = 4
  const [value, setValue] = useState('')
  const ref1 = useBlurOnFulfill({ value, cellCount: CELL_COUNT })
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  })
  return (
    <View
      style={[
        styles().roundedView,
        {
          flex: 0.65,
        },
      ]}
    >
      <View style={styles().roundedViewInner}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <Formik
            initialValues={{ ...formValues }}
            validationSchema={signUpSecondValidationSchema}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={styles().roundedContent}>
                <View style={styles().sectionRow}>
                  <View style={{ flex: 1 }}>
                    {errors.password ? (
                      <Text
                        style={[
                          styles().sectionText,
                          { color: ThemeStatic.badge },
                        ]}
                      >
                        {errors.password}
                      </Text>
                    ) : null}
                    <InputGroup borderType='underline'>
                      <SafeAreaView style={styles().root}>
                        <CodeField
                          ref={ref1}
                          {...props}
                          value={values.password}
                          onChangeText={handleChange('password')}
                          cellCount={CELL_COUNT}
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
                          accessibilityLabel={'passwordField'}
                        />
                      </SafeAreaView>
                    </InputGroup>
                  </View>
                </View>
                <Button
                  onPress={() => {
                    onNext(2, { otp: values.password })
                  }}
                  loading={loadingUserLogin}
                  fontWeight='bold'
                  fontFamily='sans-serif'
                  buttonStyle={[
                    styles().button,
                    { backgroundColor: ThemeStatic.accent },
                  ]}
                  title='Submit'
                  accessibilityLabel={'Verification_Submit'}
                />
              </View>
            )}
          </Formik>
        </View>
      </View>
    </View>
  )
}

export default Step2
export const inputStyle = {
  input: {
    textInputContainer: {
      backgroundColor: 'transparent',
      paddingLeft: 10,
      borderTopColor: 'white',
      borderBottomWidth: 1,
      borderBottomColor: '#B2C1D3',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      marginTop: 20,
      marginBottom: 20,
    },
    textInput: {
      backgroundColor: 'transparent',
      marginLeft: 0,
      marginRight: 0,
      marginTop: 0,
      marginBottom: 0,
      fontSize: 18,
    },
    poweredContainer: {
      backgroundColor: 'transparent',
    },
    predefinedPlacesDescription: {
      backgroundColor: 'transparent',
      color: '#1faadb',
    },
    row: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '80%',
      borderRadius: 35,
      height: 70,
      backgroundColor: '#E9EDF6',
      paddingLeft: 30,
      paddingRight: 30,
    },
    separator: {
      backgroundColor: 'white',
      marginBottom: 10,
    },
    description: {
      fontSize: 12,
      textAlign: 'center',
    },
    container: {
      overflow: 'visible',
      flexGrow: 0,
      flexShrink: 0,
      elevation: 200,
      zIndex: 99,
    },
    listView: {
      position: 'absolute',
      top: 70,
      elevation: 999,
      zIndex: 999,
      backgroundColor: 'white',
    },
  },
}
