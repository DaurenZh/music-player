import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/search',
      name: 'search',
      // Lazy loading
      component: () => import('../views/SearchView.vue')
    },
    {
      path: '/library',
      name: 'library',
      component: () => import('../views/LibraryView.vue')
    },
    {
      path: '/liked',
      name: 'liked',
      component: () => import('../views/LikedSongsView.vue')
    },
    {
      path: '/playlist/:id',
      name: 'playlist',
      component: () => import('../views/PlaylistView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue')
    },
    // 404 Route
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  // Example: Log navigation or check auth
  console.log(`Navigating to: ${to.name}`)
  next()
})

export default router