<script setup>
    import HomeCard from '../components/HomeCard.vue';
</script>

<template>
    <div class="p-8 overflow-x-hidden">
        <div class="mb-8">
            <h2 class="text-white text-2xl font-bold mb-4 hover:underline cursor-pointer">
                Podcasts to make you smarter
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                <HomeCard image="https://picsum.photos/id/30/300/300" title="Science Friday" subTitle="Science & Technology" />
                <HomeCard image="https://picsum.photos/id/45/300/300" title="TED Radio Hour" subTitle="Society & Culture" />
                <HomeCard image="https://picsum.photos/id/65/300/300" title="Planet Money" subTitle="Business" />
                <HomeCard image="https://picsum.photos/id/67/300/300" title="Radiolab" subTitle="Science" />
                <HomeCard image="https://picsum.photos/id/100/300/300" title="99% Invisible" subTitle="Design" />
            </div>
        </div>

        <div class="mb-8">
            <h2 class="text-white text-2xl font-bold mb-4 hover:underline cursor-pointer">
                Recommended radio
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                <HomeCard image="https://picsum.photos/id/120/300/300" title="Classic Rock" subTitle="Radio" />
                <HomeCard image="https://picsum.photos/id/110/300/300" title="90s Hip Hop" subTitle="Radio" />
                <HomeCard image="https://picsum.photos/id/221/300/300" title="Indie Pop" subTitle="Radio" />
                <HomeCard image="https://picsum.photos/id/232/300/300" title="Jazz Vibes" subTitle="Radio" />
                <HomeCard image="https://picsum.photos/id/187/300/300" title="Lo-Fi Beats" subTitle="Radio" />
            </div>
        </div>

        <div class="mb-8">
            <h2 class="text-white text-2xl font-bold mb-4 hover:underline cursor-pointer">
                Recommended songs
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                <HomeCard image="https://picsum.photos/id/88/300/300" title="Blinding Lights" subTitle="The Weeknd" />
                <HomeCard image="https://picsum.photos/id/243/300/300" title="Shape of You" subTitle="Ed Sheeran" />
                <HomeCard image="https://picsum.photos/id/123/300/300" title="Levitating" subTitle="Dua Lipa" />
                <HomeCard image="https://picsum.photos/id/121/300/300" title="Peaches" subTitle="Justin Bieber" />
                <HomeCard image="https://picsum.photos/id/99/300/300" title="Drivers License" subTitle="Olivia Rodrigo" />
            </div>
        </div>
    </div>
</template>