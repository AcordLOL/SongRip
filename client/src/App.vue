<script setup>
import SearchBar from './components/SearchBar.vue';
import MessageBox from './components/messageBox.vue';
import SongGrid from './components/songGrid.vue';
import SongBox from './components/songBox.vue'
import SongRip from './scripts/songrip';
import { SongSet } from './models/songset.js'
</script>

<template>
    <header>
        <SearchBar v-on:url-submit="submit_url"/>
    </header>
    <article>
        <div class="grid">
            <SongGrid v-if="active_songs" :pending="pending" :songset="active_songs" v-on:download="download"/>
            <MessageBox v-if="message_is_visible" :title="message_title" :html-content="message_text" />
            <div class="row" v-if="active_songs" v-for="(chunk, c_key) in loadSongsInChunks(3)">
                <SongBox v-for="(song, s_key) in chunk" v-bind:key="(c_key * 3) + s_key" v-on:download="download([song])" :file="song.file" v-bind:song="song" ></SongBox>
            </div> 
        </div>
    </article>
</template>

<script>
    export default {
        data: () => ({
            message_is_visible: true,
            message_title: "SongRip",
            message_text: "<p><strong>The <a href='https://open.spotify.com'>Spotify</a> ripper</strong></p><p>Updated December 2025</p><br/<p>Enter a Track, Album or Playlist URL from <a href='https://open.spotify.com'>Spotify</a> to begin.</p><p> By using this tool, you agree to not violate copyright law or licenses established by the song owners, artists and/or Spotify. All content belong to their datapective owners.</p><br><p>Having an issue? Report it on <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>GitHub</a></p>",
            active_songs: null,
            pending: 0
        }),

        methods: {
            display_message(message_title, message_text) {
                this.message_is_visisble = true;
                this.message_title = message_title;
                this.message_text = message_text;
            },

            submit_url(url) {
                this.display_message("Featching song data...", "Please wait...");
                this.active_songs = null
                url = SongRip.prependHttpsToURL(url)
                
                let url_type = SongRip.getURLType(url) || 'invalid'

                if (url_type == 'invalid') {
                    this.display_message("Inavlid URL")
                    return
                }

                SongRip.uploadSongs(url, url_type, this.on_songs_ready)
            },

            on_songs_ready ({ data }) {
                this.set_song_group(
                    new SongSet(
                        data.name, 
                        data.type, 
                        data.creators, 
                        data.image, 
                        data.songs,
                        data.link
                    )
                )

                this.display_message("Retrieving...", "Downloading please wait...");
            },

            set_song_group(songset) {
                this.active_songs = songset
                
                for (const song of this.active_songs.songs) {
                    this.pending++
                    SongRip.getFile(song).then(file => {
                        song.file = file
                        this.pending--

                        if (!this.pending) {
                            this.message_is_visible = false
                        }
                    })
                }
            },

            loadSongsInChunks(chunkSize_) {
                let output = []
                if (this.active_songs.songs.length > 1) {
                    for(let i = 0; i < this.active_songs.songs.length; i++) {
                        if (i % chunkSize_ == 0) {
                            output.push([])
                        }
                        output[Math.floor(i / chunkSize_)].push(this.active_songs.songs[i])
                    }
                    return output
                }
            },
                
            download(songs) {
                SongRip.getZip(songs)
            }
        }
    }
</script>