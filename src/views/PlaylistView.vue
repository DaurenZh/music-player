<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SongRow from '../components/SongRow.vue'
import AddToPlaylistModal from '../components/AddToPlaylistModal.vue'
import SelectSongsModal from '../components/SelectSongsModal.vue'
import EditPlaylistModal from '../components/EditPlaylistModal.vue'
import Play from 'vue-material-design-icons/Play.vue'
import Pause from 'vue-material-design-icons/Pause.vue'
import Heart from 'vue-material-design-icons/Heart.vue'
import HeartOutline from 'vue-material-design-icons/HeartOutline.vue'
import DotsHorizontal from 'vue-material-design-icons/DotsHorizontal.vue'
import ClockTimeThreeOutline from 'vue-material-design-icons/ClockTimeThreeOutline.vue'
import Plus from 'vue-material-design-icons/Plus.vue'
import TrashCan from 'vue-material-design-icons/TrashCan.vue'
import Pencil from 'vue-material-design-icons/Pencil.vue'
import Magnify from 'vue-material-design-icons/Magnify.vue'
import PlaylistPlus from 'vue-material-design-icons/PlaylistPlus.vue'
import artist from '../artist.json'

import { useSongStore } from '../stores/song'
import { storeToRefs } from 'pinia'
const useSong = useSongStore()
const { isPlaying, currentTrack, currentArtist, playlists } = storeToRefs(useSong)

const route = useRoute()
const router = useRouter()
const playlistId = parseInt(route.params.id)

const playlist = computed(() => {
  return playlists.value.find((p) => p.id === playlistId)
})

const playlistTracks = computed(() => {
  if (!playlist.value) return []
  return artist.tracks.filter((track) => playlist.value.tracks.includes(track.id))
})

const playFunc = () => {
  if (currentTrack.value) {
    useSong.playOrPauseThisSong(currentArtist.value, currentTrack.value)
    return
  }
  if (playlistTracks.value.length > 0) {
    useSong.loadSong(artist, playlistTracks.value[0])
  }
}

const addToPlaylistModal = ref(null)
const selectSongsModal = ref(null)
const editPlaylistModal = ref(null)
const showDropdown = ref(false)
const searchQuery = ref('')
const showSearchResults = ref(false)
const activeTrackMenu = ref(null)

const filteredSongs = computed(() => {
  if (!searchQuery.value.trim()) return []

  const query = searchQuery.value.toLowerCase()
  return artist.tracks.filter((track) => {
    const isInPlaylist = playlist.value?.tracks.includes(track.id)
    const matchesSearch = track.name.toLowerCase().includes(query)
    return !isInPlaylist && matchesSearch
  })
})

const handleAddToPlaylist = (track) => {
  addToPlaylistModal.value?.openModal(track)
}

const openSelectSongs = () => {
  selectSongsModal.value?.openModal(playlistId)
}

const deletePlaylist = () => {
  if (confirm('Are you sure you want to delete this playlist?')) {
    useSong.deletePlaylist(playlistId)
    router.push('/library')
  }
  showDropdown.value = false
}

