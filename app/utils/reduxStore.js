import { applyMiddleware, createStore, compose } from 'redux'
import ReduxThunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Storage from 'react-native-storage'
const storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: 7 * 1000 * 3600 * 24,
  enableCache: true,
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const logger = createLogger({ collapsed: true })
const middleware = applyMiddleware(ReduxThunk)

const enhancer = composeEnhancers(middleware)

import { persistStore, persistReducer } from 'redux-persist'

import rootReducer from '@app/reducers'
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
}
const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = createStore(persistedReducer, enhancer)
const persistor = persistStore(store)
const getPersistor = () => persistor
const getStore = () => store
const getState = () => {
  return store.getState()
}

export const StorageErrorTypes = {
  Expired: 'ExpiredError',
  NotFound: 'NotFoundError',
}

export const saveToken = async (token) => {
  try {
    return storage.save({
      key: 'sparepal:token',
      data: token,
    })
  } catch (error) {
    console.log(error)
  }
}

export const loadToken = async () => {
  try {
    return storage.load({
      key: 'sparepal:token',
    })
  } catch (error) {
    console.log(error)
  }
}

export const removeToken = async () => {
  try {
    await storage.remove({
      key: 'sparepal:token',
    })
  } catch (error) {
    console.log(error)
  }
}

export const saveThemeType = (themeType) => {
  return storage.save({
    key: 'sparepal:theme',
    data: themeType,
    expires: null,
  })
}

export const loadThemeType = () => {
  return storage.load({
    key: 'sparepal:theme',
  })
}

export { getStore, getState, getPersistor }
export default {
  getStore,
  getState,
  getPersistor,
}
