<script setup>
import { ref, computed } from 'vue'
import { useSongStore } from '../stores/song'
import { storeToRefs } from 'pinia'

const useSong = useSongStore()
const { playlists } = storeToRefs(useSong)

const showModal = ref(false)
const selectedTrack = ref(null)

const openModal = (track) => {
    selectedTrack.value = track
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    selectedTrack.value = null
}

const addToPlaylist = (playlistId) => {
    if (selectedTrack.value) {
        useSong.addTrackToPlaylist(playlistId, selectedTrack.value.id)
    }
    closeModal()
}

const isInPlaylist = (playlistId) => {
    if (!selectedTrack.value) return false
    const playlist = playlists.value.find(p => p.id === playlistId)
    return playlist && playlist.tracks.includes(selectedTrack.value.id)
}

defineExpose({ openModal })
</script>

<template>
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-[#282828] rounded-lg p-6 w-96">
            <h2 class="text-white text-xl font-bold mb-4">Add to Playlist</h2>
            <div v-if="selectedTrack" class="mb-4">
                <p class="text-gray-300 text-sm">Add "{{ selectedTrack.name }}" to:</p>
            </div>
            
            <div class="max-h-60 overflow-y-auto">
                <div v-if="playlists.length === 0" class="text-gray-400 text-center py-4">
                    No playlists yet. Create one first!
                </div>
                <div v-else>
                    <button
                        v-for="playlist in playlists"
                        :key="playlist.id"
                        @click="addToPlaylist(playlist.id)"
                        :disabled="isInPlaylist(playlist.id)"
                        class="w-full text-left px-3 py-2 hover:bg-[#3E3D3D] rounded text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {{ playlist.name }}
                        <span v-if="isInPlaylist(playlist.id)" class="text-green-500 text-xs ml-2">✓</span>
                    </button>
                </div>
            </div>
            
            <div class="flex justify-end mt-4">
                <button
                    @click="closeModal"
                    class="px-4 py-2 text-gray-300 hover:text-white"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
</template>
