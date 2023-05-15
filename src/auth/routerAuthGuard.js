export default function (router, auth) {
  router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!auth.isLoggedIn) {
      next({
        name: 'login',
        query: { redirect: to.name }
      })
    } else if (to.matched.some(record => record.meta.requiresAdmin)) {
      if (!auth.isAdmin) {
        next({
          name: 'home'
        })
      } else {
        next()
      }
    }
    else {
      if (auth.isTokenExpired()) {
        auth.refreshToken()
          .then(() => {
            next()
          })
          .catch(() => {
            if (to.matched.some(record => record.meta.redirectOnExpire)) {
              next({
                name: 'login',
                query: {redirect: to.name}
              })
            } else {
              next()
            }
          })
      } else {
        next()
      }
    }
  } else {
    next() // make sure to always call next()!
  }
})
}