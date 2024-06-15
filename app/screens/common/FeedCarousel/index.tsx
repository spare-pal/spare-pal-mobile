import { default as React, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { SwiperFlatList } from 'react-native-swiper-flatlist'
import { hp, wp } from '../../../constants'
import { ThemeStatic } from '../../../theme'

interface FeedCarouselProps {
  items: any
  onPress: (index: number) => void
}

const FeedCarousel: React.FC<FeedCarouselProps> = ({ items }) => {
  const carouselRef = useRef()
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
      }}
    >
      <SwiperFlatList
        index={0}
        ref={carouselRef}
        getItemLayout={(data, index) => ({
          length: wp(90),
          offset: wp(90) * index,
          index,
        })}
        showPagination
        paginationActiveColor={ThemeStatic.accent}
        paginationDefaultColor={ThemeStatic.accentLight}
        data={items}
        renderItem={({ item }) => (
          <View style={styles.child}>
            <FastImage source={{ uri: item.url }} style={styles.image} />
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  child: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: wp(90),
  },
  image: {
    flex: 1,
    width: wp(70),
    height: hp(30),
    marginBottom: hp(1),
  },
})

export default FeedCarousel
