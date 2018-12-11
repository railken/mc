import Vue from 'vue'
import Router from 'vue-router'
import Guard from '@/middlewares/Guard'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      beforeEnter: Guard.auth,
      component: require('@/components/Main').default
    },
    {
      path: '/settings',
      name: 'settings',
      beforeEnter: Guard.auth,
      component: require('@/components/Settings').default
    },
    {
      path: '/auth',
      name: 'auth',
      component: require('@/components/Auth').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
