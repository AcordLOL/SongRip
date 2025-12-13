import express from "express";
import cors from "cors"

import SSR from "./scripts/server-songrip.js"

const app = express();
const port = process.env.PORT || 8010;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ["https://song-rip.vercel.app", `http://localhost:${port}`]
}))

app.get("/", (req, res) => {
    res.send("So... You want songs don't you?");
})

app.get("/getsongs/:type/:id", async(req, res) => {
    try {
        const type = req.params.type;
        const id = req.params.id;
        
        res.send(await SSR.getSongs(id, type));
    }catch (e) {
        console.error('Error in getting songs:', e)
        res.status(500).send('Internal Server Error When Getting Songs');
    }
});

app.post("/download/:song_name", async(req, res) => {
    try{
        res.sendFile(await SSR.downloadFile(req.body))
    }catch (e) {
        console.error('Error in downloading:', e)
        res.status(500).send('Internal Server Error When Downloading Songs')
    }
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})
