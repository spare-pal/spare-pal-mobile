import * as actionType from '../actions/constants'

import { REHYDRATE } from 'redux-persist'

const initialState = {
  signup: {
    loading: false,
    success: false,
    error: false,
    message: '',
  },
  phoneVerification: {
    codeSent: false,
    codeVerified: false,
    message: '',
    sentSuccess: false,
    sentError: null,
    verifiedSuccess: false,
    verifiedError: null,
  },
  genderAndDOB: {
    success: false,
    error: false,
    message: '',
  },
  photoUpload: {
    success: false,
    error: false,
    message: '',
  },
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionType.USER_SIGNUP_BLANK: {
      return {
        ...state,
        signup: {
          success: false,
          error: false,
          message: '',
        },
      }
    }

    case actionType.USER_SIGNUP_LOADING: {
      let signup = { ...state.signup }
      signup.loading = action.payload.loading
      return { ...state, signup }
    }

    case actionType.USER_SIGNUP_SUCCESS: {
      let signup = {}
      signup.success = true
      signup.error = false
      signup.message = ''
      return { ...state, signup: { ...signup } }
    }

    case actionType.USER_SIGNUP_ERROR: {
      let msg = action.payload.error

      let signup = {}
      signup.success = false
      signup.error = true
      signup.message = msg
      return { ...state, signup: { ...signup } }
    }

    case actionType.PHONE_VERIFICATION_BLANK: {
      return {
        ...state,
        phoneVerification: {
          codeSent: false,
          codeVerified: false,
          message: '',
          sentSuccess: false,
          sentError: null,
          verifiedSuccess: false,
          verifiedError: null,
        },
      }
    }

    case actionType.SEND_VERIFICATION_CODE_SUCCESS: {
      const { phoneVerification } = state
      phoneVerification.codeSent = action.payload.data.success
      phoneVerification.sentSuccess = true
      phoneVerification.sentError = null
      phoneVerification.message = action.payload.data.message
      return { ...initialState, phoneVerification }
    }

    case actionType.SEND_VERIFICATION_CODE_ERROR: {
      const { phoneVerification } = state
      phoneVerification.codeSent = false
      phoneVerification.sentSuccess = false
      phoneVerification.sentError = action.payload.error
      phoneVerification.message = action.payload.error
      return { ...initialState, phoneVerification }
    }

    case actionType.VERIFY_VERIFICATION_CODE_SUCCESS: {
      let { phoneVerification } = state
      phoneVerification.codeVerified = action.payload.data.success
      phoneVerification.verifiedSuccess = true
      phoneVerification.verifiedError = null
      phoneVerification.message = action.payload.data.message
      return { ...initialState, phoneVerification }
    }

    case actionType.VERIFY_VERIFICATION_CODE_ERROR: {
      let { phoneVerification } = state
      phoneVerification.codeVerified = false
      phoneVerification.verifiedSuccess = false
      phoneVerification.verifiedError = action.payload.error
      phoneVerification.message = action.payload.error
      return { ...initialState, phoneVerification }
    }

    //

    default:
      return state
  }
}
