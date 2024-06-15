import React from 'react'
import { Header, Text, View } from 'native-base'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null, errorInfo: null }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    })
  }

  render() {
    if (this.state.errorInfo) {
      const { error, errorInfo } = this.state

      return (
        <View>
          <Header>Error occured</Header>
          <View>
            <Text>{error}</Text>
            <Text>{errorInfo.componentStack}</Text>
          </View>
        </View>
      )
    }

    return this.props.children
  }
}
