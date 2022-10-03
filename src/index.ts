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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})