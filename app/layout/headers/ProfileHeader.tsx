import { Box, HStack, StatusBar, Text, View } from 'native-base'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { LeftArrow } from '../../utils/commonFuntions'
import { ThemeStatic } from '../../theme'

type ProfileHeaderProps = {
  title: string
  goBack: () => void
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ title, goBack }) => {
  return (
    <>
      <StatusBar barStyle='light-content' />
      <Box safeAreaTop bg={ThemeStatic.accentLight} />
      <HStack
        bg={ThemeStatic.accentLight}
        px='3'
        py='2'
        alignItems='center'
        w='100%'
      >
        <TouchableOpacity onPress={() => goBack()} style={{ flex: 1 }}>
          <LeftArrow />
        </TouchableOpacity>
        <HStack alignItems='center' style={{ margin: 'auto' }}>
          <Text color='white' fontSize='20' fontWeight='bold'>
            {title}
          </Text>
        </HStack>
        <View style={{ flex: 1 }}></View>
      </HStack>
    </>
  )
}

export default ProfileHeader
