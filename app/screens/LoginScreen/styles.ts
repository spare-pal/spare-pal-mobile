import { ThemeStatic, Typography } from '@app/theme'
import { ThemeColors } from '@app/types/theme'
import { Platform, StyleSheet } from 'react-native'
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions'

const { FontWeights, FontSizes } = Typography
export const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,

      alignItems: 'center',
    },
    content: {
      marginTop: responsiveHeight(6),
      marginBottom: responsiveHeight(6),
      marginHorizontal: 20,
      flexDirection: 'column',
      alignSelf: 'flex-start',
      flex: 1,
    },
    titleText: {
      ...FontWeights.Bold,
      ...FontSizes.Label,
      color: '#666',
      textAlign: 'center',
    },
    termsTitleText: {
      ...FontWeights.Regular,
      ...FontSizes.Label,
      marginVertical: 10,
      color: theme.text01,
    },
    subtitleText: {
      ...FontWeights.Light,
      ...FontSizes.Caption,

      color: '#888',
      textAlign: 'center',
    },
    banner: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: responsiveHeight(Platform.select({ ios: 10, android: 12 })),
      paddingBottom: 40,
    },
    logo: {
      flex: 1,
      alignItems: 'center',
    },
    loginButton: {
      height: 44,
      width: responsiveWidth(90),
      alignSelf: 'center',
      marginBottom: 10,
      borderWidth: Platform.select({
        ios: StyleSheet.hairlineWidth,
        android: 0.8,
      }),
      borderColor: theme.accent,
      backgroundColor: theme.base,
    },
    loginButtonText: {
      ...FontWeights.Regular,
      ...FontSizes.Body,
      marginLeft: 10,
      color: theme.accent,
    },
    appleSignIn: {
      height: 44,
      width: responsiveWidth(90),
      marginBottom: 10,
    },
    loadingAppleLogin: {
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
    terms: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 25,
    },
    termsView: {
      flex: 0.15,
    },
    termsText: {
      ...FontWeights.Light,
      ...FontSizes.Body,
      color: '#666',
      marginTop: 10,
    },
    socialContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoImage: {
      height: 64,
      width: 64,
      resizeMode: 'stretch',
      marginBottom: 20,
      alignSelf: 'center',
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'contain',
      justifyContent: 'center',
    },
    roundedView: {
      borderRadius: 23,
      width: responsiveWidth(90),
      backgroundColor: 'white',
      alignSelf: 'center',
      alignContent: 'center',
    },
    roundedViewInner: {
      width: responsiveWidth(80),
      flex: 1,
      flexDirection: 'column',
      alignSelf: 'center',
      alignContent: 'center',
      textAlign: 'center',
      justifyContent: 'center',
    },
    roundedContent: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-evenly',
    },
    button: {
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 32,
      paddingTop: 12,
      paddingBottom: 12,
      margin: 7,
    },
    iconStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      width: 34,
      height: 34,
      zIndex: 99,
      left: 10,
    },
    loginItem: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-evenly',
    },

    input: {
      paddingLeft: 10,

      borderColor: ThemeStatic.text02,

      fontSize: 14,
    },
    inputIcons: { color: '#B1B2B1', fontSize: 24, paddingLeft: 10 },
    placeholderIcon: {
      position: 'absolute',
      bottom: 16,
    },

    sectionText: {
      fontSize: 12,
      color: ThemeStatic.text02,
      paddingLeft: 32,
    },
    textField: {
      backgroundColor: '#EFEFEF',
      borderRadius: 5,
      flexDirection: 'row',
      paddingVertical: 10,
      alignItems: 'center',
    },
    termsTextForgotPassword: {
      color: ThemeStatic.accentLight,
      fontWeight: 'bold',
      paddingTop: 10,
    },
    signInContainer: {
      color: ThemeStatic.accentLight,
      fontSize: 25,
      marginTop: 15,
      fontWeight: 'bold',
      textAlign: 'right',
    },
    signInDescription: {
      color: 'white',
      fontSize: 17,
      marginTop: 15,
      paddingBottom: 25,
    },
    separatorStyle: {
      marginTop: 30,
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 20,
    },
    cardViewStyle: {
      paddingTop: 20,
      paddingBottom: 20,
      flex: 1,
      marginTop: 1.5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    socailIcons: {
      color: 'black',
      fontSize: 28,
      backgroundColor: '#666666',
      padding: 6,
      borderRadius: 3,
      marginLeft: 12,
      width: 40,
    },
    skipButton: {
      color: '#6E6E72',
    },
    root: { flex: 1 },
    codeFieldRoot: { color: 'black', padding: 10 },
    cell: {
      width: 50,
      height: 50,
      lineHeight: 38,
      fontSize: 24,
      borderWidth: 2,
      borderColor: '#EFEFEF',
      textAlign: 'center',
      color: 'black',
      backgroundColor: '#EFEFEF',
      paddingTop: 5,
    },
    focusCell: {
      borderColor: '#EFEFEF',
    },
  })
