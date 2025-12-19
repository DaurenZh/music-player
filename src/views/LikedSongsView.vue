<script setup>
import { computed } from 'vue'
import SongRow from '../components/SongRow.vue'
import Play from 'vue-material-design-icons/Play.vue';
import Pause from 'vue-material-design-icons/Pause.vue';
import Heart from 'vue-material-design-icons/Heart.vue';
import DotsHorizontal from 'vue-material-design-icons/DotsHorizontal.vue';
import ClockTimeThreeOutline from 'vue-material-design-icons/ClockTimeThreeOutline.vue';

import { useSongStore } from '../stores/song'
import { storeToRefs } from 'pinia';
const useSong = useSongStore()
const { isPlaying, currentTrack, currentArtist, likedTracks } = storeToRefs(useSong)

const playFunc = () => {
    if (currentTrack.value && likedTracks.value.some(t => t.id === currentTrack.value.id)) {
        useSong.playOrPauseThisSong(currentArtist.value, currentTrack.value, likedTracks.value)
        return
    } 
    if (likedTracks.value.length > 0) {
        const track = likedTracks.value[0]
        useSong.loadSong({ name: track.artistName, artistName: track.artistName, albumCover: track.albumCover }, track, likedTracks.value)
    }
}
</script>

<template>
    <div class="p-8 overflow-x-hidden">
        <div class="flex items-center w-full relative h-full">
            <div class="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md flex items-center justify-center">
                <Heart fillColor="#FFFFFF" :size="48" />
            </div>

            <div class="w-full ml-5">
                <div class="text-gray-300 text-[13px] mb-2">Playlist</div>
                <div
                    style="font-size: 33px;"
                    class="text-white absolute w-full hover:underline cursor-pointer top-0 font-bosemiboldld"
                >
                    Liked Songs
                </div>

                <div class="text-gray-300 text-[13px] flex">
                    <div class="flex">{{ likedTracks.length }} songs</div>
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
        <ul class="w-full" v-for="(track, index) in likedTracks" :key="track.id">
            <SongRow 
                :artist="{ name: track.artistName, artistName: track.artistName }" 
                :track="track" 
                :index="index + 1"
                :tracksContext="likedTracks"
            />
        </ul>
        <div v-if="likedTracks.length === 0" class="text-gray-400 text-center mt-10">
            No liked songs yet.
        </div>
    </div>
</template>
