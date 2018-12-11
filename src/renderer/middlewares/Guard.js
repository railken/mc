import store from 'store2'

export default {
  auth: (to, from, next) => {
    next(store.get('user') ? true : {
      name: 'auth'
    })
  }
}
