import { createRouter, createWebHistory } from 'vue-router'
const AppLayout = () =>  import('@/components/AppLayout.vue')
const Home = () =>  import( '@/views/home/Index.vue')
const Login = () => import('@/views/login/index.vue')
const Programmes = () => import('@/views/programmes/Index.vue')
const Teams = () => import('@/views/teams/Index.vue')
const Areas = () => import('@/views/areas/Index.vue')
const About = () => import('@/views/about/Index.vue')
const Setting = () => import('@/views/setting/Index.vue')
const Inquiries = () => import('@/views/inquiries/Index.vue')
const Clients = () => import('@/views/client/Index.vue')
const Sliders = () => import('@/views/slider/Index.vue')
const Notices = () => import('@/views/notices/Index.vue')
const Galleries = () => import('@/views/galleries/Index.vue')
const Users = () => import('@/views/users/Index.vue')

const routes = [
  {
    children: [
      {
        component: Home,
        name: 'home',
        path: '/home',
        meta: {
          requiresAuth: true,
          redirectOnExpire: true
        }
      },
      {
        component: Home,
        name: 'home',
        path: '/',
        meta: {
          requiresAuth: true,
          redirectOnExpire: true
        }
      },
      {
        component: Users,
        name: 'users',
        path: '/users',
        meta: {
          requiresAuth: true,
          requiresAdmin: true,
          redirectOnExpire: true
        }
      },
      {
        component: Programmes,
        name: 'programmes',
        path: '/programmes',
        meta: {
          requiresAuth: true,
          redirectOnExpire: true
        }
      },
      {
        component: Teams,
        name: 'teams',
        path: '/teams',
        meta: {
          requiresAuth: true,
          redirectOnExpire: true
        }
      },
      {
        component: About,
        name: 'about',
        path: '/about',
        meta: {
          requiresAuth: true,
          redirectOnExpire: true
        }
      },
      {
        component: Setting,
        name: 'setting',
        path: '/setting',
        meta: {
          requiresAuth: true,
          redirectOnExpire: true
        }
      },
      {
        component: Areas,
        name: 'areas',
        path: '/areas',
        meta: {
          requiresAuth: true,
          redirectOnExpire: true
        }
      },
      {
        component: Inquiries,
        name: 'inquiries',
        path: '/inquiries',
        meta: {
          requiresAuth: true,
          redirectOnExpire: true
        }
      },
      {
        component: Sliders,
        name: 'sliders',
        path: '/sliders',
        meta: {
          requiresAuth: true,
          redirectOnExpire: true
        }
      },
      {
        component: Clients,
        name: 'clients',
        path: '/clients',
        meta: {
          requiresAuth: true,
          redirectOnExpire: true
        }
      },
      {
        component: Notices,
        name: 'notices',
        path: '/notices',
        meta: {
          requiresAuth: true,
          redirectOnExpire: true
        }
      },
      {
        component: Galleries,
        name: 'galleries',
        path: '/galleries',
        meta: {
          requiresAuth: true,
          redirectOnExpire: true
        }
      },
    ],
    component: AppLayout,
    path: '/'
  },
  {
    component: Login,
    name: 'login',
    path: '/login'
  },
]

const router = createRouter({
  history: createWebHistory(''),
  routes: routes
})

export default router