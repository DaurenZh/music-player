<script setup>
  import { ref, onMounted } from 'vue'
  import { RouterLink, RouterView } from 'vue-router'
  import MenuItem from './components/MenuItem.vue';
  import MusicPlayer from './components/MusicPlayer.vue'
  import SearchBar from './components/SearchBar.vue'
  import CreatePlaylistModal from './components/CreatePlaylistModal.vue'
  import { useRoute } from 'vue-router'
  import ChevronUp from 'vue-material-design-icons/ChevronUp.vue';
  import ChevronDown from 'vue-material-design-icons/ChevronDown.vue';
  import ChevronRight from 'vue-material-design-icons/ChevronRight.vue';
  import ChevronLeft from 'vue-material-design-icons/ChevronLeft.vue';

  import { useSongStore } from './stores/song'
  import { storeToRefs } from 'pinia';
  const useSong = useSongStore()
  const { isPlaying, currentTrack, playlists } = storeToRefs(useSong)

  onMounted(() => { isPlaying.value = false })

  let openMenu = ref(false)
  const createPlaylistModal = ref(null)
  const accounts = ref([
    {
      name: 'Dauren',
      avatar: 'https://picsum.photos/seed/dauren/80/80'
    },
    {
      name: 'Abylaikhan',
      avatar: 'https://picsum.photos/seed/abylaikahn/80/80'
    }
  ])
  const activeAccountIndex = ref(0)
  const activeAccount = () => accounts.value[activeAccountIndex.value]
  const switchAccount = (idx) => {
    activeAccountIndex.value = idx
    openMenu.value = false
  }
  const route = useRoute()
</script>

<template>
    <div>
        <div 
          id="TopNav"
          class="
            w-[calc(100%-240px)] 
            h-[60px] 
            fixed 
            right-0 
            z-20 
            bg-[#101010] 
            bg-opacity-80 
            flex 
            items-center 
            justify-between
          "
        >
            <div class="flex items-center ml-6 w-1/3">
                <button type="button" class="rounded-full bg-black p-[1px] cursor-pointer">
                    <ChevronLeft fillColor="#FFFFFF" :size="30" />
                </button>
                <button type="button" class="rounded-full bg-black p-[1px] hover:bg-[#] ml-4 cursor-pointer">
                    <ChevronRight fillColor="#FFFFFF" :size="30" />
                </button>
            </div>
            <div class="flex-1 flex justify-center" v-if="route.path === '/search'">
                <SearchBar />
            </div>

            <button @click="openMenu = !openMenu" :class="openMenu ? 'bg-[#282828]' : 'bg-black'"
                class="bg-black hover:bg-[#282828] rounded-full p-0.5 mr-8 mt-0.5 cursor-pointer">
                <div class="flex items-center">
                    <img 
                      class="rounded-full" 
                      width="27" height="27" style="object-fit: cover;"
                      :src="activeAccount().avatar"
                    >
                    <div class="text-white text-[14px] ml-1.5 font-semibold">{{ activeAccount().name }}</div>
                    <ChevronDown v-if="!openMenu" @click.stop="openMenu = true" fillColor="#FFFFFF" :size="25" />
                    <ChevronUp v-else @click.stop="openMenu = false" fillColor="#FFFFFF" :size="25" />
                </div>
            </button>

            <span v-if="openMenu"
                class="fixed w-[240px] bg-[#282828] shadow-2xl z-50 rounded-sm top-[52px] right-[35px] p-1 cursor-pointer">
                <ul class="text-gray-200 font-semibold text-[14px]">
                    <li class="px-3 py-2.5 text-gray-300">Accounts</li>
                    <li 
                      v-for="(acc, idx) in accounts" 
                      :key="acc.name"
                      class="px-3 py-2.5 hover:bg-[#3E3D3D] flex items-center justify-between"
                      @click="switchAccount(idx)"
                    >
                        <div class="flex items-center">
                            <img :src="acc.avatar" class="rounded-full" width="26" height="26" style="object-fit: cover;">
                            <span class="ml-2" :class="idx === activeAccountIndex ? 'text-white' : ''">{{ acc.name }}</span>
                        </div>
                        <span v-if="idx === activeAccountIndex" class="text-green-500 text-xs">Current</span>
                    </li>
                    <li class="px-3 py-2.5 hover:bg-[#3E3D3D] border-t border-t-gray-600">Profile</li>
                    <li class="px-3 py-2.5 hover:bg-[#3E3D3D]">Log out</li>
                </ul>
            </span>
        </div>


        <div id="SideNav" class="h-[100%] p-6 w-[240px] fixed z-50 bg-black">
            <RouterLink to="/">
              <img width="125" src="/images/icons/spotify-logo.png">
            </RouterLink>
            <div class="my-8"></div>
            <ul>
                <RouterLink to="/">
                    <MenuItem class="ml-[1px]" :iconSize="23" name="Home" iconString="home" pageUrl="/" />
                </RouterLink>
                <RouterLink to="/search">
                    <MenuItem class="ml-[1px]" :iconSize="24" name="Search" iconString="search" pageUrl="/search" />
                </RouterLink>
                <RouterLink to="/library">
                    <MenuItem class="ml-[2px]" :iconSize="23" name="Your Library" iconString="library" pageUrl="/library" />
                </RouterLink>
                <div class="py-3.5"></div>
                <MenuItem :iconSize="24" name="Create Playlist" iconString="playlist" pageUrl="/playlist" @click="createPlaylistModal?.openModal()" />
                <RouterLink to="/liked">
                    <MenuItem class="-ml-[1px]" :iconSize="27" name="Liked Songs" iconString="liked" pageUrl="/liked" />
                </RouterLink>
            </ul>
            <div class="border-b border-b-gray-700"></div>

            
            <div v-if="playlists.length > 0" class="mt-4">
                <div class="text-gray-400 text-xs font-semibold mb-2">YOUR PLAYLISTS</div>
                <ul>
                    <RouterLink 
                        v-for="playlist in playlists" 
                        :key="playlist.id" 
                        :to="`/playlist/${playlist.id}`"
                        class="block"
                    >
                        <li class="font-semibold text-[13px] mt-3 text-gray-300 hover:text-white cursor-pointer">
                            {{ playlist.name }}
                        </li>
                    </RouterLink>
                </ul>
            </div>
        </div>
    </div>

    <div
        class="
            fixed
            right-0
            top-0
            w-[calc(100%-240px)]
            overflow-auto
            h-full
            bg-gradient-to-b
            from-[#1C1C1C]
            to-black
        "
    >
        <div class="mt-[70px]"></div>
        <RouterView />
        <div class="mb-[100px]"></div>
    </div>

    <MusicPlayer v-if="currentTrack"/>
    <CreatePlaylistModal ref="createPlaylistModal" />
</template>