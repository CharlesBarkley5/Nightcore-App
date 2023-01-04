const fs = require("fs");
const ytdl = require("ytdl-core");
const express = require("express");
const connectDB = require("./config/db");
var path = require("path");
const cors = require("cors");

const app = express();

var http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

var clientGlob = null;

getAudio = (videoURL, res) => {
  console.log(videoURL);
  var stream = ytdl(videoURL, {
    quality: "highestaudio",
    filter: "audioonly",
  })
    .on("progress", (chunkSize, downloadedChunk, totalChunk) => {
      // console.log(downloadedChunk);
      clientGlob.emit("progressEventSocket", [
        (downloadedChunk * 100) / totalChunk,
      ]);
      clientGlob.emit("downloadCompletedServer", [downloadedChunk]);
      if (downloadedChunk == totalChunk) {
        console.log("Downloaded");
      }
    })
    .pipe(res);

  ytdl.getInfo(videoURL).then((info) => {
    console.log("title:", info.videoDetails.title);
    console.log("rating:", info.player_response.videoDetails.averageRating);
    console.log("uploaded by:", info.videoDetails.author.name);
    clientGlob.emit("videoDetails", [
      info.videoDetails.title,
      info.videoDetails.author.name,
    ]);
  });
};

// routes
const entries = require("./api/entries");

//Connect Database
connectDB();

// cors
app.use(cors({ origin: true, credentials: true }));

// Init Middleware
app.use(express.json({ extended: false }));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Hello world!"));

//socket.io connection
io.on("connection", (client) => {
  clientGlob = client;
  console.log("User connected");
});

//root handler that sends the parameters to getAudio function
app.post("/", (req, res) => {
  getAudio(req.body.url, res);
});

// use Routes
app.use("/api/entries", entries);

const port = process.env.PORT || 8082;

http.listen(port, () => console.log(`Server running on port ${port}`));
