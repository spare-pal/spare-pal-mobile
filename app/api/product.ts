import WebService from '../helpers/WebService'

export const getProducts = (next: number | undefined) => {
  return new Promise((resolve, reject) => {
    WebService.getProducts(next)
      .then((response) => {
        if (response.statusCode === 200) {
          resolve(response.body)
        } else {
          reject(new Error(response.body))
        }
      })
      .catch(reject)
  })
}
