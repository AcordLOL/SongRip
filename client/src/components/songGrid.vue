<template>
    <div class="row">
        <div class="column">
            <div class="alertBox">
                <div class="image_container">
                    <img v-bind:src="songset.image"></img>
                </div>
                <div class="info_container">
                    <h3>{{ songset.name }}</h3>
                    <p class="subtext" v-if="songset.creators.length > 0">
                        by
                        <span v-for="(creator, key) in songset.creators"><a v-bind:href="creator.url">{{ creator.name }}</a><span v-if="key < songset.creators.length -1">, </span></span>
                    </p>
                </div>
                <div class="button_container" v-if="!pending">
                    <a class="button" v-if="songset.type == 'track'" v-bind:href="songset.songs[0].file" v-bind:download="`${songset.songs[0].name} - ${songset.songs[0].artists.map(a => a.name).join(', ')}.mp3`">Download</a>
                    <a class="button" id="zip" v-else v-on:click="download()">Download All</a>
                </div>
                <div class="button_container grayed" v-else>
                    <a class="button">Download {{ (songset.type == 'track') ? '' : 'All' }}</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SongGrid",
        props: ['songset', 'pending'],
        emits: ['download'],
        methods: {
            download() {
                this.$emit('download', this.songset)
            }
        }
    }
</script>