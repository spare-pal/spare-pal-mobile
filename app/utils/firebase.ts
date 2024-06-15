import { generateUUID } from './shared'
import { Asset, StoragePaths, Errors } from '@app/constants'
import { Platform } from 'react-native'

export const initializeFCM = async () => {}

export const uploadToStorage = (
  asset: string,
  uri: string,
  userId: string
) => {}

export const getMediaType = (uri: string) => uri.split('.').slice(-1)

export const deleteFromStorage = (uri: string) => null
