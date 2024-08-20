import express from 'express';
import ffmpeg from "fluent-ffmpeg";

const app = express();
// middleware - automatically parses Json in request body
app.use(express.json());


// recieve video and using ffmpeg convert it to lower quality for posting
app.post('/process-video', (req, res) => {
   
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    if(!inputFilePath || !outputFilePath) {
        return res.status(400).send("Missing file path");
    }

    ffmpeg(inputFilePath).outputOptions("-vf", "scale=-1:360")
    .on("end", () => {
        res.status(200).send("Processing successful");
    }).on("error", (err) => {
        console.error(err);
        res.status(500).send("internal error: " + err.message);
    }).save(outputFilePath);
});

// flexibility so port can be set by host
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

