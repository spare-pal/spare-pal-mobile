import React from 'react'
import _ from 'lodash'
import axios from 'axios'
import { getState } from '../reduxStore'
import {
  BLANK_TEXT_ERROR_MESSAGE,
  INVALID_DATE_ERROR_MESSAGE,
  INVALID_EMAIL_ADDRESS_ERROR_MESSAGE,
  INVALID_PASSWORD_ERROR_MESSAGE,
  INVALID_PHONE_NUMBER_ERROR_MESSAGE,
} from './constants'

const getUser = () => {
  return getState().account.user.profile
}

export function setAuthHeader() {
  deleteAuthHeader()
  let user = getUser()

  if (!_.isEmpty(user) && user.token) {
    axios.defaults.headers.common['Authorization'] = `Token ${user.token}`
  }
}

export function deleteAuthHeader() {
  axios.defaults.headers.common['Authorization'] = ''
  delete axios.defaults.headers.common['Authorization']
}

export function isAuthenticated() {
  let user = getUser()

  if (!_.isEmpty(user) && user.token) {
    setAuthHeader()
    return true
  }

  return false
}

/*
this function converts an object or array into a string separated by dot (.)
if data passed is string, it will be returned as it is
*/
export const convertToString = (data) => {
  if (typeof data === 'object' && typeof data != null) {
    if (Array.isArray(data)) {
      let message = ''
      data.map((error) => {
        message += `${convertToString(error)}. `
      })

      return message
    } else {
      let message = ''
      for (let key in data) {
        message += `${key}: ${convertToString(data[key])}. `
      }

      return message
    }
  } else {
    return data
  }
}

export const handleChange = (obj, name, value, fieldtype) => {
  const state = obj.state
  state['form_error'] = false

  if (state.hasOwnProperty('errors')) {
    delete state['errors'][name]
  }

  if (fieldtype === 'text' || fieldtype === 'radio' || fieldtype === 'select') {
    if (value === '') {
      state['form_error'] = true
      state['errors'][name] = BLANK_TEXT_ERROR_MESSAGE
    }
  }

  if (fieldtype === 'email') {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (value === '') {
      state['form_error'] = true
      state['errors'][name] = BLANK_TEXT_ERROR_MESSAGE
    } else if (!emailRegex.test(value)) {
      state['form_error'] = true
      state['errors'][name] = INVALID_EMAIL_ADDRESS_ERROR_MESSAGE
    }
  }

  if (fieldtype === 'password') {
    if (value === '') {
      state['form_error'] = true
      state['errors'][name] = BLANK_TEXT_ERROR_MESSAGE
    } else if (
      !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{8,}$/.test(value)
    ) {
      state['form_error'] = true
      state['errors'][name] = INVALID_PASSWORD_ERROR_MESSAGE
    }
  }

  if (fieldtype === 'phone') {
    if (value === '') {
      state['form_error'] = true
      state['errors'][name] = BLANK_TEXT_ERROR_MESSAGE
    } else if (!/^\d{8,12}$/.test(value)) {
      state['form_error'] = true
      state['errors'][name] = INVALID_PHONE_NUMBER_ERROR_MESSAGE
    }
  }

  if (fieldtype === 'date') {
    if (value === '') {
      state['form_error'] = true
      state['errors'][name] = BLANK_TEXT_ERROR_MESSAGE
    } else if (
      !/^((19|20)?[0-9]{2}[- /.](0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01]))*$/.test(
        value
      )
    ) {
      state['form_error'] = true
      state['errors'][name] = INVALID_DATE_ERROR_MESSAGE
    }
  }

  state[name] = value
  obj.setState(state)
}

String.prototype.initCap = function () {
  return this.toLowerCase().replace(/(?:^|\s)[a-z]/g, function (m) {
    return m.toUpperCase()
  })
}
