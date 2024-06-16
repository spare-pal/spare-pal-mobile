import { placeOrder } from '@app/actions/cart'
import { ProfileHeader } from '@app/layout'
import {
  showErrorNotification,
  showSuccessNotification,
} from '@app/utils/notifications'
import { Button, Card, ScrollView, Text } from 'native-base'
import React from 'react'
import { ActivityIndicator, Image, TextInput, View } from 'react-native'
import { Col, Row } from 'react-native-easy-grid'
import { useDispatch, useSelector } from 'react-redux'
import { ThemeStatic } from '../../theme'

const CheckoutScreen: React.FC = ({ navigation }: any) => {
  const dispatch = useDispatch()
  const { navigate } = navigation
  const { carts, placeOrderLoading } = useSelector((state) => state.cart)
  const [address, setAddress] = React.useState('')
  const [note, setNote] = React.useState('')
  const calculateTotal = () => {
    if (carts && carts.length > 0) {
      const totalPrice = carts.reduce(
        (acc, cartItem) => cartItem.quantity * cartItem.item.price + acc,
        0
      )
      return totalPrice.toFixed(2)
    } else {
      return 0.0
    }
  }
  const handleSubmit = () => {
    if (!address) {
      showErrorNotification('Please enter delivery address')
      return
    }
    if (carts && carts.length > 0) {
      const order = {
        address,
        note,
        order_items: carts.map((data) => {
          const { quantity, id } = data
          return {
            quantity,
            product_id: id,
          }
        }),
        payment_method: 'cash_on_delivery',
      }
      const obj = {
        order,
        onSuccess: () => {
          navigate('CartScreen')
          showSuccessNotification('Order placed successfully')
        },
        onFail: (err) => {},
      }
      dispatch(placeOrder(obj))
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <ProfileHeader title='Checkout' goBack={() => navigate('CartScreen')} />
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: 'white',
        }}
      >
        {carts.map((data) => {
          const { id, quantity, item } = data
          const { name, Images, price } = item
          return (
            <Card
              key={data.id}
              style={{
                height: 100,
                borderRadius: 10,
                marginVertical: 5,
                alignItems: 'center',
              }}
            >
              <Row>
                <Col>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                    }}
                  >
                    <Image
                      key={id}
                      style={{
                        width: 100,
                        height: 80,
                        borderRadius: 10,
                      }}
                      source={{ uri: Images[0].url }}
                    />
                  </View>
                </Col>
                <Col>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      marginTop: 10,
                      textAlign: 'right',
                    }}
                  >
                    {name}
                  </Text>
                  <Text
                    style={{
                      textAlign: 'right',
                    }}
                  >
                    {quantity} items
                  </Text>
                  <Text
                    style={{
                      textAlign: 'right',
                      fontWeight: 'bold',
                    }}
                  >
                    ETB {parseFloat(quantity * price).toFixed(2)}
                  </Text>
                </Col>
              </Row>
            </Card>
          )
        })}
        <View
          style={{
            width: '90%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderColor: ThemeStatic.text02,
            borderWidth: 1,
            padding: 10,
            borderRadius: 10,
            marginVertical: 10,
          }}
        >
          <Text>TOTAL</Text>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
            }}
          >
            ETB {calculateTotal()}
          </Text>
        </View>
        <TextInput
          style={{
            height: 40,
            width: '90%',
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 5,
            marginVertical: 10,
            paddingLeft: 10,
          }}
          placeholder='Enter delivery address'
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={{
            height: 80,
            width: '90%',
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 5,
            marginBottom: 10,
            paddingLeft: 10,
            textAlignVertical: 'top',
          }}
          placeholder='Enter a note (optional)'
          value={note}
          onChangeText={setNote}
          multiline
        />
        <Button
          style={{ margin: 16, backgroundColor: '#5CB85C', width: '90%' }}
          disabled={carts && carts.length > 0 ? false : true}
          onPress={handleSubmit}
        >
          {placeOrderLoading ? (
            <ActivityIndicator color='#FFFFFF' />
          ) : (
            <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
              Place Order
            </Text>
          )}
        </Button>
      </ScrollView>
    </View>
  )
}

export default CheckoutScreen
