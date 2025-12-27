import Home from '@/views/home/Home.vue'
import NotFound from '@/views/auth/NotFound.vue'
import Login from '@/views/auth/Login.vue'
import Signup from '@/views/auth/Signup.vue'
import AccessDenied from '@/views/auth/AccessDenied.vue'
import SongUpsert from '@/views/song/SongRequest.vue'
import SongList from '@/views/song/SongList.vue'
import { APP_ROUTES_NAMES } from '@/constants/routesNames.js'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: APP_ROUTES_NAMES.HOME,
      component: Home,
    },
    {
      path: '/login',
      name: APP_ROUTES_NAMES.LOGIN,
      component: Login,
    },
    {
      path: '/sign-up',
      name: APP_ROUTES_NAMES.SIGN_UP,
      component: Signup,
    },
    {
      path: '/request-song',
      name: APP_ROUTES_NAMES.SONG_CREATE,
      component: SongUpsert,
      beforeEnter: [isAuthenticated]
    },
    {
      path: '/songs',
      name: APP_ROUTES_NAMES.SONG_LIST,
      component: SongList,
      beforeEnter: [isAuthenticated]
    },
    {
      path: '/not-found',
      name: APP_ROUTES_NAMES.ACCESS_DENIED,
      component: AccessDenied,
    },
    {
      path: '/:pathMatch(.*)*',
      name: APP_ROUTES_NAMES.NOT_FOUND,
      component: NotFound,
    },
  ],
  linkActiveClass: "active",
})

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()
  if(!authStore.initialized) {
    await authStore.initializeAuth()
  }
})

function isAuthenticated() {
  const authStore = useAuthStore()
  if(authStore.isAuthenticated) {
    return true
  } else {
    return { name: APP_ROUTES_NAMES.LOGIN }
  }

}

export default router
