import { combineReducers } from 'redux'
import cartReducer from './cart'
import commonReducer from './common'
import shopReducer from './shop'
import userReducer from './user'
import productReducer from './product'

const appReducer = combineReducers({
  common: commonReducer,
  user: userReducer,
  cart: cartReducer,
  shop: shopReducer,
  product: productReducer,
})

const rootReducer = (state, action) => {
  return appReducer(state, action)
}

export default rootReducer
export type RootState = ReturnType<typeof appReducer>
