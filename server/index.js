import express from "express";

const app = express();

const port = 8010

app.get("/", (req, res) => {
    res.send("So... You want songs don't you?");
})

app.listen(port, () => {
    `Server started on port ${port}`
})