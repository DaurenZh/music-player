<script setup>
    import { computed, watch, ref, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import HomeCard from '../components/HomeCard.vue';
    import SongRow from '../components/SongRow.vue';
    import ClockTimeThreeOutline from 'vue-material-design-icons/ClockTimeThreeOutline.vue';
    import AddToPlaylistModal from '../components/AddToPlaylistModal.vue';

    import { useSongStore } from '../stores/song'
    import { storeToRefs } from 'pinia';

    const useSong = useSongStore()
    const { searchTracks, topArtists } = storeToRefs(useSong)
    const route = useRoute()
    const query = computed(() => typeof route.query.q === 'string' ? route.query.q : '')

    onMounted(() => {
        if (topArtists.value.length === 0) {
            useSong.fetchTopArtists()
        }
    })

    watch(query, async (newVal) => {
        if (newVal) {
            await useSong.fetchTracks(newVal)
        } else {
            useSong.searchTracks = []
        }
    }, { immediate: true })

    const addToPlaylistModal = ref(null)
    const handleAddToPlaylist = (track) => {
        addToPlaylistModal.value?.openModal(track)
    }
</script>

<template>
    <div class="p-8">
        <div v-if="query" class="text-white text-2xl font-semibold mb-6">
            Search results for "{{ query }}"
        </div>
        <div v-else class="text-white text-2xl font-semibold mb-6">
            Top Artists
        </div>

        <div v-if="query && searchTracks.length > 0">
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

        <div v-else-if="!query" class="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6">
            <HomeCard 
                v-for="artist in topArtists" 
                :key="artist.id" 
                :image="artist.image" 
                :title="artist.title" 
                :subTitle="artist.subTitle"
                :searchQuery="artist.searchQuery" 
            />
        </div>
        
        <div v-else-if="query && searchTracks.length === 0" class="text-gray-400 mt-4">
            No results found.
        </div>

        <AddToPlaylistModal ref="addToPlaylistModal" />
    </div>
</template>