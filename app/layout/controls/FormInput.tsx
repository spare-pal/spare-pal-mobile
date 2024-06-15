import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'

import { AppContext } from '@app/context'
import { ThemeColors } from '@app/types/theme'
import { Typography } from '@app/theme'

const { FontWeights, FontSizes } = Typography

interface FormInputProps {
  ref: React.Ref<any>
  label: string
  placeholder: string
  value: string
  onChangeText: any
  multiline?: boolean
  characterRestriction?: number
  children?: any
  error?: string
}

const FormInput: React.FC<FormInputProps> = React.forwardRef(
  (
    {
      label,
      placeholder,
      value,
      onChangeText,
      children,
      multiline,
      characterRestriction,
      error,
    },
    ref
  ) => {
    const { theme } = useContext(AppContext)
    return <View />
  }
)

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    labelTextStyle: {
      ...FontWeights.Regular,
    },
    textStyle: {
      ...FontWeights.Light,
      color: theme.text01,
    },
  })

export default FormInput
