import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Companies from '../views/Companies.vue';
import Jobs from '../views/Jobs.vue';
import Quizzes from '../views/Quizzes.vue';
import Articles from '../views/Articles.vue';

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: true
    } 
  },
  {
    path: '/companies',
    name: 'companoes',
    component: Companies,
    meta: {
      requiresAuth: true
    } 
  },
  {
    path: '/jobs',
    name: 'jobs',
    component: Jobs,
    meta: {
      requiresAuth: true
    } 
  },
  {
    path: '/quizzes',
    name: 'quizzes',
    component: Quizzes,
    meta: {
      requiresAuth: true
    } 
  },
  {
    path: '/articles',
    name: 'articles',
    component: Articles,
    meta: {
      requiresAuth: true
    } 
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});


router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    next()
      // if (localStorage.getItem('token') == null) {
      //     next({
      //         path: '/',
      //         params: { nextUrl: to.fullPath }
      //     })
      // } else {
      //   next()
      // }
  } else {
      next()
  }
})

export default router
