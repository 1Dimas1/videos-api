import {config} from 'dotenv'
config()

export const SETTINGS = {
    HTTP_CODES: {
        HTTP_200: 200,
        HTTP_201: 201,
        HTTP_204: 204,
        HTTP_400: 400,
        HTTP_404: 404
    },
    PATH: {
        VIDEOS: '/videos',
        TESTING: '/testing'
    },
    PORT: process.env.PORT || 3003
}