import axios from "axios";
import JSZIP from "jszip";

let i = 0

export default class SongRip {

    static Messages = Object.freeze({
        RequestFailed: "Check that the Spotify URL is correct, then check your internet connection, and then try again.",
    })

    static URLTypes = Object.freeze({
        Track: 'track',
        Album: 'album',
        Playlist: 'playlist'
    });

    static prependHttpsToURL(url) {
        if (!url.toLowerCase().startsWith("http://") && !url.toLowerCase().startsWith("https://")) {
            url = "https://" + url;
        }
        return url
    }

    static getURLType(url) {
        for (const key in this.URLTypes) {
            const value = this.URLTypes[key]

            if (url.indexOf(value) != -1) return value
        }
    }

    static async uploadSongs(url, type, callback) {
        const url_id = url.split(`${type}/`)[1].split("?")[0];
        const platform = "spotify"
        const server_url = 'https://song-rip-server.vercel.app'
        const response = await axios.get(`${server_url}/dl-s-${platform}/${type}/${url_id}`)

        callback(response)
    }
static async getFile(song) {
        const url = 'https://song-rip-server.vercel.app'
    
        const response = await axios.post(`${url}/download/${song.name}`, song, {
            responseType: 'blob'
        })

        const file = URL.createObjectURL(new Blob([response.data]))
        
        return file
    }

    static async getZip(songset) {
        const _zip = new JSZIP();

        for (const song of songset.songs) {
            const response = await fetch(song.file)
            const file = await response.arrayBuffer()

            await _zip.file(`${song.name} - ${song.artists.map(a => a.name).join(', ')}.mp3`, file)
        }

        const content = await _zip.generateAsync({ type: 'blob' })

        const element = document.createElement('a')
        element.download = `${songset.name} by ${songset.creators.map(c => c.name).join(', ')}.zip`;

        const url = URL.createObjectURL(content)


        element.href = url;

        element.style.display = 'none';

        document.body.appendChild(element);
        element.click();
        element.remove();

        URL.revokeObjectURL(url)
    }
}
