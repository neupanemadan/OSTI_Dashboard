import storage from './storage'
import {http} from '@/axios.js'

class Authenticator {
  constructor() {
    this.axios = http
  }

  get isLoggedIn () {
    return !!storage.get('access_token')
  }

  get isAdmin() {
    const user = this.currentUser()

    if (!user) {
      return false
    }

    return user.role === 'ROLE_ADMIN'
  }

  get accessToken() {
    return  storage.get('access_token')
  }

  currentUser () {
    return storage.get('user')
  }

  login (credentials) {
    return new Promise((resolve, reject) => {
      return this.axios.post("/auth/login", credentials)
        .then(({ data }) => {
          this.axios.defaults.headers.common.Authorization = 'Bearer ' + data.access_token
          storage.storeTokenDetails(data.access_token, data.refresh_token)
          this.axios.get("/users/me")
            .then(({ data }) => {
              console.log(data)
              storage.set('user', data.user)
                resolve()
            })
          .catch((error) => reject(error))
      }).catch((error) => reject(error))
    })
  }

  logout () {
    return new Promise((resolve, reject) => {
      Promise.all([this._revokeAccessToken(), this._revokeRefreshToken()])
        .then(() => {
          storage.clear()
          delete this.axios.defaults.headers.common.Authorization
          resolve()
        })
        .catch((error) => {
          storage.clear()
          delete this.axios.defaults.headers.common.Authorization
          reject(error)
        })
    })
  }

  isLoggedIn () {
    return !!storage.get('access_token')
  }

  isRefreshExpired () {

  }

  isTokenExpired() {
    return storage.get('access_token_expire') <= new Date().getTime()
  }

  refreshToken () {
    return new Promise((resolve, reject) => {
      this.axios.defaults.headers.common.Authorization = ''

      const refreshAxiosInstance = this.axios.create({
      })
      const options = {
        headers: {
          Authorization: `Bearer ${storage.get('refresh_token')}`
        }
      }

      refreshAxiosInstance.post('/auth/refresh_token', {}, options)
        .then(response => {
          storage.storeTokenDetails(response.data.access_token)

          this.axios.defaults.headers.common.Authorization = 'Bearer ' + storage.get('access_token')
          resolve()
        }, error => {
          storage.clear()
          storage.set('is_refresh_expired', true)
          reject(error)
        })
    })
  }

  _revokeAccessToken () {
    return new Promise((resolve, reject) => {
      this.axios.delete('/auth/access/revoke')
        .then(() => resolve())
        .catch((error) => reject(error))
    })
  }

  _revokeRefreshToken () {
    return new Promise((resolve, reject) => {
      this.axios.defaults.headers.common.Authorization = ''
      const refreshAxiosInstance = this.axios.create({
      })

      const options = {
        headers: {
          Authorization: `Bearer ${storage.get('refresh_token')}`
        }
      }

      refreshAxiosInstance.delete('/auth/refresh/revoke', options)
        .then(() => resolve())
        .catch((error) => reject(error))
    })
  }
}

export default Authenticator