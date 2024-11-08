import { Router } from 'express';
import {createVideo, deleteVideo, getVideoById, getVideos, updateVideo} from "../controllers/video.controllers";

const videosRouter = Router();

videosRouter.get('/', getVideos);
videosRouter.get('/:id', getVideoById);
videosRouter.post('/', createVideo);
videosRouter.put('/:id', updateVideo);
videosRouter.delete('/:id', deleteVideo);

export default videosRouter;