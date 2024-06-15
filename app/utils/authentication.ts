import { StorageErrorTypes, removeToken } from './reduxStore'


export const handleLoginError = async (errorType: string) => {
  switch (errorType) {
    case StorageErrorTypes.Expired:
      await signOut()
      break

    case StorageErrorTypes.NotFound:
      break

    default:
      break
  }
}

export const signOut = async () => {
  try {
    await removeToken()
  } catch (e) {
    console.log('signOut error', e)
  }
}
