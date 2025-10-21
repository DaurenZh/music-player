<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SongRow from '../components/SongRow.vue'
import AddToPlaylistModal from '../components/AddToPlaylistModal.vue'
import SelectSongsModal from '../components/SelectSongsModal.vue'
import Play from 'vue-material-design-icons/Play.vue';
import Pause from 'vue-material-design-icons/Pause.vue';
import Heart from 'vue-material-design-icons/Heart.vue';
import DotsHorizontal from 'vue-material-design-icons/DotsHorizontal.vue';
import ClockTimeThreeOutline from 'vue-material-design-icons/ClockTimeThreeOutline.vue';
import Plus from 'vue-material-design-icons/Plus.vue';
import TrashCan from 'vue-material-design-icons/TrashCan.vue';
import artist from '../artist.json'

import { useSongStore } from '../stores/song'
import { storeToRefs } from 'pinia';
const useSong = useSongStore()
const { isPlaying, currentTrack, currentArtist, playlists } = storeToRefs(useSong)

const route = useRoute()
const router = useRouter()
const playlistId = parseInt(route.params.id)

const playlist = computed(() => {
    return playlists.value.find(p => p.id === playlistId)
})

const playlistTracks = computed(() => {
    if (!playlist.value) return []
    return artist.tracks.filter(track => playlist.value.tracks.includes(track.id))
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

const addAllSongs = () => {
    if (playlist.value) {
        artist.tracks.forEach(track => {
            useSong.addTrackToPlaylist(playlistId, track.id)
        })
    }
}

const addToPlaylistModal = ref(null)
const selectSongsModal = ref(null)
const handleAddToPlaylist = (track) => {
    addToPlaylistModal.value?.openModal(track)
}

const openSelectSongs = () => {
    selectSongsModal.value?.openModal(playlistId)
}

const removeFromPlaylist = (trackId) => {
    useSong.removeTrackFromPlaylist(playlistId, trackId)
}

const deletePlaylist = () => {
    if (confirm('Are you sure you want to delete this playlist?')) {
        useSong.deletePlaylist(playlistId)
        router.push('/library')
    }
}
</script>

<template>
    <div v-if="playlist" class="p-8 overflow-x-hidden">
        <div class="flex items-center w-full relative h-full">
            <div class="w-32 h-32 bg-gradient-to-br from-green-500 to-blue-500 rounded-md flex items-center justify-center">
                <Heart fillColor="#FFFFFF" :size="48" />
            </div>

            <div class="w-full ml-5">
                <div class="text-gray-300 text-[13px] mb-2">Playlist</div>
                <div
                    style="font-size: 33px;"
                    class="text-white absolute w-full hover:underline cursor-pointer top-0 font-bosemiboldld"
                >
                    {{ playlist.name }}
                </div>

                <div class="text-gray-300 text-[13px] flex">
                    <div class="flex">{{ playlistTracks.length }} songs</div>
                </div>

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
                    <button type="button" @click="addAllSongs" class="flex items-center gap-2 text-gray-300 hover:text-white">
                        <Plus fillColor="#FFFFFF" :size="20"/>
                        <span class="text-sm">Add all songs</span>
                    </button>
                    <button type="button" @click="deletePlaylist" class="flex items-center gap-2 text-red-400 hover:text-red-300">
                        <TrashCan fillColor="#EF4444" :size="20"/>
                        <span class="text-sm">Delete playlist</span>
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
        <ul class="w-full" v-for="track, index in playlistTracks" :key="track">
            <li class="flex items-center justify-between rounded-md hover:bg-[#2A2929] group">
                <div class="flex items-center w-full py-1.5">
                    <div class="text-white font-semibold w-[40px] ml-5">
                        <span>{{ ++index }}</span>
                    </div>
                    <div>
                        <div class="text-white font-semibold">{{ track.name }}</div>
                        <div class="text-sm font-semibold text-gray-400">{{ artist.artistName }}</div>
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
                <button @click="addAllSongs" class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                    Add all songs
                </button>
                <button @click="openSelectSongs" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Add specific songs
                </button>
            </div>
        </div>
        
        <AddToPlaylistModal ref="addToPlaylistModal" />
        <SelectSongsModal ref="selectSongsModal" />
    </div>
    
    <div v-else class="p-8 text-center text-gray-400">
        <p>Playlist not found</p>
    </div>
</template>
