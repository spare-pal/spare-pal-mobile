import { addToCart } from '@app/actions/cart'
import { getUserProfile } from '@app/actions/login'
import { getProducts } from '@app/actions/product'
import {
  addHistory,
  applyFilter,
  clearHistory,
  filterData,
  getShopList,
} from '@app/actions/shop'
import { AppContext } from '@app/context'
import { datas } from '@app/fake-data'
import { ExploreScreenPlaceholder, ListEmptyComponent } from '@app/layout'
import { ThemeStatic, Typography } from '@app/theme'
import { ThemeColors } from '@app/types/theme'
import { FontAwesome } from '@expo/vector-icons'
import * as Linking from 'expo-linking'
import { Text } from 'native-base'
import React, { useContext, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Keyboard,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  CollapsibleSubHeaderAnimator,
  useCollapsibleHeader,
} from 'react-navigation-collapsible'
import { useDispatch, useSelector } from 'react-redux'
import { AnimatedSearchBar } from '../../layout'
import FeedCard from '../common/FeedCard'
import ItemDetailBottomSheet from './components/ItemDetailBottomSheet'

const { FontWeights, FontSizes } = Typography

const CustomStatusBar = ({
  backgroundColor,
  barStyle = 'dark-content',
}: any) => {
  const insets = useSafeAreaInsets()

  return (
    <View style={{ height: insets.top, backgroundColor, zIndex: 1 }}>
      <StatusBar
        animated={true}
        backgroundColor={backgroundColor}
        barStyle={barStyle}
      />
    </View>
  )
}

