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
