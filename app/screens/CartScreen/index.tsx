import { addToCart, clearItem, removeItem } from '@app/actions/cart'
import { ThemeStatic } from '@app/theme'
import { ThemeColors } from '@app/types/theme'
import { Feather, MaterialIcons } from '@expo/vector-icons'
import {
  Badge,
  Box,
  Button,
  Card,
  HStack,
  Icon,
  IconButton,
  StatusBar,
  Text,
} from 'native-base'
import React from 'react'
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { Col, Row } from 'react-native-easy-grid'
import { useDispatch, useSelector } from 'react-redux'
import ListEmptyComponent from '../../layout/misc/ListEmptyComponent'

const screenWidth = Math.round(Dimensions.get('window').width)

const CartScreen: React.FC = ({ navigation }: any) => {
  const { carts } = useSelector((state) => state.cart)
  const dispatch = useDispatch()

  const clearItemFromCart = (item: any) => {
    dispatch(clearItem(item))
  }

  const removeItemFromCart = (item: any) => {
    dispatch(removeItem(item))
  }

  const addItemToCart = (item: any) => {
    dispatch(addToCart(item))
  }

  const error = false
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

  const renderCartItem = ({ item: data }) => {
    const { id, quantity, item } = data
    const { name, Images, price } = item
    return (
      <>
        <Card
          style={{
            borderWidth: 1,
            shadowOpacity: 1,
            borderRadius: 10,
            shadowRadius: 12,
            marginVertical: 5,
            shadowColor: 'black',
            alignItems: 'center',
            marginHorizontal: 12,
            borderColor: 'lightgray',
            backgroundColor: 'white',
            shadowOffset: { width: 1, height: 20 },
          }}
        >
          <Row>
            <Col>
              <View style={styles().imageContainer}>
                <Image
                  key={id}
                  style={styles().paginationImageStyle}
                  source={{ uri: Images[0].url }}
                />
              </View>
            </Col>
            <Col>
              <Text style={styles().titleText}>{name}</Text>
              <Text style={styles().subtitleText}>{quantity} items</Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                }}
              >
                <Button
                  onPress={() => removeItemFromCart(item)}
                  style={{
                    width: 35,
                    backgroundColor: ThemeStatic.black,
                  }}
                >
                  -
                </Button>
                <Badge
                  style={{
                    width: 50,
                    backgroundColor: 'white',
                    borderColor: ThemeStatic.placeholder,
                  }}
                >
                  {quantity}
                </Badge>
                <Button
                  onPress={() => addItemToCart(item)}
                  style={{
                    width: 35,
                    backgroundColor: ThemeStatic.black,
                  }}
                >
                  +
                </Button>
              </View>
            </Col>
            <Col
              style={{
                flex: 0.5,
                flexDirection: 'row',
                alignItems: 'center',
                alignContent: 'flex-end',
              }}
            >
              <View style={{ display: 'flex', flexDirection: 'column' }}>
                <View style={styles().xbutton}>
                  <TouchableOpacity onPress={() => clearItemFromCart(item)}>
                    <Text style={styles().textStyle}>
                      <MaterialIcons
                        name='delete-forever'
                        style={{ fontSize: 24, color: ThemeStatic.accent }}
                      />
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    marginTop: 35,
                  }}
                >
                  <Text style={styles().rowPriceText}>
                    {parseFloat(quantity * price).toFixed(2)}
                  </Text>
                </View>
              </View>
            </Col>
          </Row>
        </Card>
      </>
    )
  }
  let summary = <View />
  if (!error && carts?.length > 0) {
    summary = (
      <View style={{ flex: 1 }}>
        <Card
          style={{
            borderWidth: 1,
            shadowOpacity: 1,
            borderRadius: 10,
            shadowRadius: 12,
            marginVertical: 5,
            shadowColor: 'black',
            alignItems: 'center',
            marginHorizontal: 12,
            borderColor: 'lightgray',
            backgroundColor: 'white',
            shadowOffset: { width: 1, height: 20 },
          }}
        >
          <Row>
            <Col>
              <Text style={styles().footerText}>TOTAL</Text>
            </Col>
            <Col
              style={{
                alignItems: 'flex-end',
                alignSelf: 'center',
              }}
            >
              <Text style={styles().totalText}>ETB {calculateTotal()}</Text>
            </Col>
          </Row>
        </Card>
        <Button
          style={{ margin: 16, backgroundColor: '#5CB85C' }}
          disabled={carts && carts.length > 0 ? false : true}
        >
          <Text style={{ color: '#FFFFFF' }}>Checkout</Text>
        </Button>
      </View>
    )
  }
  return (
    <View style={{ flex: 1 }}>
      <StatusBar bg={ThemeStatic.accentLight} barStyle='light-content' />
      <Box safeAreaTop bg={ThemeStatic.accentLight} />
      <HStack
        bg={ThemeStatic.accentLight}
        px='3'
        py='2'
        justifyContent='space-between'
        alignItems='center'
        w='100%'
      >
        <HStack alignItems='center'>
          <IconButton
            icon={
              <Icon size='sm' as={Feather} name='shopping-cart' color='white' />
            }
          />
          <Text color='white' fontSize='20' fontWeight='bold'>
            Shopping Cart
          </Text>
        </HStack>
      </HStack>
      <FlatList
        extraData={carts.length}
        bounces={false}
        showsVerticalScrollIndicator={false}
        data={carts && carts.length > 0 ? carts : []}
        renderItem={renderCartItem}
        style={styles().container}
        ListEmptyComponent={() => (
          <View>
            <Image
              source={require('../../../assets/images/empty-cart-image.png')}
              style={{
                alignSelf: 'center',
                width: 100,
                aspectRatio: '1',
                borderRadius: 20,
              }}
            />
            <ListEmptyComponent
              placeholder='Add items here from the Shop screen!'
              placeholderStyle={styles().placeholderStyle}
              spacing={10}
            />
          </View>
        )}
        ListFooterComponent={summary}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  )
}

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      margin: 10,
      backgroundColor: theme.base,
    },
    listStyle: {},
    placeholderStyle: {},
    errorstyle: {
      alignSelf: 'center',
      color: 'red',
      fontSize: 14,
      fontWeight: '500',
    },
    imageContainer: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    paginationImageStyle: {
      width: screenWidth / 4,
      height: screenWidth / 4,
      resizeMode: 'contain',
    },
    titleText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#444',
    },
    subtitleText: {
      fontSize: 12,
      color: theme.text02,
    },
    rowPriceText: {
      fontSize: 14,
      color: ThemeStatic.black,
    },
    footerText: {
      fontSize: 16,
      color: theme.text02,
    },
    totalText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: ThemeStatic.accent,
    },
    xbutton: { display: 'flex', flexDirection: 'row-reverse' },
    textStyle: { fontWeight: 'bold', fontSize: 18, color: 'red' },
    headerView: {
      alignItems: 'center',
      backgroundColor: '#6E5ABA',
      height: 70,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    headerTitle: {
      color: ThemeStatic.headerTitle,
      marginTop: 30,
      textAlign: 'center',
      alignSelf: 'center',
    },
    headerRightContent: {
      marginTop: 30,
      marginRight: 20,
      color: '#F0AD4F',
    },
  })

export default CartScreen
