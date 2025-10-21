<script setup>
import { ref } from 'vue'
import { useSongStore } from '../stores/song'
import { useRouter } from 'vue-router'

const useSong = useSongStore()
const router = useRouter()

const playlistName = ref('')
const showModal = ref(false)

const createPlaylist = () => {
    if (playlistName.value.trim()) {
        const playlist = useSong.createPlaylist(playlistName.value.trim())
        playlistName.value = ''
        showModal.value = false
        router.push(`/playlist/${playlist.id}`)
    }
}

const openModal = () => {
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    playlistName.value = ''
}

defineExpose({ openModal })
</script>

<template>
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-[#282828] rounded-lg p-6 w-96">
            <h2 class="text-white text-xl font-bold mb-4">Create Playlist</h2>
            <input
                v-model="playlistName"
                type="text"
                placeholder="Playlist name"
                class="w-full p-3 bg-[#3E3D3D] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                @keyup.enter="createPlaylist"
            />
            <div class="flex justify-end gap-3 mt-4">
                <button
                    @click="closeModal"
                    class="px-4 py-2 text-gray-300 hover:text-white"
                >
                    Cancel
                </button>
                <button
                    @click="createPlaylist"
                    :disabled="!playlistName.trim()"
                    class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Create
                </button>
            </div>
        </div>
    </div>
</template>
