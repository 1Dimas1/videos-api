import {Resolutions} from "./resolutions";

export type VideoDBType = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded?: boolean,
    minAgeRestriction?: number | null,
    createdAt: string,
    publicationDate?: string,
    availableResolutions?: Resolutions[] | null,
}