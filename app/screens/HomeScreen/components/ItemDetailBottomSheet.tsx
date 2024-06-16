import { MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Modalize } from 'react-native-modalize'
import { ThemeStatic } from '../../../theme'
import FeedCarousel from '../../common/FeedCarousel'

const ItemDetailBottomSheet: React.FC<any> = React.forwardRef(
  ({ item, onAddCart }, ref) => {
    if (!item) return null
    const { Images, Shop } = item
    return (
      <Modalize
        ref={ref}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
        modalStyle={{
          flex: 0.8,
          padding: 15,
          backgroundColor: ThemeStatic.white,
        }}
      >
        <View
          style={{ backgroundColor: 'white', padding: 16, borderRadius: 16 }}
        >
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{item.name}</Text>
          <Text style={{ fontSize: 16, color: 'gray', margin: 5 }}>
            {item.description}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <FeedCarousel items={Images} onPress={() => {}} />
          </View>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              backgroundColor: 'orange',
              padding: 8,
              borderRadius: 8,

              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => onAddCart(item)}
          >
            <Text
              style={{
                fontSize: 16,
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              <MaterialIcons
                name='add-shopping-cart'
                style={{ fontSize: 16, color: ThemeStatic.white }}
              />{' '}
              Add to Cart
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            padding: 16,
            margin: 5,
            borderRadius: 16,
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
            <MaterialIcons
              name='store'
              style={{ fontSize: 24, color: ThemeStatic.accentLight }}
            />{' '}
            {Shop.name}
          </Text>
          <Text style={{ fontSize: 16, margin: 5, color: 'gray' }}>
            {Shop.description}
          </Text>
          <Text style={{ fontSize: 16, color: 'gray', textAlign: 'right' }}>
            <MaterialIcons
              name='location-on'
              style={{ fontSize: 24, color: ThemeStatic.accent }}
            />
            {Shop.address}
          </Text>
        </View>
      </Modalize>
    )
  }
)

export default ItemDetailBottomSheet
