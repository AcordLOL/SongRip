<template>
<div id="icon">Sr</div>
    <input v-model="urlInput" v-on:keyup.enter="UrlSubmitted" id="url_input" type="text" placeholder="Spotify Track/Album/Playlist Url">
    <div id="url_submit_button" v-on:click="UrlSubmitted">
        <i class="icon ion-md-search"></i>
    </div>
</template>

<script>
    export default {
        name: "SearchBar",
        emits: ['UrlSubmit'],
        data: () => ({
            urlInput: ""
        }),
        methods: {
            UrlSubmitted() {
                this.$emit('UrlSubmit', this.urlInput);
            }
        }
    }
</script>