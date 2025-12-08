<template>
    <div class="column four">
        <div class="item">
            <div class="behind">
                <img :class="{ 'grayed': !file }" v-bind:src="song.image" v-bind:alt="song.name">
            </div>
            <div class="front">
                <div class="info_container">
                    <a :href="song.link"><p>{{ song.name }}</p></a>
                    <span v-for="(artist, key) in song.artists"><a v-bind:href="artist.url">{{ artist.name }}</a><span v-if="key < song.artists.length -1">, </span></span>
                </div>
                <div class="button_container" v-if="file">
                    <a class="button square" v-bind:href="file" v-bind:download="`${song.name} - ${song.artists.map(a => a.name).join(', ')}.mp3`"><i class="icon ion-md-arrow-down"></i></a>
                </div>
                <div class="button_container grayed" v-else>
                    <a class="button square"><i class="icon ion-md-arrow-down"></i></a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SongBox",
        props: ["file", "song"],
        emits: ["download"]
    }
</script>