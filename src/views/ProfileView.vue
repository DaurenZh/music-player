<script setup>
import { reactive, computed } from 'vue'
import { useWindowResize } from '../composables/useWindowResize'


const { width } = useWindowResize()


const form = reactive({
    name: 'Abylaikhan',
    email: '',
    bio: ''
})

const errors = reactive({
    name: '',
    email: ''
})

const isMobile = computed(() => width.value < 768)

const validate = () => {
    let isValid = true
    errors.name = ''
    errors.email = ''

    if (!form.name || form.name.length < 3) {
        errors.name = 'Name must be at least 3 characters.'
        isValid = false
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!form.email || !emailPattern.test(form.email)) {
        errors.email = 'Please enter a valid email.'
        isValid = false
    }

    return isValid
}

const saveProfile = () => {
    if (validate()) {
        alert('Profile saved successfully! (Mock)')
    }
}
</script>

<template>
    <div class="p-8 text-white max-w-2xl">
        <h1 class="text-3xl font-bold mb-6">Edit Profile</h1>
        
        <div class="bg-[#181818] p-6 rounded-lg">
            <div class="mb-4">
                <label class="block text-sm font-bold mb-2">Display Name</label>
                <input 
                    v-model="form.name" 
                    type="text" 
                    class="w-full bg-[#333] text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
            </div>

            <div class="mb-4">
                <label class="block text-sm font-bold mb-2">Email</label>
                <input 
                    v-model="form.email" 
                    type="email" 
                    class="w-full bg-[#333] text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
            </div>

            <div class="mb-6">
                <label class="block text-sm font-bold mb-2">Bio</label>
                <textarea 
                    v-model="form.bio" 
                    rows="4"
                    class="w-full bg-[#333] text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                ></textarea>
            </div>

            <button 
                @click="saveProfile"
                class="bg-green-500 text-black font-bold py-2 px-4 rounded-full hover:scale-105 transition-transform"
            >
                Save Changes
            </button>
        </div>


    </div>
</template>
