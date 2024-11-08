import {VideoDBType} from "../db/video-db-type";
import {Resolutions} from "../db/resolutions";

export type CreateVideoViewType = {
    title: string
    author: string
    availableResolutions?: Resolutions[] | null
}

export type UpdateVideoViewType = {
    title: string
    author: string
    availableResolutions?: Resolutions[] | null
    canBeDownloaded?: boolean
    minAgeRestriction?: number | null
    publicationDate?: string
}

export type ErrMessagesType = {
    message: string
    field: string
}

export type ErrorType = {
    errorsMessages: Array<ErrMessagesType>
}

export class VideoModel {
    static validatePost(video: VideoDBType): ErrorType[] {
        let errors: ErrorType[] = [];
        if (!video.title || video.title.length > 40 || !video.title.trim()) {
            errors.push({errorsMessages: [{message: "Title is required and must be a string.", field: 'title'}]});
        }

        if (!video.author || video.author.length > 20 || !video.author.trim()) {
            errors.push({errorsMessages: [{message: "Description is required and must be a string.", field: 'author'}]});
        }

        if (video.availableResolutions != null) {
            if (!Array.isArray(video.availableResolutions) || video.availableResolutions.length === 0) {
                errors.push({errorsMessages: [{message: "At least one resolution should be added", field: 'availableResolutions'}]});
            }
        }

        return errors;
    }

    static validatePut(video: VideoDBType): ErrorType[] {
        let errors: ErrorType[] = [];
        if (!video.title || video.title.length > 40 || !video.title.trim()) {
            errors.push({errorsMessages: [{message: "Title must be valid", field: 'title'}]});
        }

        if (!video.author || video.author.length > 20 || !video.author.trim()) {
            errors.push({errorsMessages: [{message: "Description is not valid", field: 'author'}]});
        }

        if (video.availableResolutions != null) {
            if (!Array.isArray(video.availableResolutions) || video.availableResolutions.length === 0 || video.availableResolutions.find(p => !Resolutions[p])) {
                errors.push({errorsMessages: [{message: "At least one resolution should be added", field: 'availableResolutions'}]});
            }
        }

        if (video.canBeDownloaded != null && typeof video.canBeDownloaded !== 'boolean') {
            errors.push({errorsMessages: [{message: "Value must be a boolean.", field: 'canBeDownloaded'}]});
        } else if (video.canBeDownloaded == null) {
            video.canBeDownloaded = false;
        }

        if (video.minAgeRestriction != null) {
            if (
                typeof video.minAgeRestriction !== 'number' ||
                video.minAgeRestriction < 1 ||
                video.minAgeRestriction > 18
            ) {
                errors.push({errorsMessages: [{message: "Value must be an integer between 1 and 18, or null", field: 'minAgeRestriction'}]});
            }
        }

        if (video.publicationDate) {
            const publicationDate = new Date(video.publicationDate);
            if (isNaN(publicationDate.getTime())) {
                errors.push({errorsMessages: [{message: "Value must be a valid date-time string.", field: 'publicationDate'}]});
            }
        }

        return errors;
    }

    static create(video: CreateVideoViewType): VideoDBType {
        const today = new Date();
        const tomorrow = new Date(today)
        tomorrow.setDate(today.getDate() + 1)

        const newVideo: VideoDBType = {
            id: +(new Date()),
            title: video.title,
            author: video.author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: today.toISOString(),
            publicationDate: tomorrow.toISOString(),
            availableResolutions: video.availableResolutions,
        }

        return newVideo;
    }

    static update(videoToUpdate: VideoDBType, videoUpdatedData: UpdateVideoViewType) {
        videoToUpdate.title = videoUpdatedData.title;
        videoToUpdate.author = videoUpdatedData.author;
        videoToUpdate.canBeDownloaded = videoUpdatedData.canBeDownloaded;
        videoToUpdate.minAgeRestriction =  videoUpdatedData.minAgeRestriction;
        videoToUpdate.publicationDate = videoUpdatedData.publicationDate;
        videoToUpdate.availableResolutions = videoUpdatedData.availableResolutions;
    }
}