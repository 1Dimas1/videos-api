import {DBType} from "./db-type";
import {Resolutions} from "./resolutions";


export const db: DBType = {
    videos: []
}

export const setDB = (dataset?: Partial<DBType>) => {
    if (!dataset) {
        db.videos = []
        return
    }

    db.videos = dataset.videos || db.videos
}