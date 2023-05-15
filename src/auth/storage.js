import jwt_decode from 'jwt-decode'

const localStorageNamespace = 'eBookkepper__'

export default {
  clear: function () {
    if (localStorage.length === 0) {
      return 0
    }

    const removedKeys = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      const regexp = new RegExp(`^${localStorageNamespace}.+`, 'i')

      if (regexp.test(key) === false) {
        continue
      }

      removedKeys.push(key)
    }

    for (const key in removedKeys) {
      localStorage.removeItem(removedKeys[key])
    }
  },

  get (name, defaultValue = null) {
    const item = localStorage.getItem(localStorageNamespace + name)

    if (item !== null) {
      try {
        const data = JSON.parse(item)

        if (data.expire === null) {
          return data.value
        }

        if (data.expire >= new Date().getTime()) {
          return data.value
        }
      } catch (err) {
        return defaultValue
      }
    }

    return defaultValue
  },

  /**
   * Set item
   *
   * @param {string} name
   * @param {*} value
   * @param {number} expire - milliseconds
   */
  set (name, value, expire = null) {
    const stringifyValue = JSON.stringify({
      expire: expire !== null ? new Date().getTime() + expire : null,
      value
    })

    localStorage.setItem(localStorageNamespace + name, stringifyValue)
  },

  /**
   * Set item
   *
   * @param {string} accessToken
   * @param {string} refreshToken
   * @param {number} expiresIn - seconds
   */
  storeTokenDetails (accessToken, refreshToken) {
    const transmissionLagDuration = 500 // in milliseconds
    const expiresIn = jwt_decode(accessToken)['exp'] * 1000
    this.set('access_token_expire', expiresIn - transmissionLagDuration)
    this.set('access_token', accessToken)

    if (refreshToken) {
      this.set('refresh_token', refreshToken)
      this.set('is_refresh_expired', false)
    }
  }
}
