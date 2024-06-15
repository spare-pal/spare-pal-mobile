import * as actionType from './../actions/constants'

const initialState = {
  loadingData: false,
  success: false,
  error: null,
  products: [],
  productsPayload: {},
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionType.GET_PRODUCT_LIST_LOADING: {
      return { ...state, loadingData: true }
    }
    case actionType.GET_PRODUCT_LIST_SUCCESS: {
      return {
        ...state,
        productsPayload: action.payload.data.payload,
        products:
          action.payload.data.payload.prev === null
            ? action.payload.data.data
            : [...state.products, ...action.payload.data.data],
        error: null,
        loadingData: false,
        success: true,
      }
    }
    case actionType.GET_PRODUCT_LIST_ERROR: {
      return {
        ...state,
        success: false,
        errorList: action.payload.error,
        loadingData: false,
      }
    }
    case actionType.USER_LOGOUT:
      return initialState
    default:
      return state
  }
}
