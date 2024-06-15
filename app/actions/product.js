import * as Services from '../api/index'
import { handleServerError, handleServerSuccess } from './common'
import * as actionType from './constants'

export const getProducts = (payload = {}) => {
  return (dispatch) => {
    dispatch({
      type: actionType.GET_PRODUCT_LIST_LOADING,
      payload: {
        loading: true,
      },
    })
    Services.getProducts(payload.next)
      .then((response) => {
        if (payload.onSuccess) {
          payload.onSuccess()
        }
        handleServerSuccess(
          actionType.GET_PRODUCT_LIST_SUCCESS,
          actionType.GET_PRODUCT_LIST_LOADING,
          response,
          dispatch
        )
      })
      .catch((err) => {
        dispatch({
          type: actionType.GET_PRODUCT_LIST_LOADING,
          payload: { loading: false },
        })
        if (payload.onFail) {
          payload.onFail()
        }
        handleServerError(
          actionType.GET_PRODUCT_LIST_ERROR,
          actionType.GET_ROOM_LIST_LOADING,
          err,
          dispatch
        )
      })
  }
}
