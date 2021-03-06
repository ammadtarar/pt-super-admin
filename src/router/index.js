import { createRouter, createWebHistory } from 'vue-router'
// import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Companies from '../views/Companies.vue';
import Jobs from '../views/Jobs.vue';
import Quizzes from '../views/Quizzes.vue';
import Articles from '../views/Articles.vue';
import Settings from '../views/Settings.vue';

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  // {
  //   path: '/home',
  //   name: 'home',
  //   component: Home,
  //   meta: {
  //     requiresAuth: true
  //   } 
  // },
  {
    path: '/companies',
    name: 'companies',
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
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
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
      if (localStorage.getItem('token') == null || localStorage.getItem('token') == undefined || localStorage.getItem('token') == '') {
          next({
              path: '/',
              params: { nextUrl: to.fullPath }
          });
      } else {
        next()
      }
  } else {
      next()
  }
})

export default router
