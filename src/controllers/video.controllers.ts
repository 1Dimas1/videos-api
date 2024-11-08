import {Request, Response} from 'express'
import {db} from "../db/db";
import {SETTINGS} from "../settings";
import {ErrorType, VideoModel} from "../models/video.model";
import {VideoDBType} from "../db/video-db-type";


export const getVideos = (req: Request, res: Response) => {
    const videos = db.videos

    res
        .status(SETTINGS.HTTP_CODES.HTTP_200)
        .json(videos)
};

export const getVideoById = (req: Request, res: Response) => {
    const video = db.videos.find(v => v.id === +req.params.id);
    if (!video) {
        res.sendStatus(SETTINGS.HTTP_CODES.HTTP_404);
        return;
    }

    res.json(video);
    return;
};

export const createVideo = (req: Request, res: Response) => {
    const errors: ErrorType[] = VideoModel.validatePost(req.body);
    if (errors.length > 0) {
        const firstOccuredError: ErrorType = errors[0];
        res.status(SETTINGS.HTTP_CODES.HTTP_400).json(firstOccuredError);
        return;
    }
    const  newVideo: VideoDBType = VideoModel.create(req.body);
    db.videos.push(newVideo);
    res.status(SETTINGS.HTTP_CODES.HTTP_201).json(newVideo);
    return;
};

export const updateVideo = (req: Request, res: Response) => {
    const video: VideoDBType | undefined = db.videos.find(v => v.id === +req.params.id);
    if (!video) {
        res.sendStatus(SETTINGS.HTTP_CODES.HTTP_404);
        return;
    }

    const errors: ErrorType[] = VideoModel.validatePut(req.body);
    if (errors.length > 0) {
        const firstOccuredError: ErrorType = errors[0];
        res.status(SETTINGS.HTTP_CODES.HTTP_400).json(firstOccuredError);
        return;
    }

    VideoModel.update(video, req.body);

    res.sendStatus(SETTINGS.HTTP_CODES.HTTP_204);
};

export const deleteVideo = (req: Request, res: Response) => {
    const index = db.videos.findIndex(v => v.id === +req.params.id);
    if (index === -1) {
        res.sendStatus(SETTINGS.HTTP_CODES.HTTP_404);
        return;
    }

    db.videos.splice(index, 1);
    res.sendStatus(SETTINGS.HTTP_CODES.HTTP_204);
};

export const deleteAllVideos = (req: Request, res: Response) => {
    db.videos = []
    res.sendStatus(SETTINGS.HTTP_CODES.HTTP_204)
};
