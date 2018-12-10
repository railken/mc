export default {
  auth (to, from, next) {
    console.log(window.user)
    next(window.user ? true : {
      name: 'auth'
    })
  }
}
