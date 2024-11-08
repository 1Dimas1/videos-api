import express from 'express'
import cors from 'cors'
import videosRouter from "./routes/video.routes";
import {SETTINGS} from "./settings";

export const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.status(200).json({version: '1.0'})
})
app.use(SETTINGS.PATH.VIDEOS, videosRouter)

app.use(SETTINGS.PATH.TESTING, videosRouter)