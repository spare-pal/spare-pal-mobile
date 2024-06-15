import React from 'react'
import { StyleSheet } from 'react-native'

const BackgroundView: React.FC = ({ contentView }: any) => {
  return <>{contentView}</>
}

const style = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'contain',
    justifyContent: 'center',
  },
})
export default BackgroundView
