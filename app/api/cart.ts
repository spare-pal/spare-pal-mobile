import WebService from '../helpers/WebService'

export const placeOrder = (obj: any) => {
  return new Promise((resolve, reject) => {
    WebService.placeOrder(obj)
      .then((response) => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          resolve(response.body)
        } else {
          reject(new Error(response.body))
        }
      })
      .catch(reject)
  })
}
