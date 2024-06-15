import { IconSizes } from '@app/constants'
import { AppContext } from '@app/context'
import { ThemeStatic } from '@app/theme'
import { ThemeColors } from '@app/types/theme'
import { FontAwesome5 } from '@expo/vector-icons'
import { Button, Card, Text, View } from 'native-base'
import React, { useContext, useState } from 'react'
import { StyleSheet } from 'react-native'
import { Col, Grid, Row } from 'react-native-easy-grid'
import { useSelector } from 'react-redux'
import TagDisplay from '../../../../app/screens/common/TagDisplay'
import FeedCarousel from '../../common/FeedCarousel'

interface FeedCardProps {
  item: any
  isSelling?: boolean
  onAddCart?: (item: any) => void
  onFavorite?: (item: any) => void
  onDetail: (item: any, index: number) => void
}
const FeedCard: React.FC<FeedCardProps> = ({
  item,
  isSelling,
  onDetail,
  onAddCart,
  onFavorite,
}) => {
  const { theme } = useContext(AppContext)
  const { title, price, tags, Images, status } = item
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ETB',
  })
  const priceFormat = formatter.format(price)
  const navigateToScreen = (index) => {
    onDetail(item, index)
  }

  const options = useSelector((state) => state.shop.options)

  const badgeStatus = (status) => {
    switch (status) {
      case 'draft':
        return (
          <View
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#62B1FC',
              borderRadius: 13,
            }}
          >
            <Text
              style={{
                color: 'white',
                paddingHorizontal: 10,
                paddingVertical: 3,
              }}
            >
              {status}
            </Text>
          </View>
        )
      case 'published':
        return (
          <View
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#119822',
              borderRadius: 13,
            }}
          >
            <Text
              style={{
                color: 'white',
                paddingHorizontal: 10,
                paddingVertical: 3,
              }}
            >
              {status}
            </Text>
          </View>
        )
      default:
        return (
          <View
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#458845',
              borderRadius: 13,
            }}
          >
            <Text
              style={{
                color: 'white',
                paddingHorizontal: 10,
                paddingVertical: 3,
              }}
            >
              {status}
            </Text>
          </View>
        )
    }
  }

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Card
        style={{
          borderWidth: 1,
          shadowOpacity: 1,
          borderRadius: 10,
          shadowRadius: 12,
          marginVertical: 5,
          shadowColor: 'black',

          marginHorizontal: 12,
          borderColor: 'lightgray',
          backgroundColor: 'white',
          shadowOffset: { width: 1, height: 20 },
        }}
      >
        {/* <Col> */}
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  marginRight: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: ThemeStatic.accent,
                  borderRadius: 20,
                  height: 25,
                  width: 25,
                }}
              >
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 16,
                    alignSelf: 'center',
                  }}
                  onPress={(i) => navigateToScreen(0)}
                >
                  {item.id}
                </Text>
              </View>
              <Text
                style={{
                  maxWidth: 210,

                  marginRight: 22,
                  fontWeight: '500',
                  padding: 5,
                  fontSize: 16,
                }}
                onPress={(i) => navigateToScreen(0)}
                accessibilityLabel={`${title}`}
              >
                {title}
              </Text>
            </View>
            {isSelling && <View style={{}}>{badgeStatus(status)}</View>}
          </View>
        </View>

        <FeedCarousel items={Images} onPress={(i) => navigateToScreen(i)} />
        <TagDisplay
          items={Images}
          options={options}
          value={tags}
          onChange={(tags) => {}}
          labelExtractor={(tag) => tag}
          text={''}
          inputProps={{
            placeholder: '',

            placeholderTextColor: 'blue',
          }}
          tagColor={theme.accent}
          tagTextStyle={{ fontSize: 12 }}
          tagContainerStyle={{ height: 26, borderRadius: 6 }}
          tagTextColor={theme.white}
          editable={false}
          onChangeText={(value) => setText(value)}
        />
        <Grid>
          <Col>
            <Row>
              <Col
                style={{
                  alignItems: 'flex-end',
                  alignSelf: 'flex-end',
                }}
              >
                <Row>
                  <Text
                    style={styles(theme).priceText}
                    accessibilityLabel={`${priceFormat}_feedCard`}
                  >
                    {priceFormat}
                  </Text>

                  <Button
                    onPress={() => onAddCart(item)}
                    block
                    bordered
                    style={{
                      width: 40,
                      marginLeft: 10,
                      alignSelf: 'flex-center',
                      backgroundColor: ThemeStatic.white,
                      borderColor: ThemeStatic.translucent,
                    }}
                    accessibilityLabel={'addToCart_feedCard'}
                  >
                    <FontAwesome5
                      name='cart-arrow-down'
                      size={IconSizes.x5}
                      style={{ fontSize: 15, color: '#FA9F42' }}
                    />
                  </Button>
                </Row>
              </Col>
            </Row>
          </Col>
        </Grid>
      </Card>
    </View>
  )
}

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    itemCountText: {
      fontSize: 20,
      color: '#4062BB',
      marginTop: 10,
    },
    tagTextColor: {
      color: '#f9c',
    },
    userRating: {
      fontSize: 10,
      color: 'green',
    },
    priceText: {
      fontSize: 20,
      textAlign: 'right',
      color: theme.accent,
      fontWeight: '600',
    },
    unitPriceText: {
      fontSize: 13,
      fontWeight: '500',
      color: theme.lightBlue,
    },
    titleText: {
      fontSize: 14,
      color: 'black',
      textAlign: 'left',
      alignSelf: 'flex-start',
    },
    tinyLogo: {
      width: 64,
      height: 64,
    },
  })

export default FeedCard
