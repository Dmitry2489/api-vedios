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
];

app.get('/', (req: Request, res: Response) => {
    res.send(videosData);
});

app.post('/videos', (req: Request, res: Response) => {
    const titleVideo = req.body.title;
    const authorVideo = req.body.author;
    const availableResolutions = req.body.availableResolutions;

    if (!req.body.title) {
        res.status(400).json({
            "errorsMessages": [
                {
                    "message": "Title is required",
                    "field": "title"
                }
            ],
        });
        return;
    }

    const newVideo = {
        id: +(new Date()),
        title: titleVideo,
        author: authorVideo,
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: String(new Date()),
        publicationDate: new Date().toISOString(),
        availableResolutions: availableResolutions
    };

    videosData.push(newVideo);
    return newVideo;
});

app.get('/videos/:videoId', (req, res) => {
    const id = +req.params.videoId;
    const video = videosData.find(v => v.id === id);

    if (!video) {
        res.sendStatus(404);
        return;
    }

    res.status(201).send(video);
});
app.delete('/videos/:videoId', (req, res) => {
    const id = +req.params.videoId;
    const index = videosData.findIndex(v => v.id === id);

    if (index === -1) {
        res.sendStatus(404);
        return;
    } else {
        videosData.splice(index, 1);
        res.sendStatus(204);
        return;
    }
});

app.delete('/testing/all-data', (req, res) => {
    const index = videosData.splice(0, -1);

    if (index.length === 0) {
        res.sendStatus(204);
        return;
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});