import {req} from './test.helpers'
import {SETTINGS} from '../src/settings'
import {setDB} from "../src/db/db";
import {dataset1, video1} from "./datasets";
import {VideoDBType} from "../src/db/video-db-type";
import {response} from "express";
import videoRoutes from "../src/routes/video.routes";

describe('/videos', () => {
    beforeEach(async () => {
        await req.delete(SETTINGS.PATH.TESTING.concat('/all-data')).expect(204)
    })

    it('GET videos = []', async () => {

        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(SETTINGS.HTTP_CODES.HTTP_200)

        console.log(res.body)

        expect(res.body.length).toBe(0)
    })
    it('GET videos = dataset1', async () => {
        setDB(dataset1)

        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(SETTINGS.HTTP_CODES.HTTP_200)

        console.log(res.body)

        expect(res.body.length).toBe(1)
        expect(res.body[0]).toEqual(dataset1.videos[0])
    })

    it('- POST does not create the video with incorrect data (no title, no author, no resolutions)', async () => {
        await req
            .post(SETTINGS.PATH.VIDEOS)
            .send({title: '', author: '', availableResolutions: ''})
            .expect(SETTINGS.HTTP_CODES.HTTP_400, {
                errorsMessages: [
                    {message: "Title is required and must be a string.", field: 'title'},
                    {message: "Author is required and must be valid.", field: 'author'},
                    {message: "At least one resolution should be added", field: 'availableResolutions'}
                ]
            })

        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
        expect(res.body).toEqual([])
    })
    it('- POST create the video with incorrect data (title with > 40 length, author with > 20 length, empty resolutions array)', async () => {
        await req
            .post(SETTINGS.PATH.VIDEOS)
            .send({title: 'TitleWithExceededLegth.bbaaeeeeerrrrtttggghhyu', author: 'AuthorWithExceededLegth.bbaaeeeeerrrrtttggghhyu', availableResolutions: []})
            .expect(SETTINGS.HTTP_CODES.HTTP_400, {
                errorsMessages: [
                    {message: "Title is required and must be a string.", field: 'title'},
                    {message: "Author is required and must be valid.", field: 'author'},
                    {message: "At least one resolution should be added", field: 'availableResolutions'}
                ]
            })

        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
        expect(res.body).toEqual([])
    })
    it('- POST create the video with incorrect data (blank title, blank author, wrong resolution)', async () => {
        await req
            .post(SETTINGS.PATH.VIDEOS)
            .send({title: ' ', author: ' ', availableResolutions: ['P123']})
            .expect(SETTINGS.HTTP_CODES.HTTP_400, {
                errorsMessages: [
                    {message: "Title is required and must be a string.", field: 'title'},
                    {message: "Author is required and must be valid.", field: 'author'},
                    {message: "At least one resolution should be added", field: 'availableResolutions'}
                ]
            })

        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
        expect(res.body).toEqual([])
    })
    it('+ POST create the video with correct data', async () => {
        const videoData = {title: 'Some Title', author: 'Napoleon', availableResolutions: ['P720']}
        await req
            .post(SETTINGS.PATH.VIDEOS)
            .send(videoData)
            .expect(SETTINGS.HTTP_CODES.HTTP_201)

        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
        expect(res.body[0].title).toEqual(videoData.title)
        expect(res.body[0].author).toEqual(videoData.author)
        expect(res.body[0].availableResolutions).toEqual(videoData.availableResolutions)
    })
    it('- GET video by ID with incorrect ID', async () => {
        setDB(dataset1)

        const res = await req
            .get(SETTINGS.PATH.VIDEOS.concat('/123'))
            .expect(SETTINGS.HTTP_CODES.HTTP_404)
    })
    it('+ GET video by ID with correct ID', async () => {
        setDB(dataset1)
        const video:VideoDBType = dataset1.videos[0]

        await req
            .get(SETTINGS.PATH.VIDEOS + '/' + video.id)
            .expect(SETTINGS.HTTP_CODES.HTTP_200, video)
    })
    it('- PUT video by ID with incorrect ID', async () => {
        setDB(dataset1)

        await req
            .put(SETTINGS.PATH.VIDEOS + 123)
            .send({title: 'title', author: 'author'})
            .expect(SETTINGS.HTTP_CODES.HTTP_404)

        const res = await req.get(SETTINGS.PATH.VIDEOS)
        expect(res.body).toEqual(dataset1.videos)
    })
    it('- PUT video by ID with incorrect data', async () => {
        setDB(dataset1)
        const video: VideoDBType = dataset1.videos[0]

        await req
            .put(SETTINGS.PATH.VIDEOS + '/' + video.id)
            .send({
                title: 'New Title',
                author: 'New Author',
                availableResolutions: ['P144'],
                canBeDownloaded: 'not boolean',
                minAgeRestriction: 20,
                publicationDate: '1995'
            })
            .expect(SETTINGS.HTTP_CODES.HTTP_400, {
                errorsMessages: [
                    {message: "Value must be a boolean.", field: 'canBeDownloaded'},
                    {message: "Value must be an integer between 1 and 18, or null", field: 'minAgeRestriction'},
                    {message: "Value must be a valid date-time string.", field: 'publicationDate'},
                ]
            })

        const res = await req.get(SETTINGS.PATH.VIDEOS)
        expect(res.body[0]).toEqual({
            ...video,
        })
    })
    it('+ PUT video by ID with correct data', async () => {
        setDB(dataset1)
        const video: VideoDBType = dataset1.videos[0]

        await req
            .put(SETTINGS.PATH.VIDEOS + '/' + video.id)
            .send({
                title: 'New Title',
                author: 'New Author',
                canBeDownloaded: false,
                minAgeRestriction: 18,
                publicationDate: '2024-01-12T08:12:39.261Z',
                availableResolutions: ['P144']
            })
            .expect(SETTINGS.HTTP_CODES.HTTP_204)

        const res = await req.get(SETTINGS.PATH.VIDEOS)
        expect(res.body[0]).toEqual({
            ...video,
            title: 'New Title',
            author: 'New Author',
            canBeDownloaded: false,
            minAgeRestriction: 18,
            publicationDate: '2024-01-12T08:12:39.261Z',
            availableResolutions: ['P144']
        })
        console.log(res.body[0])
    })
    it('- DELETE video by ID with incorrect ID', async () => {
        setDB(dataset1)

        await req
            .delete(SETTINGS.PATH.VIDEOS + 123)
            .expect(SETTINGS.HTTP_CODES.HTTP_404)

        const res = await req.get(SETTINGS.PATH.VIDEOS)
        expect(res.body).toEqual(dataset1.videos)
    })
    it('+ DELETE video by ID with correct ID', async () => {
        setDB(dataset1)
        const video: VideoDBType = dataset1.videos[0]

        await req
            .delete(SETTINGS.PATH.VIDEOS + '/' + video.id)
            .expect(SETTINGS.HTTP_CODES.HTTP_204)

        const res = await req.get(SETTINGS.PATH.VIDEOS)
        expect(res.body.length).toBe(0)

    })
})