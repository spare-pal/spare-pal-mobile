import AsyncStorage from '@react-native-async-storage/async-storage'

const StorageKeys = {
  UserInfo: 'UserInfo',
}

const saveItem = (key: string, value: string) => {
  try {
    AsyncStorage.setItem(key, value).then()
    return true
  } catch (error) {
    return false
  }
}

const removeItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key)
    return true
  } catch (exception) {
    return false
  }
}

const getItem = async (key: string) => {
  try {
    await AsyncStorage.getItem(key)
    return true
  } catch (exception) {
    return false
  }
}

export default {
  removeItem,
  StorageKeys,
  getItem,
  saveItem,
}
