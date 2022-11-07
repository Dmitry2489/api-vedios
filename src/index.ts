import express, {Request, Response} from 'express'
// import bodyParser from "body-parser";

import {addDays, isValid} from 'date-fns'

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
    minAgeRestriction: number | null | boolean;
    createdAt: string;
    publicationDate: string;
    availableResolutions: Array<string>;
}

type errorsType = {
    message: string,
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

const resolutionValid = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']

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


    if (!titleVideo || titleVideo === null) {
        errors.push(
            {
                message: "Title is required",
                field: "title"
            }
        )
    }

    if (titleVideo != null && titleVideo.length > 40) {
        errors.push(
            {
                message: "Title should is maximum length 40 characters",
                field: "title"
            }
        )
    }

    if (!authorVideo || authorVideo === null) {
        errors.push(
            {
                message: "Author is required",
                field: "author"
            }
        )
    }

    if (authorVideo != null && authorVideo.length > 20) {
        errors.push(
            {
                message: "Author should is maximum length 20 characters",
                field: "author"
            }
        )
    }

    // availableResolutions instanceof Array
    if (!Array.isArray(availableResolutions)) {
        errors.push(
            {
                message: "Available Resolutions not valid ",
                field: "availableResolutions"
            }
        )
    }

    if (availableResolutions.length > 8) {
        errors.push(
            {
                message: "Available Resolutions should is maximum length 8 ",
                field: "availableResolutions"
            }
        )
    }

    let availableResolutionExamination: Array<string> = [];

    availableResolutions.map((av: string) => {
        resolutionValid.map(rv => {
            if (rv === av) {
                availableResolutionExamination.push(av)
            }
        })
    })

    if (availableResolutionExamination.length != availableResolutions.length) {
        errors.push(
            {
                message: "Available Resolutions not valid ",
                field: "availableResolutions"
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
        availableResolutions: availableResolutionExamination
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
    const minAgeRestrictionVideo = +req.body.minAgeRestriction;
    let minAgeRestrictionVideoRes = false;
    const publicationDateVideo = req.body.publicationDate != null ? req.body.publicationDate.trim() : null
    const publicationDateVideoValid = publicationDateVideo?.match('\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d\\.\\d+([+-][0-2]\\d:[0-5]\\d|Z)');
    let errors: Array<errorsType> = []
    // const dateNow = new Date()

    console.log(isValid(publicationDateVideo))

    // const datePlusDay = addDays(dateNow, 1)

    if (!titleVideo || titleVideo === null) {
        errors.push(
            {
                message: "Title is required",
                field: "title"
            }
        )
    }

    if (titleVideo != null && titleVideo.length > 40) {
        errors.push(
            {
                message: "Title should is maximum length 40 characters",
                field: "title"
            }
        )
    }

    if (!authorVideo || authorVideo === null) {
        errors.push(
            {
                message: "Author is required",
                field: "author"
            }
        )
    }

    if (authorVideo != null && authorVideo.length > 20) {
        errors.push(
            {
                message: "Author should is maximum length 20 characters",
                field: "author"
            }
        )
    }

    if (minAgeRestrictionVideo <= 18 && minAgeRestrictionVideo != 0) {
        minAgeRestrictionVideoRes = true
    }

    if (!minAgeRestrictionVideoRes) {
        errors.push(
            {
                message: "minAgeRestriction should is minimum 1 and maximum 18",
                field: "minAgeRestriction"
            }
        )
    }

    if (!Array.isArray(availableResolutionsVideo)) {
        errors.push(
            {
                message: "Available Resolutions not valid",
                field: "availableResolutions"
            }
        )
    }

    let availableResolutionExamination: Array<string> = [];

    availableResolutionsVideo.map((av: string) => {
        resolutionValid.map(rv => {
            if (rv === av) {

                availableResolutionExamination.push(av)
            }
        })
    })

    const isBoolean = (val: any) => {
        return val === false || val === true;
    }

    // console.log(!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(publicationDateVideo))

    if (publicationDateVideoValid === null || publicationDateVideoValid.length < 1) {
        errors.push(
            {
                "message": "publicationDate should /\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}.\\d{3}Z/",
                "field": "publicationDate"
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

    if (!publicationDateVideo) {
        errors.push(
            {
                "message": "publicationDateVideo is required",
                "field": "publicationDateVideo"
            }
        )
    }

    if (publicationDateVideoValid != null && publicationDateVideoValid.length < 1) {
        errors.push(
            {
                "message": "publicationDateVideo should 2022-10-26T06:15:07.132Z",
                "field": "publicationDateVideo"
            }
        )
    }


    if (!isBoolean(canBeDownloadedVideo)) {
        errors.push(
            {
                message: "canBeDownloaded not boolean type ",
                field: "canBeDownloaded"
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

    const findVideo = videosData.find(v => v.id === id);

    if (!findVideo) {
        res.sendStatus(404);
        return;
    } else {
        findVideo.title = titleVideo;
        findVideo.author = authorVideo;
        findVideo.minAgeRestriction = minAgeRestrictionVideoRes;
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
