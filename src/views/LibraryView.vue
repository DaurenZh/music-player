<script setup>
import { onMounted, computed, ref } from 'vue'
import SongRow from '../components/SongRow.vue'
import AddToPlaylistModal from '../components/AddToPlaylistModal.vue'
import Play from 'vue-material-design-icons/Play.vue';
import Pause from 'vue-material-design-icons/Pause.vue';
import ClockTimeThreeOutline from 'vue-material-design-icons/ClockTimeThreeOutline.vue';
import Heart from 'vue-material-design-icons/Heart.vue';

import { useSongStore } from '../stores/song'
import { storeToRefs } from 'pinia';

const useSong = useSongStore()
const { isPlaying, currentTrack, recentlyPlayed, searchTracks, likedTracks } = storeToRefs(useSong)

onMounted(() => {
    // Fetch some default music if empty
    if (searchTracks.value.length === 0) {
        useSong.fetchTracks('The Weeknd')
    }
})

const playTrack = (track) => {
    useSong.playOrPauseThisSong({ name: track.artistName, artistName: track.artistName, albumCover: track.albumCover }, track)
}

// Filter liked tracks from searchTracks + recentlyPlayed (since we only store IDs in likedTracks)
// In a real app, we'd fetch liked tracks by ID. Here we try to find them in memory.
const myLikedSongs = computed(() => {
    const allKnownTracks = [...searchTracks.value, ...recentlyPlayed.value]
    // Deduplicate by ID
    const uniqueTracks = Array.from(new Map(allKnownTracks.map(item => [item.id, item])).values())
    return uniqueTracks.filter(t => useSong.isLiked(t.id))
})

const addToPlaylistModal = ref(null)
const handleAddToPlaylist = (track) => {
    addToPlaylistModal.value?.openModal(track)
}
</script>

<template>
    <div class="p-8 overflow-x-hidden">
        <h1 class="text-white text-3xl font-bold mb-6">Your Library</h1>

        <!-- Recently Played Section -->
        <div v-if="recentlyPlayed.length > 0" class="mb-10">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-white text-xl font-bold">Recently Played</h2>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <div 
                    v-for="(track, i) in recentlyPlayed.slice(0, 5)" 
                    :key="track.id"
                    class="bg-[#181818] p-4 rounded-md hover:bg-[#282828] transition-colors group cursor-pointer"
                    @click="playTrack(track)"
                >
                    <div class="relative mb-4">
                        <img :src="track.albumCover" class="w-full rounded-md shadow-lg aspect-square object-cover">
                        <button 
                            class="absolute bottom-2 right-2 bg-green-500 rounded-full p-3 opacity-0 group-hover:opacity-100 hover:scale-105 transition-all shadow-xl translate-y-2 group-hover:translate-y-0"
                        >
                            <Play v-if="!isPlaying || currentTrack?.id !== track.id" fillColor="black" :size="24" />
                            <Pause v-else fillColor="black" :size="24" />
                        </button>
                    </div>
                    <div class="text-white font-bold truncate">{{ track.name }}</div>
                    <div class="text-gray-400 text-sm truncate">{{ track.artistName }}</div>
                </div>
            </div>
        </div>

        <!-- Liked Songs Preview -->
        <div v-if="myLikedSongs.length > 0" class="mb-10">
            <div class="flex items-center gap-4 mb-4 cursor-pointer hover:underline">
                <div class="bg-gradient-to-br from-purple-700 to-blue-700 p-2 rounded-sm">
                    <Heart fillColor="white" :size="24"/>
                </div>
                <h2 class="text-white text-xl font-bold">Liked Songs ({{ myLikedSongs.length }})</h2>
            </div>
        </div>

        <!-- Discover / Recommended -->
        <div>
            <h2 class="text-white text-xl font-bold mb-4">Recommended for you</h2>
            <div class="flex items-center justify-between px-5 pt-2 text-gray-400 text-sm border-b border-[#2A2A2A] pb-2 mb-4">
                <div class="flex items-center">
                    <div class="mr-7">#</div>
                    <div>Title</div>
                </div>
                <div><ClockTimeThreeOutline fillColor="#FFFFFF" :size="18"/></div>
            </div>

            <ul class="w-full">
                <SongRow 
                    v-for="(track, index) in searchTracks" 
                    :key="track.id" 
                    :artist="{ name: track.artistName, artistName: track.artistName }" 
                    :track="track" 
                    :index="index + 1" 
                    @addToPlaylist="handleAddToPlaylist"
                />
            </ul>
        </div>
        
        <AddToPlaylistModal ref="addToPlaylistModal" />
    </div>
</template>

<style scoped>
    .circle {
        width: 4px;
        height: 4px;
        background-color: rgb(189, 189, 189);
        border-radius: 100%;
    }
</style>