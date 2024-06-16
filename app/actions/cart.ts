import * as Services from '../api/index'
import { handleServerError, handleServerSuccess } from './common'
import * as actionType from './constants'

export const addToCart = (item: any) => {
  return (dispatch) => {
    dispatch({
      type: actionType.ADD_CART_ITEM,
      payload: {
        item,
      },
    })
  }
}

export const removeItem = (item: any) => {
  return (dispatch) => {
    dispatch({
      type: actionType.REMOVE_CART_ITEM,
      payload: {
        item,
      },
    })
  }
}

export const clearItem = (item: any) => {
  return (dispatch) => {
    dispatch({
      type: actionType.CLEAR_CART_ITEM,
      payload: {
        item,
      },
    })
  }
}

export const placeOrder = (payload: any) => {
  return (dispatch) => {
    dispatch({
      type: actionType.PLACE_ORDER_LOADING,
      payload: {
        loading: true,
      },
    })
    const { order } = payload
    Services.placeOrder(order)
      .then((response) => {
        if (payload.onSuccess) {
          payload.onSuccess()
        }
        handleServerSuccess(
          actionType.PLACE_ORDER_SUCCESS,
          actionType.PLACE_ORDER_LOADING,
          response,
          dispatch
        )
      })
      .catch((err) => {
        dispatch({
          type: actionType.PLACE_ORDER_LOADING,
          payload: { loading: false },
        })
        if (payload.onFail) {
          payload.onFail()
        }
        handleServerError(
          actionType.PLACE_ORDER_ERROR,
          actionType.PLACE_ORDER_LOADING,
          err,
          dispatch
        )
      })
  }
}
