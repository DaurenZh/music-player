import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SearchView from '../views/SearchView.vue'
import LibraryView from '../views/LibraryView.vue'
import LikedSongsView from '../views/LikedSongsView.vue'
import PlaylistView from '../views/PlaylistView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView
    },
    {
      path: '/search',
      component: SearchView
    },
    {
      path: '/library',
      component: LibraryView
    },
    {
      path: '/liked',
      component: LikedSongsView
    },
    {
      path: '/playlist/:id',
      component: PlaylistView
    }
  ]
})

export default router