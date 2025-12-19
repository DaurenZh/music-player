<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AddToPlaylistModal from '../components/AddToPlaylistModal.vue'
import SelectSongsModal from '../components/SelectSongsModal.vue'
import Play from 'vue-material-design-icons/Play.vue';
import Pause from 'vue-material-design-icons/Pause.vue';
import Heart from 'vue-material-design-icons/Heart.vue';
import DotsHorizontal from 'vue-material-design-icons/DotsHorizontal.vue';
import ClockTimeThreeOutline from 'vue-material-design-icons/ClockTimeThreeOutline.vue';
import Plus from 'vue-material-design-icons/Plus.vue';
import TrashCan from 'vue-material-design-icons/TrashCan.vue';
import Pencil from 'vue-material-design-icons/Pencil.vue';
import EditPlaylistModal from '../components/EditPlaylistModal.vue';

import { useSongStore } from '../stores/song'
import { storeToRefs } from 'pinia';
const useSong = useSongStore()
const { isPlaying, currentTrack, currentArtist, playlists } = storeToRefs(useSong)

const route = useRoute()
const router = useRouter()

// Fix: Use route.params.id dynamically in the computed property
const playlist = computed(() => {
    return playlists.value.find(p => p.id === parseInt(route.params.id))
})

const playlistTracks = computed(() => {
    if (!playlist.value) return []
    return playlist.value.tracks
})

const playFunc = () => {
    if (currentTrack.value && playlistTracks.value.some(t => t.id === currentTrack.value.id)) {
        useSong.playOrPauseThisSong(currentArtist.value, currentTrack.value)
        return
    } 
    if (playlistTracks.value.length > 0) {
        const track = playlistTracks.value[0]
        useSong.loadSong({ name: track.artistName, artistName: track.artistName, albumCover: track.albumCover }, track)
    }
}

const addToPlaylistModal = ref(null)
const selectSongsModal = ref(null)
const editPlaylistModal = ref(null)

const openSelectSongs = () => {
    selectSongsModal.value?.openModal(parseInt(route.params.id))
}

const removeFromPlaylist = (trackId) => {
    useSong.removeTrackFromPlaylist(parseInt(route.params.id), trackId)
}

const deletePlaylist = () => {
    if (confirm('Are you sure you want to delete this playlist?')) {
        useSong.deletePlaylist(parseInt(route.params.id))
        router.push('/library')
    }
}

const openEditModal = () => {
    editPlaylistModal.value?.openModal(playlist.value)
}
</script>

<template>
    <div v-if="playlist" class="p-8 overflow-x-hidden">
        <div class="flex items-center w-full relative h-full">
            <div class="w-60 h-60 bg-[#282828] rounded-md flex items-center justify-center overflow-hidden group relative">
                <img v-if="playlist.image" :src="playlist.image" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                    <Heart fillColor="#FFFFFF" :size="80" />
                </div>
                
                <div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" @click="openEditModal">
                    <div class="flex flex-col items-center">
                        <Pencil fillColor="#FFFFFF" :size="40" />
                        <span class="text-white font-semibold mt-2">Choose photo</span>
                    </div>
                </div>
            </div>

            <div class="w-full ml-5">
                <div class="text-gray-300 text-[13px] mb-2 font-bold">PLAYLIST</div>
                <div
                    class="text-white text-[50px] md:text-[80px] font-bold cursor-pointer hover:underline leading-none"
                    @click="openEditModal"
                >
                    {{ playlist.name }}
                </div>
                <div v-if="playlist.description" class="text-gray-400 text-sm mt-4">
                    {{ playlist.description }}
                </div>

                <div class="text-gray-300 text-[13px] flex mt-4">
                    <div class="flex font-bold">Abylaikhan</div>
                    <div class="mx-1">•</div>
                    <div class="flex">{{ playlistTracks.length }} songs</div>
                </div>
            </div>
        </div>

        <div class="mt-6 flex gap-4 items-center">
            <button class="p-3 rounded-full bg-[#1BD760] hover:scale-105 transition-transform" @click="playFunc()">
                <Play v-if="!isPlaying" fillColor="#000000" :size="30"/>
                <Pause v-else fillColor="#000000" :size="30"/>
            </button>
            <button type="button" @click="deletePlaylist" class="flex items-center gap-2 text-gray-400 hover:text-white">
                <TrashCan :size="25"/>
            </button>
            <button type="button" @click="openEditModal" class="flex items-center gap-2 text-gray-400 hover:text-white">
                <DotsHorizontal :size="25"/>
            </button>
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
        <ul class="w-full" v-for="(track, index) in playlistTracks" :key="track.id">
            <li class="flex items-center justify-between rounded-md hover:bg-[#2A2929] group px-2 py-1">
                <div class="flex items-center w-full py-1.5 cursor-pointer" @click="useSong.playOrPauseThisSong({ name: track.artistName, artistName: track.artistName, albumCover: track.albumCover }, track)">
                    <div class="text-white font-semibold w-[40px] ml-5">
                        <span v-if="!isPlaying || currentTrack?.id !== track.id" class="group-hover:hidden">{{ ++index }}</span>
                        <Play v-if="!isPlaying || currentTrack?.id !== track.id" fillColor="#FFFFFF" :size="20" class="hidden group-hover:block"/>
                        <Pause v-else fillColor="#1BD760" :size="20"/>
                    </div>
                    <div class="flex items-center">
                        <img v-if="track.albumCover" :src="track.albumCover" class="w-10 h-10 rounded-sm mr-3">
                        <div>
                            <div class="text-white font-semibold" :class="{'text-green-500': currentTrack?.id === track.id}">{{ track.name }}</div>
                            <div class="text-sm font-semibold text-gray-400">{{ track.artistName }}</div>
                        </div>
                    </div>
                </div>
                <div class="flex items-center">
                    <button 
                        @click="removeFromPlaylist(track.id)"
                        class="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/20 rounded-full"
                        title="Remove from playlist"
                    >
                        <TrashCan fillColor="#EF4444" :size="18"/>
                    </button>
                </div>
            </li>
        </ul>
        
        <div v-if="playlistTracks.length === 0" class="text-center text-gray-400 mt-8">
            <p>This playlist is empty</p>
            <div class="flex gap-4 justify-center mt-4">
                <button @click="openSelectSongs" class="px-4 py-2 bg-transparent border border-gray-500 text-white rounded-full hover:border-white font-bold">
                    Find songs
                </button>
            </div>
        </div>
        
        <AddToPlaylistModal ref="addToPlaylistModal" />
        <SelectSongsModal ref="selectSongsModal" />
        <EditPlaylistModal ref="editPlaylistModal" />
    </div>
    
    <div v-else class="p-8 text-center text-gray-400">
        <p>Playlist not found</p>
    </div>
</template>