const HomeScreen: React.FC = ({ navigation, route }: any) => {
  const {
    theme,
    size,
    updateSize,
    brand,
    updateBrand,
    category,
    updateCategory,
    selectedGender,
    updateGender,
  } = useContext(AppContext)
  const { navigate } = navigation
  const dispatch = useDispatch()
  const [searchText, setSearchText] = useState<string>('')
  const [searchResults, setSearchResults] = useState<any>([])
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false)

  const shops = useSelector((state) => state?.shop?.shops)
  const { products, productsPayload } = useSelector((state) => state?.product)
  const options = useSelector((state) => state.shop?.options)
  const cartData = useSelector((state) => state?.cart)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isClear, setIsClear] = useState(true)

  const [dispatchFilter, setDispatchFilter] = useState('')
  const [refreshFilter, setRefreshFilter] = useState('')
  const [searchFilters, setSearchFilters] = useState('')

  const historyData = useSelector((state) => state?.shop?.historyData)
  const user = useSelector((state) => state?.user)
  const isRefreshing = useSelector((state) => state?.shop?.shopListLoading)
  const itemDetailBottomSheetRef = React.useRef(null)
  const [item, setItem] = useState(null)

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if (url) {
        let { path, queryParams } = Linking.parse(url)
        let id = queryParams && queryParams.id ? queryParams.id : 0

        if (id > 0) {
          let objetData = shops.filter((item) => {
            return item.id == id
          })

          if (objetData.length > 0) {
            let data = objetData[0]
            navigate('ListingDetail', { data })
          }
        }
      }
    })
  }, [Linking])

  useEffect(() => {
    if (
      category.length === 0 &&
      selectedGender.length === 0 &&
      size.length === 0 &&
      brand.length === 0
    ) {
      setIsLoading(true)
      let obj = {
        onSuccess: () => setIsLoading(false),
        onFail: () => setIsLoading(false),
      }
      dispatch(getShopList(obj))
      setIsClear(true)
    }
  }, [])

  useEffect(() => {
    dispatch(applyFilter())
    if (
      user.profile !== null &&
      user.profile !== undefined &&
      user.profile !== ''
    ) {
      let userProfile = {
        onSuccess: () => {},
        onFail: () => {},
      }
      dispatch(getUserProfile(userProfile))
      dispatch(getProducts())
      // dispatch(refreshAuthToken())
    }
  }, [])

  const { onScroll, containerPaddingTop, scrollIndicatorInsetTop, translateY } =
    useCollapsibleHeader({
      navigationOptions: {
        headerStyle: {
          backgroundColor: 'white',
        },
      },
    })

  const [multiSize, setMultiSize] = useState([])

  const onChangeCategory = (item: string[]) => {
    if (item.length === 1) {
      if (item[0] === 'Shoes') {
        setMultiSize(shoesSize)
      } else {
        setMultiSize(otherSize)
      }
    } else {
      let index = item.findIndex((item) => item === 'Shoes')

      if (index === -1) {
        setMultiSize(otherSize)
      } else {
        let newSize = [...otherSize, ...shoesSize]
        setMultiSize(newSize)
      }
    }
    updateCategory(item)
  }

  const onChangeSize = (item: string) => {
    updateSize(item)
  }

  const onChangeBrand = (item: string) => {
    updateBrand(item)
  }

  const [catId, setCateId] = useState([])
  const [sizeId, setSizeId] = useState([])
  const [brandId, setBrandsId] = useState([])
  const [genderId, setGenderId] = useState([])

  const onChangeText = (txt: string) => {
    let searchSuggestions = datas
    if (txt !== '') {
      searchSuggestions = searchSuggestions.filter(
        (i) => i.title.toLowerCase().indexOf(txt.toLowerCase()) !== -1
      )
    }
    setSearchResults(searchSuggestions)

    setSearchText(txt)
  }
  const onSearchFocus = () => {
    setIsSearchFocused(true)
  }
  const onBlur = () => setIsSearchFocused(false)
  const onListingDetail = (item: any, index: number) => {
    setItem(item)
    // @ts-ignore
    itemDetailBottomSheetRef.current?.open()
  }
  const onAddCart = (item: any) => {
    dispatch(addToCart(item))
    console.log('add to cart', item)
  }

  const onRefresh = () => {
    if (
      category.length > 0 ||
      selectedGender.length > 0 ||
      size.length > 0 ||
      brand.length > 0
    ) {
      dispatch(filterData(refreshFilter))
    } else {
      dispatch(getProducts())
    }
  }

  const onEndReachedListing = () => {
    if (
      products.length > 0 &&
      productsPayload?.pagination?.next !== null &&
      !isLoadingMore
    ) {
      setIsLoadingMore(true)
      const obj = {
        next: productsPayload.pagination.next,
        onSuccess: () => {
          setIsLoadingMore(false)
        },
        onFail: () => {
          setIsLoadingMore(false)
        },
      }
      dispatch(getProducts(obj))
    }
  }

  let header = <ExploreScreenPlaceholder />

  if (!false) {
    header = (
      <SafeAreaView>
        <Animated.View
          style={{
            transform: [{ translateY }, { translateY: -10 }],
            backgroundColor: ThemeStatic.white,
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 10,
            paddingBottom: 0,
            padding: 0,
          }}
        >
          <View style={styles(theme).subContent}>
            <View style={{ flex: 1 }}>
              <AnimatedSearchBar
                onFocus={onSearchFocus}
                onBlur={onBlur}
                value={searchText}
                onChangeText={onChangeText}
                placeholder='Search'
                visible={isSearchFocused}
              ></AnimatedSearchBar>
            </View>
            <View style={{ justifyContent: 'center' }}></View>
          </View>
        </Animated.View>
      </SafeAreaView>
    )
  }

  const stickyHeaderHeight = 40

  let content = <ExploreScreenPlaceholder />
  if (!isLoading) {
    content = (
      <>
        <Animated.FlatList
          onScroll={onScroll}
          contentContainerStyle={{
            paddingTop:
              Platform.OS === 'ios'
                ? containerPaddingTop + stickyHeaderHeight
                : containerPaddingTop + stickyHeaderHeight,
          }}
          showsVerticalScrollIndicator={false}
          data={products}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              progressViewOffset={100}
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => onListingDetail(item, 0)}
            >
              <FeedCard
                isSelling={false}
                item={item}
                onDetail={() => {}}
                onAddCart={onAddCart}
              />
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <ListEmptyComponent
              placeholder='No matching products'
              placeholderStyle={styles().placeholderStyle}
              spacing={10}
            />
          )}
          keyExtractor={(item) => item.id?.toString()}
          onEndReachedThreshold={0.5}
          onEndReached={() => onEndReachedListing()}
          ListFooterComponent={() => (
            <View>
              {isLoadingMore && (
                <ActivityIndicator size={'large'} color={ThemeStatic.accent} />
              )}
            </View>
          )}
        />
      </>
    )
  }

  const historyManage = (item) => {
    if (historyData) {
      if (historyData.length == 0) {
        dispatch(addHistory([item]))
      } else {
        let filterHistory = historyData.filter((hitem) => {
          return hitem.id === item.id
        })
        if (filterHistory.length === 0) {
          dispatch(addHistory([item, ...historyData]))
        }
      }
    }
  }

  const deleteHistory = (item) => {
    if (historyData.length != 0) {
      let filterHistoryDelete = historyData.filter((hitem) => {
        return hitem.id != item.id
      })

      dispatch(clearHistory(filterHistoryDelete))
    }
  }

  const renderItem = ({ item }) => {
    const { name, id, urlId } = item

    const url = `/listings/?${urlId}`
    const reseting = () => {
      updateBrand([])
      updateGender([])
      updateCategory([])
      updateSize([])
      setGenderId([])
      setSizeId([])
      setCateId([])
      setBrandsId([])
    }

    return (
      <TouchableOpacity
        onPress={() => {
          if (url !== dispatchFilter) {
            reseting()
            dispatch(filterData(url))
            setDispatchFilter(url)
            setRefreshFilter(url)
            setSearchFilters(url)
            setIsClear(true)

            filterGlobalFromSearch(item)
          }
          setIsClear(true)

          onBlur()
          setSearchText('')
          Keyboard.dismiss()
        }}
      >
        <View
          style={{
            borderBottomColor: ThemeStatic.white,
            borderBottomWidth: 1,
            paddingHorizontal: 20,
            paddingVertical: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text>{name}</Text>
          <TouchableOpacity
            onPress={() => {
              deleteHistory(item)
            }}
            hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
          >
            <FontAwesome
              type='FontAwesome'
              name='close'
              size={20}
              style={{ color: ThemeStatic.black, fontSize: 20 }}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }

  const filterGlobalFromSearch = (item) => {
    if (item.urlId.startsWith('items__category')) {
      onChangeCategory([item.name])
    } else if (item.urlId.startsWith('items__size')) {
      onChangeSize([item.name])
    } else if (item.urlId.startsWith('items__brand')) {
      onChangeBrand([item.name])
    }
  }

  const renderResultItem = ({ item }) => {
    const { name, id, urlId } = item

    return (
      <TouchableOpacity
        onPress={() => {
          dispatch(filterData('/listings/?' + urlId))
          historyManage(item)
          setSearchText('')
          onBlur()
          setDispatchFilter(urlId)
          setRefreshFilter(urlId)
          setSearchFilters(urlId)
          setIsClear(true)
          setRefreshFilter(urlId)
          setSearchFilters(urlId)
          setIsClear(true)
          Keyboard.dismiss()
          filterGlobalFromSearch(item)
        }}
        style={{
          transform: [{ translateY }],
        }}
      >
        <View
          style={{
            borderBottomColor: ThemeStatic.white,
            borderBottomWidth: 1,
            paddingHorizontal: 20,
            paddingVertical: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text>{name}</Text>
        </View>
      </TouchableOpacity>
    )
  }
  let searchContent = <ExploreScreenPlaceholder />
  if (!isLoading) {
    let searchData = []
    if (searchText !== '' && options) {
      let catData = []
      if (options && options.categories && options.categories.length > 0) {
        options.categories.map((cat_item) => {
          const cat = cat_item.name.toLowerCase()
          if (cat.indexOf(searchText.toLowerCase()) !== -1) {
            catData.push(cat_item)
          }
          cat_item.children.map((cat_child) => {
            const cat_name = cat_child.name.toLowerCase()
            if (cat_name.indexOf(searchText.toLowerCase()) !== -1) {
              catData.push(cat_child)
            }
          })
        })
      }
      let sData = []
      if (options && options.sizes && options.sizes.length > 0) {
        options.sizes.map((item) => {
          const size = item.name.toLowerCase()
          if (size.indexOf(searchText.toLowerCase()) !== -1) {
            sData.push(item)
          }
          item.children.map((size_child) => {
            const size_name = size_child.name.toLowerCase()
            if (size_name.indexOf(searchText.toLowerCase()) !== -1) {
              sData.push(size_child)
            }
          })
        })
      }

      let bData = []
      if (options && options.brands && options.brands.length > 0) {
        options.brands.map((item) => {
          const brand = item.name.toLowerCase()
          if (brand.indexOf(searchText.toLowerCase()) !== -1) {
            bData.push(item)
          }
          item.children.map((brand_child) => {
            const brand_name = brand_child.name.toLowerCase()
            if (brand_name.indexOf(searchText.toLowerCase()) !== -1) {
              bData.push(brand_child)
            }
          })
        })
      }

      let catUrl = []
      for (var i = 0; i < catData.length; i++) {
        let newData = {
          ...catData[i],
          urlId: `items__category=${catData[i].id}`,
        }
        catUrl.push(newData)
      }

      let sizeUrl = []
      for (var i = 0; i < sData.length; i++) {
        let newData = {
          ...sData[i],
          urlId: `items__size=${sData[i].id}`,
        }
        sizeUrl.push(newData)
      }

      let brandUrl = []
      for (var i = 0; i < bData.length; i++) {
        let newData = {
          ...bData[i],
          urlId: `items__brand=${bData[i].id}`,
        }
        brandUrl.push(newData)
      }

      let combineAlldata = [...catUrl, ...sizeUrl, ...brandUrl]
      if (catData.length > 0 || bData.length > 0 || sData.length > 0) {
        searchData = combineAlldata
      }
    }

    searchContent = (
      <>
        <Animated.View
          style={{
            backgroundColor: '#f8f8f8',
          }}
        >
          {searchText.length == 0 ? (
            <Animated.FlatList
              onScroll={onScroll}
              contentContainerStyle={{
                paddingTop: containerPaddingTop,
              }}
              scrollIndicatorInsets={{
                top: scrollIndicatorInsetTop + stickyHeaderHeight,
              }}
              bounces={false}
              keyboardShouldPersistTaps='handled'
              showsVerticalScrollIndicator={false}
              data={historyData}
              renderItem={renderItem}
              ListEmptyComponent={() => (
                <ListEmptyComponent
                  placeholder='no history results'
                  placeholderStyle={styles().placeholderStyle}
                  spacing={10}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <FlatList
              style={styles().listStyle}
              keyboardShouldPersistTaps='handled'
              bounces={false}
              showsVerticalScrollIndicator={false}
              data={searchData}
              renderItem={renderResultItem}
              ListEmptyComponent={() => (
                <ListEmptyComponent
                  placeholder='no results'
                  placeholderStyle={styles().placeholderStyle}
                  spacing={10}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </Animated.View>
      </>
    )
  }

  return (
    <View style={styles().container}>
      {Platform.OS === 'ios' ? (
        <CustomStatusBar backgroundColor='#f8f8f8' />
      ) : (
        <StatusBar barStyle='default' backgroundColor='#f8f8f8' />
      )}

      <Animated.View style={{ flex: 1 }}>
        {isSearchFocused ? searchContent : content}
      </Animated.View>

      <CollapsibleSubHeaderAnimator translateY={translateY}>
        {header}
      </CollapsibleSubHeaderAnimator>
      <ItemDetailBottomSheet
        ref={itemDetailBottomSheetRef}
        onAddCart={onAddCart}
        item={item}
      />
    </View>
  )
}

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.base,
    },
    subContent: {
      flex: 1,
      flexDirection: 'row',
    },
    centerStyle: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    countText: {
      ...FontWeights.Bold,
      ...FontSizes.Label,
      color: theme.text01,
      textAlign: 'center',
    },
    typeText: {
      ...FontWeights.Regular,
      ...FontSizes.Caption,
      color: ThemeStatic.black,
      textAlign: 'center',
    },
    buttonStyle: {
      flex: 1,
      marginHorizontal: 5,
      height: 30,
      paddingVertical: 0,
    },
    navbarFilter: {
      color: ThemeStatic.accent,
      fontSize: 18,
      marginTop: 5,
    },
    navbarFilterText: {
      color: ThemeStatic.accent,
      ...FontSizes.Caption,
      fontSize: 15,
      margin: 3,
      alignSelf: 'center',
      marginRight: 10,
    },
    fitlerItemContainer: {
      flexDirection: 'row',
      backgroundColor: ThemeStatic.accentLight,
      marginHorizontal: 3,
      marginVertical: 9,
      paddingHorizontal: 0,
      borderRadius: 10,
    },
    fitlerItemContainerClose: {
      flexDirection: 'row',
      backgroundColor: ThemeStatic.secondaryLight,
      marginHorizontal: 3,
      marginVertical: 9,
      paddingHorizontal: 0,
      borderRadius: 10,
    },
    favoriteFilterContainer: {
      flexDirection: 'row',
      backgroundColor: ThemeStatic.accentLight,
      margin: 8,
      width: 98,
      borderRadius: 10,
    },
    listStyle: {},
    placeholderStyle: {
      ...FontSizes.Body,
    },
    clearFilterText: {
      color: ThemeStatic.black,
      ...FontSizes.Caption,
      fontSize: 12,
    },
  })

export default HomeScreen
