<script setup>
import { toRefs } from 'vue'
import { RouterLink } from 'vue-router';

const props = defineProps({
    image: String,
    title: String,
    subTitle: String,
    searchQuery: String
})
const { image, title, subTitle, searchQuery } = toRefs(props)
</script>

<template>
    <RouterLink :to="{ path: 'search', query: { q: searchQuery || title } }">
        <div class="bg-[#111111] p-4 rounded-md m-2 hover:bg-[#252525] cursor-pointer transition-colors group">
            <div class="relative mb-4">
                <img class="rounded-md w-full aspect-square object-cover shadow-lg" :src="image" alt="">
            </div>
            <div class="text-white font-semibold text-[16px] truncate">{{ title }}</div>
            <div class="text-gray-400 pt-1 text-[14px] truncate">{{ subTitle }}</div>
        </div>
    </RouterLink>
</template>