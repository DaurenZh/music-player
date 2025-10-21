<script setup>
import { ref, computed } from 'vue'
import { useSongStore } from '../stores/song'
import { storeToRefs } from 'pinia'
import artist from '../artist.json'

const useSong = useSongStore()
const { playlists } = storeToRefs(useSong)

const showModal = ref(false)
const selectedPlaylistId = ref(null)
const selectedTracks = ref([])

const openModal = (playlistId) => {
    selectedPlaylistId.value = playlistId
    selectedTracks.value = []
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    selectedPlaylistId.value = null
    selectedTracks.value = []
}

const toggleTrack = (trackId) => {
    const index = selectedTracks.value.indexOf(trackId)
    if (index > -1) {
        selectedTracks.value.splice(index, 1)
    } else {
        selectedTracks.value.push(trackId)
    }
}

const addSelectedTracks = () => {
    if (selectedPlaylistId.value && selectedTracks.value.length > 0) {
        selectedTracks.value.forEach(trackId => {
            useSong.addTrackToPlaylist(selectedPlaylistId.value, trackId)
        })
        closeModal()
    }
}

const isInPlaylist = (trackId) => {
    const playlist = playlists.value.find(p => p.id === selectedPlaylistId.value)
    return playlist && playlist.tracks.includes(trackId)
}

defineExpose({ openModal })
</script>

<template>
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-[#282828] rounded-lg p-6 w-[600px] max-h-[80vh]">
            <h2 class="text-white text-xl font-bold mb-4">Add Songs to Playlist</h2>
            
            <div class="max-h-96 overflow-y-auto mb-4">
                <div v-for="track in artist.tracks" :key="track.id" class="flex items-center justify-between p-2 hover:bg-[#3E3D3D] rounded">
                    <div class="flex items-center">
                        <input 
                            type="checkbox" 
                            :id="`track-${track.id}`"
                            :value="track.id"
                            v-model="selectedTracks"
                            class="mr-3"
                        />
                        <label :for="`track-${track.id}`" class="text-white cursor-pointer">
                            {{ track.name }}
                        </label>
                    </div>
                    <span v-if="isInPlaylist(track.id)" class="text-green-500 text-xs">Already in playlist</span>
                </div>
            </div>
            
            <div class="flex justify-between items-center">
                <div class="text-gray-300 text-sm">
                    {{ selectedTracks.length }} songs selected
                </div>
                <div class="flex gap-3">
                    <button
                        @click="closeModal"
                        class="px-4 py-2 text-gray-300 hover:text-white"
                    >
                        Cancel
                    </button>
                    <button
                        @click="addSelectedTracks"
                        :disabled="selectedTracks.length === 0"
                        class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Add Selected
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
