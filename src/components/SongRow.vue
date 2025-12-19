<script setup>
import { ref, toRefs, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import Heart from 'vue-material-design-icons/Heart.vue'
import HeartOutline from 'vue-material-design-icons/HeartOutline.vue'
import Play from 'vue-material-design-icons/Play.vue'
import Pause from 'vue-material-design-icons/Pause.vue'
import DotsHorizontal from 'vue-material-design-icons/DotsHorizontal.vue'
import TrashCan from 'vue-material-design-icons/TrashCan.vue'
import PlaylistPlus from 'vue-material-design-icons/PlaylistPlus.vue'

import { useSongStore } from '../stores/song'
import { storeToRefs } from 'pinia'
const useSong = useSongStore()
const { isPlaying, currentTrack } = storeToRefs(useSong)

const toggleLike = () => {
  useSong.toggleLike(track.value)
}

const emit = defineEmits(['addToPlaylist', 'removeFromPlaylist', 'showMenu', 'toggleLike'])
const showAddToPlaylist = () => {
  emit('addToPlaylist', track.value)
}

let isHover = ref(false)
let isTrackTime = ref(null)

const props = defineProps({
  track: Object,
  artist: Object,
  index: Number,
  showMenu: {
    type: Boolean,
    default: false,
  },
  showMenuButton: {
    type: Boolean,
    default: false,
  },
})

const { track, artist, index } = toRefs(props)

onMounted(() => {
  if (track.value.duration) {
      const minutes = Math.floor(track.value.duration / 60000);
      const seconds = ((track.value.duration % 60000) / 1000).toFixed(0);
      isTrackTime.value = minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  } else if (track.value.song && !track.value.song.startsWith('http')) {
      const audio = new Audio('/' + track.value.song)
      audio.addEventListener('loadedmetadata', function () {
        const duration = audio.duration
        const minutes = Math.floor(duration / 60)
        const seconds = Math.floor(duration % 60)
        isTrackTime.value = minutes + ':' + seconds.toString().padStart(2, '0')
      })
  } else {
      isTrackTime.value = "0:30"
  }
})

const toggleMenu = () => {
  emit('showMenu')
}

const playThis = () => {
    const artistObj = artist.value || { 
        name: track.value.artistName, 
        artistName: track.value.artistName, 
        albumCover: track.value.albumCover 
    }
    useSong.playOrPauseThisSong(artistObj, track.value)
}
</script>

<template>
  <li class="flex items-center justify-between rounded-md hover:bg-[#2A2929] group px-2 py-1">
    <div
      class="flex items-center w-full cursor-pointer"
      @click="playThis"
    >
      <div class="flex items-center justify-center w-[40px]">
        <span
          v-if="!isPlaying || currentTrack?.id !== track.id"
          class="group-hover:hidden text-white font-semibold"
        >
          {{ index }}
        </span>
        <Play
          v-if="!isPlaying || currentTrack?.id !== track.id"
          fillColor="#FFFFFF"
          :size="25"
          class="hidden group-hover:block"
        />
        <Pause v-else fillColor="#1DB954" :size="25" />
      </div>
      
      <img v-if="track.albumCover" :src="track.albumCover" class="w-10 h-10 rounded-sm mr-3 ml-2">

      <div class="flex-1 ml-3">
        <div
          class="text-white font-semibold truncate"
          :class="{ 'text-green-500': currentTrack?.id === track.id }"
        >
          {{ track.name }}
        </div>
        <!-- Artist Name Link -->
        <RouterLink 
            :to="{ path: '/search', query: { q: artist.artistName || track.artistName } }"
            class="text-sm font-semibold text-gray-400 truncate hover:underline hover:text-white"
            @click.stop
        >
            {{ artist.artistName || track.artistName }}
        </RouterLink>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <button
        @click.stop="toggleLike"
        class="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Heart v-if="useSong.isLiked(track.id)" fillColor="#1BD760" :size="22" />
        <HeartOutline v-else fillColor="#FFFFFF" :size="22" />
      </button>

      <div class="relative">
        <button
          @click.stop="showAddToPlaylist"
          class="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[#3E3D3D] rounded-full"
        >
          <DotsHorizontal fillColor="#b3b3b3" :size="20" />
        </button>
      </div>

      <div class="text-gray-400 text-xs mx-5 w-[40px] text-center">
        {{ isTrackTime }}
      </div>
    </div>
  </li>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
