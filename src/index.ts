import express, {Request, Response} from 'express'
// import bodyParser from "body-parser";

import { addDays } from 'date-fns'

const app = express()
const port = process.env.PORT || 5000

// const parserMiddleware = bodyParser({})
const parserMiddleware = express.json({})
app.use(parserMiddleware)

interface VideosDataType {
    id: number;
    title: string;
    author: string;
    canBeDownloaded: boolean,
    minAgeRestriction: number | null;
    createdAt: string;
    publicationDate: string;
    availableResolutions: Array<string>;
}

type errorsType = {
    message:string,
    field: string
}

let videosData: VideosDataType[] = [
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
    res.send('Hello World!!! Dima')
})

app.get('/videos', (req: Request, res: Response) => {
    res.send(videosData);
});

app.post('/videos', (req: Request, res: Response) => {
    console.log(req.body.title)
    const titleVideo = req.body.title
    const authorVideo = req.body.author;
    const availableResolutions = req.body.availableResolutions
    let errors: Array<errorsType> = []

    if (!req.body.title) {
        errors.push(
            {
                "message": "Title is required",
                "field": "title"
            }
        )
    }

    if (req.body.title.length > 40) {
        errors.push(
            {
                "message": "Title should is maximum length 40 characters",
                "field": "title"
            }
        )
    }

    if (!req.body.author) {
        errors.push(
            {
                "message": "Author is required",
                "field": "title"
            }
        )
    }

    if (req.body.author.length > 20) {
        errors.push(
            {
                "message": "Author should is maximum length 40 characters",
                "field": "title"
            }
        )
    }

    if (errors.length >= 1) {
        res.status(400).json(
            {
                "errorsMessages": errors
            }
        )
        return;
    }

    //2022-10-12T18:42:54.655Z
    const dateNow = new Date()
    // +new Date() = 123123213
    // const datePlusDay = new Date(+dateNow + (1000 * 60 * 60 * 24))
    const datePlusDay = addDays(dateNow, 1)

    const newVideo = {
        id: +dateNow,
        title: titleVideo,
        author: authorVideo,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: dateNow.toISOString(),
        publicationDate: datePlusDay.toISOString(),
        availableResolutions: availableResolutions
    };

    videosData.push(newVideo);
    res.status(201).send(newVideo);
});

app.get('/videos/:videoId', (req: Request, res) => {
    const id = +req.params.videoId;
    const video = videosData.find(v => v.id === id);

    if (!video) {
        res.sendStatus(404);
        return;
    }

    res.status(200).send(video);
});

app.put('/videos/:videoId', (req, res) => {
    const id = +req.params.videoId;
    const titleVideo = req.body.title
    const authorVideo = req.body.author;
    const availableResolutionsVideo = req.body.availableResolutions;
    const canBeDownloadedVideo = req.body.canBeDownloaded;
    const minAgeRestrictionVideo = req.body.minAgeRestriction;
    const publicationDateVideo = req.body.publicationDate;

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

    if (req.body.title.length > 40) {
        res.status(400).json({
            "errorsMessages": [
                {
                    "message": "Title should is maximum length 40 characters",
                    "field": "title"
                }
            ],
        });
        return;
    }

    if (!req.body.author) {
        res.status(400).json({
            "errorsMessages": [
                {
                    "message": "Author is required",
                    "field": "title"
                }
            ],
        });
        return;
    }

    if (req.body.author.length > 20) {
        res.status(400).json({
            "errorsMessages": [
                {
                    "message": "Author should is maximum length 40 characters",
                    "field": "title"
                }
            ],
        });
        return;
    }


    const findVideo = videosData.find(v => v.id === id);

    if (!findVideo) {
            res.sendStatus(404);
            return;
    } else {
        findVideo.title = titleVideo;
        findVideo.author = authorVideo;
        findVideo.minAgeRestriction = availableResolutionsVideo;
        findVideo.canBeDownloaded = canBeDownloadedVideo;
        findVideo.minAgeRestriction = minAgeRestrictionVideo;
        findVideo.publicationDate = publicationDateVideo;

        res.status(204).send(findVideo);
        return;
    }

    // if (!video) {
    //     res.sendStatus(404);
    //     return;
    // }
    //
    // res.status(204).send(video);
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
    videosData = videosData.splice(0, -1);

    if (videosData.length === 0) {
        res.sendStatus(204);
        return;
    }
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
