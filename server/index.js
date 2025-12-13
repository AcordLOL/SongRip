import express from "express";
import dotenv from "dotenv";
import cors from "cors"

dotenv.config();

const app = express();
const port = 8010

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
        
        res.send('sup');
    }catch (e) {
        console.log('Error:', e);
        res.status(500).send('Internal Server Error when getting songs');
    }
})

app.listen(port, () => {
    `Server started on port ${port}`
})
