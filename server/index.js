import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import SSR from "./scripts/server-songrip.js";

const app = express();
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true })); 

app.use(cors({
    origin: ["http://localhost:5173", "https://song-rip.vercel.app"]
}))

dotenv.config();

app.get("/dl-s-:plat/:type/:id", async (req, res) => {
    try{
        const platform = req.params.plat;
        const type = req.params.type;
        const id = req.params.id;

        res.send(await SSR.getSongs(id, type));
    }catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post("/download/:song_name", async (req, res) => { 
    try{
        const file = await SSR.downloadFile(req.body)
        
        res.sendFile(file)
    }catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
})

app.listen(process.env.PORT, () => {
    console.log(`listening at: https://localhost:${process.env.PORT}`)
})