const openEditModal = () => {
  editPlaylistModal.value?.openModal(playlist.value)
  showDropdown.value = false
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const addSongToPlaylist = (track) => {
  useSong.addTrackToPlaylist(playlistId, track.id)
  searchQuery.value = ''
  showSearchResults.value = false
}

const handleSearchFocus = () => {
  if (searchQuery.value.trim()) {
    showSearchResults.value = true
  }
}

const handleSearchBlur = () => {
  setTimeout(() => {
    showSearchResults.value = false
  }, 200)
}

const toggleTrackMenu = (trackId) => {
  if (activeTrackMenu.value === trackId) {
    activeTrackMenu.value = null
  } else {
    activeTrackMenu.value = trackId
  }
}

const removeFromPlaylist = (trackId) => {
  useSong.removeTrackFromPlaylist(playlistId, trackId)
  activeTrackMenu.value = null
}

const addToAnotherPlaylist = (track) => {
  addToPlaylistModal.value?.openModal(track)
  activeTrackMenu.value = null
}

const toggleLikeTrack = (trackId) => {
  useSong.toggleLike(trackId)
  activeTrackMenu.value = null
}

const playTrack = (track) => {
  useSong.loadSong(artist, track)
}
</script>

<template>
  <div v-if="playlist" class="p-8 overflow-x-hidden">
    <div class="flex items-center w-full relative h-full">
      <div class="w-32 h-32 rounded-md flex items-center justify-center">
        <img
          v-if="playlist.image"
          :src="playlist.image"
          alt="Playlist"
          class="w-full h-full object-cover rounded-md"
        />
        <img v-else src="/images/icons/new-playlist.png" alt="Playlist" />
      </div>

      <div class="w-full ml-5">
        <div
          style="font-size: 33px"
          class="text-white absolute w-full hover:underline cursor-pointer top-0 font-bosemiboldld"
        >
          {{ playlist.name }}
        </div>

        <div v-if="playlist.description" class="text-gray-300 text-[13px] mt-2">
          {{ playlist.description }}
        </div>

        <div class="text-gray-300 text-[13px] flex mt-1">
          <div class="flex">{{ playlistTracks.length }} songs</div>
        </div>

        <div class="absolute flex gap-4 items-center justify-start bottom-0 mb-1.5">
          <button class="p-1 rounded-full bg-white" @click="playFunc()">
            <Play v-if="!isPlaying" fillColor="#181818" :size="25" />
            <Pause v-else fillColor="#181818" :size="25" />
          </button>
          <button type="button">
            <Heart fillColor="#1BD760" :size="30" />
          </button>
          <div class="relative">
            <button
              type="button"
              @click="toggleDropdown"
              class="hover:bg-[#2A2929] rounded-full p-1 transition-colors"
            >
              <DotsHorizontal fillColor="#FFFFFF" :size="25" />
            </button>

            <transition name="fade">
              <div
                v-if="showDropdown"
                class="absolute top-full mt-2 left-0 bg-[#282828] rounded-md shadow-2xl z-50 min-w-[200px]"
              >
                <ul class="py-1">
                  <li
                    @click="openEditModal"
                    class="px-4 py-3 hover:bg-[#3E3D3D] cursor-pointer flex items-center gap-3 text-white text-sm"
                  >
                    <Pencil fillColor="#FFFFFF" :size="18" />
                    <span>Edit details</span>
                  </li>
                  <li class="border-t border-gray-700"></li>
                  <li
                    @click="deletePlaylist"
                    class="px-4 py-3 hover:bg-[#3E3D3D] cursor-pointer flex items-center gap-3 text-red-400 text-sm"
                  >
                    <TrashCan fillColor="#EF4444" :size="18" />
                    <span>Delete playlist</span>
                  </li>
                </ul>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6"></div>

    <!-- Search Bar for Adding Songs -->
    <div class="mb-6 relative">
      <div class="flex items-center bg-[#242424] rounded-md px-4 py-2 max-w-md">
        <Magnify fillColor="#b3b3b3" :size="20" />
        <input
          v-model="searchQuery"
          @focus="handleSearchFocus"
          @blur="handleSearchBlur"
          @input="showSearchResults = true"
          type="text"
          placeholder="Search songs to add..."
          class="bg-transparent text-white outline-none ml-2 w-full placeholder-gray-400"
        />
      </div>

      <!-- Search Results Dropdown -->
      <transition name="fade">
        <div
          v-if="showSearchResults && filteredSongs.length > 0"
          class="absolute top-full mt-2 w-full max-w-md bg-[#282828] rounded-md shadow-2xl z-50 max-h-96 overflow-y-auto"
        >
          <ul class="py-2">
            <li
              v-for="track in filteredSongs"
              :key="track.id"
              @click="addSongToPlaylist(track)"
              class="px-4 py-3 hover:bg-[#3E3D3D] cursor-pointer flex items-center justify-between group"
            >
              <div>
                <div class="text-white font-semibold text-sm">{{ track.name }}</div>
                <div class="text-gray-400 text-xs">{{ artist.artistName }}</div>
              </div>
              <button
                class="opacity-0 group-hover:opacity-100 p-2 hover:bg-green-500/20 rounded-full transition-opacity"
              >
                <Plus fillColor="#1DB954" :size="20" />
              </button>
            </li>
            <div class="absolute flex gap-4 items-center justify-start bottom-0 mb-1.5">
                    <button class="p-1 rounded-full bg-white" @click="playFunc()">
                        <Play v-if="!isPlaying" fillColor="#181818" :size="25"/>
                        <Pause v-else fillColor="#181818" :size="25"/>
                    </button>
                    <button type="button">
                        <Heart fillColor="#1BD760" :size="30"/>
                    </button>
                    <button type="button">
                        <DotsHorizontal fillColor="#FFFFFF" :size="25"/>
                    </button>
                </div>
            </div>
        </div>

        <div class="mt-6"></div>
        <div class="flex items-center justify-between px-5 pt-2">
            <div class="flex items-center justify-between text-gray-400">
                <div class="mr-7">#</div>
                <div class="text-sm">Title</div>
            </div>
            <div><ClockTimeThreeOutline fillColor="#FFFFFF" :size="18"/></div>
        </div>
        <div class="border-b border-b-[#2A2A2A] mt-2"></div>
        <div class="mb-4"></div>
        <ul class="w-full" v-for="track, index in likedTracks" :key="track">
            <SongRow :artist="artist" :track="track" :index="++index"/>
        </ul>
        </div>
        <div
          v-else-if="showSearchResults && searchQuery.trim() && filteredSongs.length === 0"
          class="absolute top-full mt-2 w-full max-w-md bg-[#282828] rounded-md shadow-2xl z-50 p-4"
        >
          <p class="text-gray-400 text-sm">No songs found</p>
        </div>

      <div v-if="playlistTracks.length === 0" class="text-center text-gray-400 mt-8">
      <p class="text-lg mb-4">This playlist is empty</p>
      <p class="text-sm">Use the search bar above to add songs</p>
    </div>

    <AddToPlaylistModal ref="addToPlaylistModal" />
    <SelectSongsModal ref="selectSongsModal" />
    <EditPlaylistModal ref="editPlaylistModal" />
<!-- 
     <div v-else class="p-8 text-center text-gray-400">
         <p>Playlist not found</p>
     </div> -->
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
