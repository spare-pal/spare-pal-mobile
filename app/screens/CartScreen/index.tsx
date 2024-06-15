import { Routes } from '@app/constants'
import LoadingIndicator from '@app/layout/misc/LoadingIndicator'
import { ThemeStatic } from '@app/theme'
import { ThemeColors } from '@app/types/theme'
import { Feather, FontAwesome } from '@expo/vector-icons'
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
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { useSelector } from 'react-redux'
import ListEmptyComponent from '../../layout/misc/ListEmptyComponent'
import { getImageUrl } from '../../utils/common'

const screenWidth = Math.round(Dimensions.get('window').width)

const CartScreen: React.FC = ({ navigation }: any) => {
  const { navigate } = navigation
  const cartData = useSelector((state) => state.cart)
  const { carts, loading } = cartData

  const error = false
  const tax = 0.0

  const calculateTotal = () => {
    if (carts && !carts.detail && carts.length > 0) {
      let totalPrice =
        tax +
        carts.reduce(
          (total: number, item: any) =>
            item &&
            item.listing &&
            item.listing.buyer_price &&
            total +
              parseFloat(
                item.listing.status == 'published'
                  ? item.listing.buyer_price
                  : 0
              ),
          0.0
        )

      return totalPrice.toFixed(2)
    } else {
      return 0.0
    }
  }

  const RightActions = (progress, item) => {
    return (
      <>
        <View
          style={{
            backgroundColor: 'red',
            justifyContent: 'center',
            marginTop: 5,
            marginBottom: 5,
            marginLeft: 5,
          }}
        >
          <TouchableOpacity
            onPress={() => onDeleteCart(item.listing.id)}
            style={{ backgroundColor: 'transparent' }}
          >
            <FontAwesome
              type='FontAwesome'
              name='trash-o'
              size={30}
              style={{
                color: ThemeStatic.white,
                fontSize: 30,
                paddingHorizontal: 20,
                fontWeight: 'bold',
              }}
            />
            <Text
              style={{
                color: ThemeStatic.white,
                fontSize: 15,
                paddingHorizontal: 10,
                fontWeight: 'bold',
              }}
            >
              Delete
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: 'green',
            justifyContent: 'center',
            margin: 5,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              navigate(Routes.ListingDetail, { data: item.listing, index: 0 })
            }
            style={{ backgroundColor: 'transparent' }}
          >
            <FontAwesome
              size={28}
              type='FontAwesome'
              name='arrow-right'
              style={{
                color: ThemeStatic.white,
                fontSize: 28,
                paddingHorizontal: 20,
              }}
            />
            <Text
              style={{
                color: ThemeStatic.white,
                fontSize: 15,
                paddingHorizontal: 15,
                fontWeight: 'bold',
              }}
            >
              View
            </Text>
          </TouchableOpacity>
        </View>
      </>
    )
  }

  const renderCartItem = ({ item, index }) => {
    const { id, title, buyer_price, items, status } = item.listing

    return (
      <>
        <Swipeable
          renderRightActions={(progress) => RightActions(progress, item)}
        >
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
                  {
                    <>
                      <Badge
                        style={{
                          backgroundColor: ThemeStatic.accentLight,
                          position: 'absolute',
                          top: -12,
                          left: -5,
                          zIndex: 2,
                        }}
                      >
                        <Text style={{ color: '#333' }}>+{items.length}</Text>
                      </Badge>
                      <Image
                        key={index}
                        style={styles().paginationImageStyle}
                        source={{ uri: getImageUrl(items, true) }}
                      />
                    </>
                  }
                </View>
              </Col>
              <Col>
                <Text style={styles().titleText}>{title}</Text>
                <Text style={styles().subtitleText}>{items.length} items</Text>
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
                    <TouchableOpacity
                      onPress={() => onDeleteItem(item.listing.id)}
                    >
                      <Text style={styles().textStyle}>X</Text>
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
                      ${parseFloat(buyer_price).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </Col>
            </Row>
            {status !== 'published' && (
              <Text style={styles().errorstyle}>{'No Longer Available'}</Text>
            )}
          </Card>
        </Swipeable>
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
              <Text style={styles().footerText}>SHIPPING</Text>
            </Col>
            <Col
              style={{
                width: 100,
                alignItems: 'flex-end',
                alignSelf: 'center',
              }}
            >
              <Text style={{ fontSize: 12, color: 'green' }}>FREE</Text>
            </Col>
          </Row>
          <Row>
            <Col>
              <Text style={styles().footerText}>TOTAL</Text>
            </Col>
            <Col
              style={{
                width: 100,
                alignItems: 'flex-end',
                alignSelf: 'center',
              }}
            >
              <Text style={styles().totalText}>${calculateTotal()}</Text>
            </Col>
          </Row>
        </Card>
        <Button
          style={{ margin: 16, backgroundColor: '#5CB85C' }}
          full
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
      {loading ? (
        <LoadingIndicator />
      ) : (
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
          keyExtractor={(item) => item.listing.id.toString()}
        />
      )}
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
      height: screenWidth / 3,
      aspectRatio: 1,
      resizeMode: 'contain',
    },
    titleText: {
      fontSize: 16,
      color: '#444',
    },
    subtitleText: {
      fontSize: 12,
      color: theme.text02,
    },
    rowPriceText: {
      fontSize: 14,
      color: ThemeStatic.accent,
    },
    footerText: {
      fontSize: 16,
      color: theme.text02,
    },
    totalText: {
      fontSize: 17,
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
