import Vue from 'vue'
import Router from 'vue-router'
import Topics from '@/components/topics'
import Create from '@/components/create'
import Messages from '@/components/messages'
import Userinfo from '@/components/userinfo'
import Detail from '@/components/detail'
import About from '@/components/about'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Topics',
      component: Topics
    },
    {
      path: '/create',
      name: 'Create',
      component: Create
    },
    {
      path: '/messages',
      name: 'Messages',
      component: Messages
    },
    {
      path: '/userinfo',
      name: 'Userinfo',
      component: Userinfo
    },
    {
      path: '/detail',
      name: 'Detail',
      component: Detail
    },
    {
      path: '/about',
      name: 'About',
      component: About
    }
  ]
})
