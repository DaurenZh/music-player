<script setup>
    import { onMounted } from 'vue';
    import HomeCard from '../components/HomeCard.vue';
    import { useSongStore } from '../stores/song';
    import { storeToRefs } from 'pinia';

    const useSong = useSongStore()
    const { homeSections } = storeToRefs(useSong)

    onMounted(() => {
        if (homeSections.value.length === 0) {
            useSong.fetchHomeSections()
        }
    })
</script>

<template>
    <div class="p-8 overflow-x-hidden">
        <div v-if="homeSections.length === 0" class="text-white text-center mt-10">
            Loading recommendations...
        </div>

        <div v-for="section in homeSections" :key="section.title" class="mb-8">
            <h2 class="text-white text-2xl font-bold mb-4 cursor-pointer">
                {{ section.title }}
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                <HomeCard 
                    v-for="item in section.items" 
                    :key="item.id"
                    :image="item.image" 
                    :title="item.title" 
                    :subTitle="item.subTitle"
                    :searchQuery="item.searchQuery" 
                />
            </div>
        </div>
    </div>
</template>