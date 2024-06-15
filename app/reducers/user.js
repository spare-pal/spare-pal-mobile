import * as actionType from '../actions/constants'

const initialState = {
  loadingUserLogin: false,
  profile: null,
  success: false,
  error: null,
  loading: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionType.USER_LOGIN_LOADING: {
      return {
        ...state,
        loadingUserLogin: action.payload.loading,
      }
    }

    case actionType.USER_LOGIN_SUCCESS:
      return {
        ...initialState,
        success: true,
        profile: action.payload.data,
        loadingUserLogin: false,
        loadingUserLoginSocial: false,
        error: null,
      }

    case actionType.USER_RGISTER_SUCCESS:
      return {
        ...initialState,
        success: true,
        loadingUserLogin: false,
        error: null,
      }
    case actionType.USER_RGISTER_ERROR:
      return {
        ...initialState,
        success: false,
        loadingUserLogin: false,
        errorRegister: action.payload.error,
      }
    case actionType.USER_LOGOUT:
      return {
        ...initialState,
        success: false,
        profile: null,
        loadingUserLogin: false,
      }

    case actionType.USER_LOGIN_ERROR:
      return {
        ...initialState,
        errorLogin: action.payload.error,
        success: false,
        loadingUserLogin: false,
        loadingUserLoginSocial: false,
      }

    case actionType.USER_UPDATE_SUCCESS: {
      const { profile } = state
      const updatedProfile = Object.assign({}, profile, action.payload.data)
      return { ...initialState, success: true, profile: updatedProfile }
    }

    case actionType.GET_PROFILE_SUCCESS: {
      return {
        ...state,
        profile: action.payload.data,
        error: null,
        success: true,
      }
    }
    case actionType.GET_PROFILE_ERROR: {
      return {
        ...state,
        error: action.payload.error,
        success: false,
      }
    }
    case actionType.USER_LOGIN_CLEAR: {
      return { ...state, success: false, error: null }
    }

    default:
      return state
  }
}
