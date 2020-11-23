import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Browse from '../views/Browse.vue'
import Deck from '../views/Deck.vue'
import Study from '../views/Study.vue'
import Main from '../views/Main.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main,
    children: [
      {
        path: 'study',
        component: Study
      },
      {
        path: 'browse',
        component: Browse
      },
      {
        path:':id',
        component: Deck
      },
    ]
  },
]

const router = new VueRouter({
  routes,
  mode: 'history',
})

export default router
