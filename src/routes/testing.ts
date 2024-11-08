import {Router} from 'express';
import {deleteAllVideos} from "../controllers/video.controllers";


const testingRouter = Router();

testingRouter.delete('/all-data', deleteAllVideos);

export default testingRouter;