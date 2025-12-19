<script setup>
import { ref, computed } from 'vue'
import { useSongStore } from '../stores/song'
import { storeToRefs } from 'pinia'

const useSong = useSongStore()
const { playlists, recentlyPlayed, searchTracks } = storeToRefs(useSong)

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

const toggleTrack = (track) => {
    const index = selectedTracks.value.findIndex(t => t.id === track.id)
    if (index > -1) {
        selectedTracks.value.splice(index, 1)
    } else {
        selectedTracks.value.push(track)
    }
}

const isSelected = (trackId) => {
    return selectedTracks.value.some(t => t.id === trackId)
}

const addSelectedTracks = () => {
    if (selectedPlaylistId.value && selectedTracks.value.length > 0) {
        selectedTracks.value.forEach(track => {
            useSong.addTrackToPlaylist(selectedPlaylistId.value, track)
        })
        closeModal()
    }
}

const isInPlaylist = (trackId) => {
    const playlist = playlists.value.find(p => p.id === selectedPlaylistId.value)
    return playlist && playlist.tracks.some(t => t.id === trackId)
}

// Combine recently played and current search results for selection
const availableTracks = computed(() => {
    const tracks = [...recentlyPlayed.value, ...searchTracks.value]
    // Deduplicate
    const unique = []
    const map = new Map()
    for (const item of tracks) {
        if(!map.has(item.id)){
            map.set(item.id, true);
            unique.push(item);
        }
    }
    return unique
})

defineExpose({ openModal })
</script>

<template>
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeModal">
        <div class="bg-[#282828] rounded-lg p-6 w-[600px] max-h-[80vh] shadow-2xl">
            <h2 class="text-white text-xl font-bold mb-4">Add Songs to Playlist</h2>
            <p class="text-gray-400 text-sm mb-4">Select from your recent history and search results.</p>
            
            <div class="max-h-96 overflow-y-auto mb-4">
                <div v-if="availableTracks.length === 0" class="text-gray-400 text-center py-8">
                    No tracks found. Try searching for songs first!
                </div>
                <div v-else v-for="track in availableTracks" :key="track.id" class="flex items-center justify-between p-2 hover:bg-[#3E3D3D] rounded">
                    <div class="flex items-center flex-1 overflow-hidden">
                        <input 
                            type="checkbox" 
                            :id="`track-${track.id}`"
                            :checked="isSelected(track.id)"
                            @change="toggleTrack(track)"
                            :disabled="isInPlaylist(track.id)"
                            class="mr-3"
                        />
                        <img :src="track.albumCover" class="w-10 h-10 rounded mr-3">
                        <div class="flex flex-col overflow-hidden">
                            <label :for="`track-${track.id}`" class="text-white cursor-pointer truncate font-semibold">
                                {{ track.name }}
                            </label>
                            <span class="text-gray-400 text-xs truncate">{{ track.artistName }}</span>
                        </div>
                    </div>
                    <span v-if="isInPlaylist(track.id)" class="text-green-500 text-xs ml-2 whitespace-nowrap">Already added</span>
                </div>
            </div>
            
            <div class="flex justify-between items-center pt-4 border-t border-gray-700">
                <div class="text-gray-300 text-sm">
                    {{ selectedTracks.length }} songs selected
                </div>
                <div class="flex gap-3">
                    <button
                        @click="closeModal"
                        class="px-4 py-2 text-gray-300 hover:text-white font-bold"
                    >
                        Cancel
                    </button>
                    <button
                        @click="addSelectedTracks"
                        :disabled="selectedTracks.length === 0"
                        class="px-6 py-2 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all"
                    >
                        Add Selected
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
