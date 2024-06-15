import React from 'react'
import { Spinner } from 'native-base'
import { isAuthenticated } from '../../utils/common'

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props)
    this.bootstrapAsync()
  }

  bootstrapAsync = async () => {
    const isLoggedIn = await isAuthenticated()

    this.props.navigation.navigate(isLoggedIn ? 'App' : 'Auth')
  }

  render() {
    return <Spinner active />
  }
}
