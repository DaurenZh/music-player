<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Magnify from 'vue-material-design-icons/Magnify.vue'

const route = useRoute()
const router = useRouter()
const query = ref(typeof route.query.q === 'string' ? route.query.q : '')

let debounceTimer = null
watch(query, (val) => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
        router.replace({
            path: '/search',
            query: val ? { q: val } : {}
        })
    }, 250)
})
</script>

<template>
    <div class="flex items-center w-full max-w-[620px]">
        <div class="relative w-full">
            <span class="absolute left-3 top-2.5">
                <Magnify fillColor="#B3B3B3" :size="20" />
            </span>
            <input
                v-model="query"
                type="text"
                placeholder="What do you want to play?"
                class="w-full h-10 pl-10 pr-4 rounded-full bg-[#242424] text-white placeholder:text-[#B3B3B3] focus:outline-none focus:bg-[#2A2A2A]"
            />
        </div>
    </div>
    
</template>


