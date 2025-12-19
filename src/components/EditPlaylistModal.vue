<script setup>
import { ref, reactive, watch, nextTick } from 'vue'
import { useSongStore } from '../stores/song'
import Close from 'vue-material-design-icons/Close.vue'
import Image from 'vue-material-design-icons/Image.vue'

const useSong = useSongStore()

const isOpen = ref(false)
const playlistData = reactive({
  id: null,
  name: '',
  description: '',
  image: null,
})

const errors = reactive({
  name: '',
  description: '',
})

const nameInput = ref(null)
const imageInput = ref(null)
const imagePreview = ref(null)

const openModal = (playlist) => {
  playlistData.id = playlist.id
  playlistData.name = playlist.name
  playlistData.description = playlist.description || ''
  playlistData.image = playlist.image || null
  imagePreview.value = playlist.image || null
  isOpen.value = true

  nextTick(() => {
    nameInput.value?.focus()
  })
}

const closeModal = () => {
  isOpen.value = false
  errors.name = ''
  errors.description = ''
  imagePreview.value = null
}

const validateName = () => {
  if (!playlistData.name.trim()) {
    errors.name = 'Playlist name is required'
    return false
  }
  if (playlistData.name.length < 2) {
    errors.name = 'Playlist name must be at least 2 characters'
    return false
  }
  if (playlistData.name.length > 100) {
    errors.name = 'Playlist name must be less than 100 characters'
    return false
  }
  errors.name = ''
  return true
}

const validateDescription = () => {
  if (playlistData.description.length > 300) {
    errors.description = 'Description must be less than 300 characters'
    return false
  }
  errors.description = ''
  return true
}

const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
      playlistData.image = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  playlistData.image = null
  imagePreview.value = null
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

const triggerFileInput = () => {
  imageInput.value?.click()
}

const savePlaylist = () => {
  const isNameValid = validateName()
  const isDescriptionValid = validateDescription()

  if (!isNameValid || !isDescriptionValid) {
    return
  }

  useSong.updatePlaylist(playlistData.id, {
    name: playlistData.name,
    description: playlistData.description,
    image: playlistData.image,
  })

  closeModal()
}

watch(
  () => playlistData.name,
  () => {
    if (errors.name) {
      validateName()
    }
  },
)

watch(
  () => playlistData.description,
  () => {
    if (errors.description) {
      validateDescription()
    }
  },
)

defineExpose({
  openModal,
  closeModal,
})
</script>

<template>
  <transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      @click.self="closeModal"
    >
      <div
        class="bg-[#282828] rounded-lg w-full max-w-lg mx-4 overflow-hidden shadow-2xl"
        @click.stop
      >
        <div class="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 class="text-white text-2xl font-bold">Edit playlist details</h2>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-white transition-colors p-1 hover:bg-[#3E3D3D] rounded-full"
          >
            <Close :size="24" />
          </button>
        </div>

        <div class="p-6">
          <div class="flex gap-6 mb-6">
            <div class="flex-shrink-0">
              <div
                class="w-40 h-40 bg-[#333] rounded-md flex items-center justify-center cursor-pointer hover:bg-[#3E3D3D] transition-colors group relative overflow-hidden"
                @click="triggerFileInput"
              >
                <img
                  v-if="imagePreview"
                  :src="imagePreview"
                  alt="Playlist cover"
                  class="w-full h-full object-cover"
                />
                <div v-else class="flex flex-col items-center text-gray-400">
                  <Image :size="48" />
                  <span class="text-xs mt-2">Choose photo</span>
                </div>

                <div
                  v-if="imagePreview"
                  class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center"
                >
                  <Image :size="48" fillColor="#FFFFFF" />
                  <span class="text-white text-xs mt-2">Change photo</span>
                </div>
              </div>

              <input
                ref="imageInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleImageChange"
              />

              <button
                v-if="imagePreview"
                @click="removeImage"
                class="w-full mt-2 text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                Remove image
              </button>
            </div>

            <div class="flex-1 flex flex-col gap-4">
              <div>
                <label for="playlist-name" class="block text-white text-sm font-semibold mb-2">
                  Name
                </label>
                <input
                  id="playlist-name"
                  ref="nameInput"
                  v-model="playlistData.name"
                  type="text"
                  placeholder="My Playlist"
                  maxlength="100"
                  class="w-full px-3 py-2 bg-[#3E3E3E] border-2 text-white rounded-md focus:outline-none focus:border-green-500 transition-colors"
                  :class="{ 'border-red-500': errors.name, 'border-transparent': !errors.name }"
                  @blur="validateName"
                />
                <div class="flex justify-between items-center mt-1">
                  <span v-if="errors.name" class="text-red-400 text-xs">{{ errors.name }}</span>
                  <span class="text-gray-400 text-xs ml-auto"
                    >{{ playlistData.name.length }}/100</span
                  >
                </div>
              </div>

              <div>
                <label
                  for="playlist-description"
                  class="block text-white text-sm font-semibold mb-2"
                >
                  Description
                </label>
                <textarea
                  id="playlist-description"
                  v-model="playlistData.description"
                  placeholder="Add an optional description"
                  rows="4"
                  maxlength="300"
                  class="w-full px-3 py-2 bg-[#3E3E3E] border-2 text-white rounded-md focus:outline-none focus:border-green-500 transition-colors resize-none"
                  :class="{
                    'border-red-500': errors.description,
                    'border-transparent': !errors.description,
                  }"
                  @blur="validateDescription"
                ></textarea>
                <div class="flex justify-between items-center mt-1">
                  <span v-if="errors.description" class="text-red-400 text-xs">{{
                    errors.description
                  }}</span>
                  <span class="text-gray-400 text-xs ml-auto"
                    >{{ playlistData.description.length }}/300</span
                  >
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-700">
            <button
              @click="closeModal"
              class="px-6 py-3 rounded-full text-white font-semibold hover:scale-105 transition-transform"
            >
              Cancel
            </button>
            <button
              @click="savePlaylist"
              class="px-6 py-3 bg-green-500 rounded-full text-black font-semibold hover:bg-green-400 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!playlistData.name.trim()"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-\[\#282828\],
.modal-leave-active .bg-\[\#282828\] {
  transition: transform 0.3s;
}

.modal-enter-from .bg-\[\#282828\] {
  transform: scale(0.9);
}

.modal-leave-to .bg-\[\#282828\] {
  transform: scale(0.9);
}
</style>
