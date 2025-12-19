<template>
    <div class="flex flex-col items-center justify-center h-[60vh] text-white">
        <h1 class="text-6xl font-bold mb-4">404</h1>
        <p class="text-xl text-gray-400 mb-8">Page not found</p>
        <RouterLink 
            to="/" 
            class="bg-white text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform"
        >
            Go Home
        </RouterLink>
    </div>
</template>
