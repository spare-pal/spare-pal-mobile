import { Platform } from 'react-native'

const {
  author: { name, email, url },
  repository: { url: repository },
  version,
} = require('../../package.json')

const codepush = {
  staging: Platform.select({
    ios: '<private>',
    android: '<private>',
  }),
  production: Platform.select({
    ios: '<private>',
    android: '<private>',
  }),
}

const ENV_NAME = process.env.EXPO_PUBLIC_ENV || 'development'
const Config = {
  author: { name, email, url },
  repository,
  version,
  codepush,
  url: {
    https: 'https://',
    wss: 'wss://',
  },

  env: ENV_NAME,
  api_base_url:
    ENV_NAME == 'development'
      ? 'http://localhost:3000'
      : 'https://spare-pal.up.railway.app',
  base_url: 'https://spare-pal.up.railway.app',
  google_place_api_key: 'AIzaSyD-9tSrZJ1Q6J1Y1v1Q1v1Q1v1Q1v1Q1v1',
}

export default Config
