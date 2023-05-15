import { inject } from 'vue'
import Authenticator from './authenticator'
import routerGuard from './routerAuthGuard'
import { http as axios} from '@/axios.js'

const injectionKey = Symbol('auth')
const responseInterceptor = (axios, auth, router) => {
   axios.interceptors.response.use(response => {
    return response
  }, error => {
    if (
      error.response &&
      error.response.status === 401 &&
      !error.config.__isRetryRequest
    ) {
      return new Promise((resolve, reject) => {
        auth.refreshToken()
          .then(() => {
            error.config.__isRetryRequest = true
            delete error.config.headers.Authorization

            resolve(axios(error.config))
          })
          .catch(error => {
            router.push({name: 'login'})
            reject(error)
          })
      })
    }

    return Promise.reject(error)
  })
}
export const useAuth = () => inject(injectionKey)
export const auth = {
  install(app, options) {
    const { router } = options
    const auth = new Authenticator(axios)
    axios.defaults.headers.common.Authorization = 'Bearer ' + auth.accessToken

    app.provide(injectionKey, auth)
    app.config.globalProperties.$auth = auth
    responseInterceptor(axios, auth, router)
    routerGuard(router, auth)
  }
}