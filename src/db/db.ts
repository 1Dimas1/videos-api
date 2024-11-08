import {DBType} from "./db-type";
import {Resolutions} from "./resolutions";


export const db: DBType = {
    videos: [
        {
            id: 0,
            title: "string",
            author: "string",
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: "2024-11-06T20:18:45.543Z",
            publicationDate: "2024-11-06T20:18:45.543Z",
            availableResolutions:
                [Resolutions.P144]
        }
    ]
}

export const setDB = (dataset?: Partial<DBType>) => {
    if (!dataset) {
        db.videos = []
        return
    }

    db.videos = dataset.videos || db.videos
}