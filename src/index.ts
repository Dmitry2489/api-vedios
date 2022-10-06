import express, {Request, Response} from 'express'

const app = express()
const port = process.env.PORT || 5000

const videosData = [
    {
        id: 0,
        title: "string",
        author: "string",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2022-10-03T17:50:20.179Z",
        publicationDate: "2022-10-03T17:50:20.179Z",
        availableResolutions: [
            "P144"
        ]
    }
]

app.get('/videos', (req: Request, res: Response) => {
    res.send(videosData)
})

app.post('/videos', (req: Request, res: Response) => {
    const titleVideo = req.body.title
    const authorVideo = req.body.author
    const availableResolutions = req.body.availableResolutions

    if (!req.body.title || req.body.title == null) {
        res.status(400).json(
            {
                "errorsMessages": [
                    {
                        "message": "Title is required",
                        "field": "title"
                    }
                ],
            }
        )
        return
    }

    const newVideo = {
        id: +(new Date()),
        title: titleVideo,
        author: "string",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: String(new Date()),
        publicationDate: String(new Date()),
        availableResolutions: [
            "P144"
        ]
    }
    videosData.push(newVideo)
    return newVideo;
})

app.get('/videos/:videoId', (req: Request, res: Response) => {
    const id = +req.params.videoId

    const video = videosData.find(v => v.id === id)

    if (!video) {
        res.sendStatus(404)
    }

    res.status(201).send(video)
})

app.delete('/videos/:videoId', (req: Request, res: Response) => {
    const id = +req.params.videoId

    const index = videosData.findIndex(v => v.id === id)


    if (index === -1) {
        res.sendStatus(404)
    } else {
        videosData.splice(index, 1)
        res.sendStatus(204)
    }
})

app.delete('/testing/all-data', (req: Request, res: Response) => {

    const index = videosData.splice(0, -1)


    if (index.length === 0) {
        res.sendStatus(204)
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})