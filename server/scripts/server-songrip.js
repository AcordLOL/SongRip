import axios from "axios";
import dotenv from "dotenv";
import search from 'yt-search';
import { promisify } from 'node:util';
import { exec } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config({ path: ['.env.local', '.env'] });
const execute = promisify(exec)

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

export default class ServerSongRip {
    
    static async getAccess() {
        const auth_token = await Buffer.from(`${process.env.SP_CLIENT}:${process.env.SP_SECRET}`, 'utf-8').toString('base64')
        const client = await axios.post("https://accounts.spotify.com/api/token", 
            {
                grant_type: "client_credentials",
            }, {
                headers: {
                    "Authorization": `Basic ${auth_token}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        )

        return client.data.access_token
    }

    static async getSongs(_id, _type){
        try{
            const access_token = await this.getAccess()
            
            const { data } = await axios.get(
                `https://api.spotify.com/v1/${_type}s/${_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                }
            );
            
            let set = {
                name: data.name,
                type: _type,
                creators: (data.owner) ? [{ 
                name: data.owner.display_name, url: data.owner.external_urls.spotify 
            }] : data.artists.map((a) => {
                return { name: a.name, url: a.external_urls.spotify }
            }),
            image: (data.images) ? data.images[0].url : data.album.images[0].url,
            songs: [],
            link: data.external_urls.spotify
        }
        
        for (const trackObj of ((_type == 'track') ? [data] : data.tracks.items)) {
            const track = trackObj.track || trackObj
            const artists = track.artists.map((a) => {
                return { name: a.name, url: a.external_urls.spotify }
            })
            
            set.songs.push({
                name: track.name,
                type: 'track',
                artists: artists,
                image: (track.album) ? track.album.images[0].url : data.images[0].url,
                link: track.external_urls.spotify
            })
        }
        
        return set
        
        }catch (error) {
            console.error('Error:', error);
        }
    }
    
    static async downloadFile(song) {
        try{
            const results = await search(`${song.name} by ${song.artists.map(a => a.name).join(', ')}`)
            
            const paths = {
                download: "../downloads",
                ffmpeg: "../ffmpeg/bin",
                yt_dlp: "./yt-dlp",
            }
            
            for (const key of Object.keys(paths)) {
                paths[key] = await join(__dirname, paths[key]);
            }
                
            const command = `yt-dlp.exe -x --audio-format mp3 --embed-thumbnail --js-runtimes node --ffmpeg-location "${paths.ffmpeg}" --add-metadata -o "${paths.download}/${song.name}.%(ext)s" "${results.all[0].url}"`
            
            await execute(command, { cwd: paths.yt_dlp });
            return(join(__dirname, paths.download, `${song.name}.mp3`))
        }catch (error) {
            console.error('Error:', error);
        }
    }
}