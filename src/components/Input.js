import { FilePond, File, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import key from "../private/ytApiKey";
import config from "../private/config";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  child,
  get,
  onValue,
  push,
  update,
} from "firebase/database";
import {
  getStorage,
  uploadBytes,
  ref as sRef,
  deleteObject,
  getDownloadURL,
} from "firebase/storage";

import axios from "axios";
import * as Tone from "tone";
import openSocket from "socket.io-client";

import { useState, useEffect } from "react";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
);

function Input(props) {
  const app = initializeApp(config);
  const database = getDatabase(app);
  const countRef = ref(database, "count");
  const storage = getStorage(app);

  const URL = "http://localhost:8082/";
  const socket = openSocket(URL);

  const [fileItem, setFileItem] = useState(null);
  const [link, setLink] = useState("");

  async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function errorStatus() {
    props.setPaused(true);
    if (props.linkInput) {
      props.setStatus(1);
    } else {
      props.setStatus(2);
    }
    await sleep(3000);
    await props.setStatus(0);
  }

  function YouTubeGetID(url) {
    url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return url[2] !== undefined ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
  }

  function handleLinkChange(event) {
    setLink(event.target.value);
  }

  async function getDuration(file) {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = (e) => {
      const ctx = new AudioContext();
      const audioArrayBuffer = e.target.result;
      ctx.decodeAudioData(
        audioArrayBuffer,
        (data) => {
          // this is the success callback
          const duration = data.duration;
          console.log("Audio file duration: " + duration);
          props.setDuration(duration);
        },
        (error) => {
          // this is the error callback
          console.error(error);
        }
      );
    };
  }

  async function loadNewAudio(s, n, t, f) {
    const storageRef = sRef(storage, s + "-" + n + ".mp3");
    getDownloadURL(storageRef).then((url) => {
      if (props.player) {
        props.player.stop();
      }
      const newPlayer = new Tone.Player(url).toDestination();
      newPlayer.autostart = false;
      props.setPlayer(newPlayer);
      console.log("url set: " + url);
      props.setPaused(true);
      props.setTime(0);
      props.setTitle(t);
      getDuration(f).then(() => {
        props.setStatus(3);
      });
    });
  }

  async function fileHandler(file, name) {
    if (file) {
      axios
        .post("http://localhost:8082/api/entries", {
          title: name,
          session: props.session,
          num: props.num,
        })
        .catch((err) => {
          errorStatus();
        });

      const storageRef = sRef(
        storage,
        props.session + "-" + props.num + ".mp3"
      );
      const metadata = {
        contentType: "audio/mpeg",
      };
      await uploadBytes(storageRef, file, metadata).then(() => {
        console.log("Uploaded a blob or file!");
      });
      props.setNum(props.num + 1);
      await loadNewAudio(props.session, props.num, name, file);
    } else {
      errorStatus();
    }
  }

  function goHandler() {
    var file;
    var name;
    if (props.linkInput) {
      axios
        .post(
          URL,
          { url: link },
          {
            responseType: "blob",
          }
        )
        .catch((err) => {
          errorStatus();
        })
        .then((response) => {
          file = new Blob([response.data]);
          const id = YouTubeGetID(link);
          fetch(
            "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" +
              id.toString() +
              "&key=" +
              key
          )
            .then((res) => res.json())
            .then((data) => {
              console.log("id: : " + id);
              fileHandler(file, data.items[0].snippet.title);
            });
        });
    } else {
      if (fileItem) {
        file = fileItem.file;
        name = fileItem.filename.split(".").slice(0, -1).join(".");
        fileHandler(file, name);
      } else {
        errorStatus();
      }
    }
  }

  if (props.linkInput) {
    return (
      <>
        <br></br> <br></br>
        <div style={{ textAlign: "center", padding: "10px" }}>
          <div style={{ height: "30px" }}>
            <form>
              <label>
                <input
                  type="text"
                  name="link"
                  placeholder="Paste link here"
                  style={{ fontSize: "20px", fontFamily: "Poppins" }}
                  onChange={(e) => handleLinkChange(e)}
                />
              </label>
            </form>
          </div>
          <br></br>
          <br></br>
          <button
            style={{ margin: "10px", width: "80px", height: "50px" }}
            onClick={goHandler}
          >
            <p style={{ margin: "auto", fontSize: "22px", fontWeight: "bold" }}>
              Go
            </p>
          </button>
        </div>
      </>
    );
  } else {
    return (
      <div style={{ textAlign: "center", padding: "10px" }}>
        <div style={{ height: "94px" }}>
          <FilePond
            onupdatefiles={(fileItems) => setFileItem(fileItems[0])}
            allowMultiple={false}
            acceptedFileTypes={["audio/*"]}
          />
        </div>
        <button
          style={{ margin: "10px", width: "80px", height: "50px" }}
          onClick={goHandler}
        >
          <p style={{ margin: "auto", fontSize: "22px", fontWeight: "bold" }}>
            Go
          </p>
        </button>
      </div>
    );
  }
}

export default Input;
