import axios from 'axios'
class NetworkHelper {
  static requestPost(url: string, params: any, token = null) {
    return NetworkHelper.requestHttp('POST', url, params, token)
  }

  static requestGet(url: string, token = null) {
    return NetworkHelper.requestHttp('GET', url, null, token)
  }

  static requestPut(url: string, params: any, token = null) {
    return NetworkHelper.requestHttp('PUT', url, params, token)
  }

  static requestPatch(url: string, params: any, token = null) {
    return NetworkHelper.requestHttp('PATCH', url, params, token)
  }

  static requestDelete(url: string, params: any, token = null) {
    return NetworkHelper.requestHttp('DELETE', url, params, token)
  }

  static requestHttp(
    method: string,
    url: string,
    params: any,
    token: string | null
  ) {
    console.log(method, url)
    return new Promise((resolve, reject) => {
      const options: any = {
        method,
        url,
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
      }
      if (params) {
        options['data'] = params
      }
      if (token) {
        options['headers']['Authorization'] = 'Bearer ' + token
      }

      axios(options)
        .then((response) => {
          resolve({ statusCode: response.status, body: response.data })
        })
        .catch((error) => {
          if (error.response !== undefined) {
            reject({
              statusCode: error.response.status,
              body: error.response.data,
            })
          } else {
            reject(new Error('Check Your Connection'))
          }
        })
    })
  }
}

export default NetworkHelper
