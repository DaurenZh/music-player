<script setup>
import { ref, toRefs, onMounted } from 'vue'
import Heart from 'vue-material-design-icons/Heart.vue';
import HeartOutline from 'vue-material-design-icons/HeartOutline.vue';
import Play from 'vue-material-design-icons/Play.vue';
import Pause from 'vue-material-design-icons/Pause.vue';
import DotsHorizontal from 'vue-material-design-icons/DotsHorizontal.vue';
import TrashCan from 'vue-material-design-icons/TrashCan.vue';
import PlaylistPlus from 'vue-material-design-icons/PlaylistPlus.vue';

import { useSongStore } from '../stores/song'
import { storeToRefs } from 'pinia';
const useSong = useSongStore()
const { isPlaying, currentTrack } = storeToRefs(useSong)

const toggleLike = () => {
    useSong.toggleLike(track.value.id)
}

const emit = defineEmits(['addToPlaylist', 'removeFromPlaylist', 'showMenu', 'toggleLike'])
const showAddToPlaylist = () => {
    emit('addToPlaylist', track.value)
}

let isHover = ref(false)
let isTrackTime = ref(null)

const props = defineProps({
    track: Object,
    artist: Object,
    index: Number,
    showMenu: {
        type: Boolean,
        default: false
    },
    showMenuButton: {
        type: Boolean,
        default: false
    }
})

const { track, artist, index } = toRefs(props)

onMounted(() => {
    const audio = new Audio('/' + track.value.song);
    audio.addEventListener('loadedmetadata', function() {
        const duration = audio.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        isTrackTime.value = minutes+':'+seconds.toString().padStart(2, '0')
    });
})

const toggleMenu = () => {
    emit('showMenu')
}
</script>

<template>
    <li class="flex items-center justify-between rounded-md hover:bg-[#2A2929] group px-2 py-1">
        <div
            class="flex items-center w-full cursor-pointer"
            @click="useSong.playOrPauseThisSong(artist, track)"
        >
            <div class="flex items-center justify-center w-[40px]">
                <span v-if="!isPlaying || currentTrack?.id !== track.id" class="group-hover:hidden text-white font-semibold">
                    {{ index }}
                </span>
                <Play
                    v-if="!isPlaying || currentTrack?.id !== track.id"
                    fillColor="#FFFFFF"
                    :size="25"
                    class="hidden group-hover:block"
                />
                <Pause v-else fillColor="#1DB954" :size="25" />
            </div>
            <div class="flex-1 ml-3">
                <div
                    class="text-white font-semibold"
                    :class="{ 'text-green-500': currentTrack?.id === track.id }"
                >
                    {{ track.name }}
                </div>
                <div class="text-sm font-semibold text-gray-400">{{ artist.artistName }}</div>
            </div>
        </div>

        <div class="flex items-center gap-2">
            <button
                @click.stop="useSong.toggleLike(track.id)"
                class="opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Heart v-if="useSong.isLiked(track.id)" fillColor="#1BD760" :size="22" />
                <HeartOutline v-else fillColor="#FFFFFF" :size="22" />
            </button>

            <div class="text-gray-400 text-xs mx-5 w-[40px] text-center">
                {{ track.length }}
            </div>

            <div v-if="showMenuButton" class="relative">
                <button
                    @click.stop="toggleMenu"
                    class="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[#3E3D3D] rounded-full"
                >
                    <DotsHorizontal fillColor="#b3b3b3" :size="20" />
                </button>

                <transition name="fade">
                    <div
                        v-if="showMenu"
                        class="absolute top-full right-0 mt-2 bg-[#282828] rounded-md shadow-2xl z-50 min-w-[220px]"
                    >
                        <ul class="py-1">
                            <li
                                @click.stop="emit('addToPlaylist')"
                                class="px-4 py-3 hover:bg-[#3E3D3D] cursor-pointer flex items-center gap-3 text-white text-sm"
                            >
                                <PlaylistPlus fillColor="#FFFFFF" :size="18" />
                                <span>Add to another playlist</span>
                            </li>
                            <li
                                @click.stop="emit('toggleLike')"
                                class="px-4 py-3 hover:bg-[#3E3D3D] cursor-pointer flex items-center gap-3 text-white text-sm"
                            >
                                <Heart v-if="useSong.isLiked(track.id)" fillColor="#1DB954" :size="18" />
                                <HeartOutline v-else fillColor="#FFFFFF" :size="18" />
                                <span>{{
                                    useSong.isLiked(track.id) ? 'Remove from Liked Songs' : 'Save to Liked Songs'
                                }}</span>
                            </li>
                            <li class="border-t border-gray-700"></li>
                            <li
                                @click.stop="emit('removeFromPlaylist')"
                                class="px-4 py-3 hover:bg-[#3E3D3D] cursor-pointer flex items-center gap-3 text-red-400 text-sm"
                            >
                                <TrashCan fillColor="#EF4444" :size="18" />
                                <span>Remove from this playlist</span>
                            </li>
                        </ul>
                    </div>
                </transition>
            </div>
        </div>
    </li>
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