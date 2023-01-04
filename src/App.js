import Section from "./components/Section";
import Input from "./components/Input";
import Bar from "./components/Bar";
import { Navbar } from "react-bootstrap";
import { useState, useEffect } from "react";
import classes from "./App.module.css";

import Switch from "@mui/material/Switch";
import "react-h5-audio-player/lib/styles.css";
import Slider from "@mui/material/Slider";

import { IconContext } from "react-icons";
import { TbRepeat } from "react-icons/tb";
import { TbRepeatOff } from "react-icons/tb";
import { TbPlayerPlay } from "react-icons/tb";
import { TbPlayerPause } from "react-icons/tb";
import { TbVolume } from "react-icons/tb";
import { TbVolume2 } from "react-icons/tb";
import { TbVolume3 } from "react-icons/tb";
import { TbList } from "react-icons/tb";
import { TbDownload } from "react-icons/tb";
import { VscDebugRestart } from "react-icons/vsc";
import { AiFillBackward } from "react-icons/ai";
import { AiFillForward } from "react-icons/ai";

import config from "./private/config";
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
} from "firebase/storage";

import * as Tone from "tone";

import axios from "axios";

function App() {
  const app = initializeApp(config);
  const database = getDatabase(app);
  const countRef = ref(database, "count");
  const storage = getStorage(app);
  let updates = {};

  let [linkInput, setLinkInput] = useState(true);
  let [status, setStatus] = useState(0);
  let [speed, setSpeed] = useState(100);
  let [pitch, setPitch] = useState(0);
  let [player, setPlayer] = useState(null);

  let [time, setTime] = useState(0);
  let [duration, setDuration] = useState(0);
  let [loopOn, setLoopOn] = useState(true);
  let [paused, setPaused] = useState(true);
  let [volume, setVolume] = useState(0);

  let [session, setSession] = useState(0);
  let [num, setNum] = useState(0);
  let [title, setTitle] = useState("");

  useEffect(() => {
    get(countRef, "count")
      .then((snapshot) => {
        setSession(snapshot.val());
        updates["count"] = snapshot.val() + 1;
        update(ref(database), updates);
      })
      .catch((error) => {
        console.error(error);
      });
    /*
    return () => {
      for (var curr = 0; curr < num; curr++) {
        var storageRef = sRef(storage, session + "-" + curr + ".mp3");
        deleteObject(storageRef)
          .then(() => {
            // File deleted successfully
          })
          .catch((error) => {
            console.log(error);
          });
      }
    };
    */
  }, []);

  useEffect(() => {
    const executeOnClose = () => {};

    window.addEventListener("beforeunload", executeOnClose);

    return () => {
      window.removeEventListener("beforeunload", executeOnClose);
    };
  }, [session, num]);

  function inputChangeHandler() {
    setLinkInput(!linkInput);
  }

  function restart() {}

  function rewind() {}

  function backward() {}

  function forward() {}

  function pauseOrPlay() {
    if (status === 3) {
      console.log("player in function: " + player);
      if (paused) {
        setPaused(false);
        player.start();
      } else {
        setPaused(true);
        player.stop();
      }
    }
  }

  function download() {}

  function changeVolume(event) {
    setVolume(event.target.value);
  }

  function changeSpeed(event) {
    setSpeed(event.target.value);
  }

  function changePitch(event) {
    setPitch(event.target.value);
  }

  return (
    <>
      <Navbar
        stick="top"
        style={{ backgroundColor: "#182c61", textAlign: "center" }}
      >
        <h1 style={{ padding: "10px", fontWeight: "bold", fontSize: "20px" }}>
          Youtube to Nightcore - Input any Youtube link or audio file
        </h1>
      </Navbar>
      <br></br>
      <div>
        <Section width="500px">
          <form>
            <div
              style={{
                display: "flex",
                padding: "5px",
              }}
            >
              <p
                style={{
                  display: "inline",
                  margin: "auto",
                  fontWeight: "bold",
                  color: linkInput ? "white" : "#B4B4B4",
                }}
              >
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Download song from Youtube
                link
              </p>
              <Switch
                color="default"
                className={classes.switch}
                onChange={inputChangeHandler}
              ></Switch>
            </div>
            <br />
            <div
              style={{ display: "flex", padding: "15px", textAlign: "justify" }}
            >
              <p
                style={{
                  display: "inline",
                  margin: "auto",
                  fontWeight: "bold",
                  color: linkInput ? "#B4B4B4" : "white",
                }}
              >
                Upload audio file
              </p>
            </div>
          </form>
        </Section>
        <br></br>
        <Section width="500px" height="180px">
          <Input
            linkInput={linkInput}
            session={session}
            setSession={setSession}
            num={num}
            setNum={setNum}
            title={title}
            setTitle={setTitle}
            status={status}
            setStatus={setStatus}
            player={player}
            setPlayer={setPlayer}
            duration={duration}
            setDuration={setDuration}
            time={time}
            setTime={setTime}
            paused={paused}
            setPaused={setPaused}
          />
        </Section>
        <br></br>
        <Section width="800px" height="50px">
          <div style={{ textAlign: "center" }}>
            <Bar status={status} title={title} />
          </div>
        </Section>
        <br></br>
        <Section width="800px">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: "12px",
              marginBottom: "10px",
            }}
          >
            {status == 3 ? (
              <p style={{ marginBottom: "0px" }}>
                {Math.floor(time / 60)}:
                {Math.floor(time % 60).toLocaleString(undefined, {
                  minimumIntegerDigits: 2,
                })}
              </p>
            ) : (
              <p style={{ marginBottom: "0px" }}>--:--</p>
            )}
            &nbsp; &nbsp; &nbsp;
            <Slider sx={{ color: "white", width: "630px" }} />
            &nbsp; &nbsp; &nbsp;
            {status == 3 ? (
              <p style={{ marginBottom: "0px" }}>
                {Math.floor(duration / 60)}:
                {Math.floor(duration % 60).toLocaleString(undefined, {
                  minimumIntegerDigits: 2,
                })}
              </p>
            ) : (
              <p style={{ marginBottom: "0px" }}>--:--</p>
            )}
          </div>
          <IconContext.Provider
            value={{
              size: 40,
            }}
          >
            <div style={{ display: "flex", paddingBottom: "7px" }}>
              {loopOn ? (
                <i
                  className={classes.changeColor}
                  onClick={() => {
                    setLoopOn(!loopOn);
                  }}
                >
                  <TbRepeat
                    style={{
                      marginLeft: "18px",
                    }}
                  />
                </i>
              ) : (
                <i
                  className={classes.changeColor}
                  onClick={() => {
                    setLoopOn(!loopOn);
                  }}
                >
                  <TbRepeatOff
                    style={{
                      marginLeft: "18px",
                    }}
                  />
                </i>
              )}
              <i className={classes.changeColor} onClick={restart}>
                <VscDebugRestart
                  style={{
                    marginLeft: "18px",
                  }}
                />
              </i>

              <div style={{ margin: "auto", marginLeft: "211px" }}>
                <i className={classes.changeColor} onClick={backward}>
                  <AiFillBackward style={{ marginTop: "-5px" }} size={50} />
                </i>
                {paused ? (
                  <i
                    className={classes.changeColor}
                    onClick={() => pauseOrPlay()}
                  >
                    <TbPlayerPlay style={{ marginTop: "-5px" }} size={50} />
                  </i>
                ) : (
                  <i
                    className={classes.changeColor}
                    onClick={() => pauseOrPlay()}
                  >
                    <TbPlayerPause style={{ marginTop: "-5px" }} size={50} />
                  </i>
                )}
                <i className={classes.changeColor} onClick={forward}>
                  <AiFillForward style={{ marginTop: "-5px" }} size={50} />
                </i>
              </div>
              <div
                style={{ display: "flex", margin: "left", marginRight: "10px" }}
              >
                {volume >= 0 ? (
                  <i
                    className={classes.changeColor}
                    onClick={() => setVolume(-10)}
                  >
                    <TbVolume />
                  </i>
                ) : volume > -10 ? (
                  <i
                    className={classes.changeColor}
                    onClick={() => setVolume(-10)}
                  >
                    <TbVolume2 />
                  </i>
                ) : (
                  <i className={classes.changeColor}>
                    <TbVolume3 />
                  </i>
                )}
                <Slider
                  sx={{
                    color: "white",
                    margin: "5px",
                    width: "120px",
                    scale: "0.8",
                  }}
                  value={volume}
                  min={-10}
                  max={10}
                  defaultValue={0}
                  onChange={changeVolume}
                />
                <i className={classes.changeColor}>
                  <TbDownload
                    style={{
                      marginRight: "5px",
                    }}
                  />
                </i>
              </div>
            </div>
          </IconContext.Provider>
        </Section>
        <br></br>
        <Section width="645px" height="260px">
          <div style={{ padding: "30px", fontSize: "17px" }}>
            <p style={{ fontWeight: "bold", marginBottom: "7px" }}>Speed</p>
            <div style={{ display: "flex" }}>
              <Slider
                sx={{
                  color: "white",
                  marginLeft: "7px",
                  marginBottom: "20px",
                  width: "425px",
                }}
                value={speed}
                min={25}
                max={200}
                defaultValue={100}
                onChange={changeSpeed}
              />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <div style={{ paddingTop: "6px" }}>
                <p>{speed}&nbsp;%</p>
              </div>
            </div>
            <p style={{ fontWeight: "bold", marginBottom: "7px" }}>Pitch</p>
            <div style={{ display: "flex" }}>
              <Slider
                sx={{ color: "white", marginLeft: "7px", width: "425px" }}
                value={pitch}
                min={-15}
                max={15}
                defaultValue={100}
                onChange={changePitch}
              />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <div style={{ paddingTop: "6px", display: "flex" }}>
                {pitch >= 0 ? (
                  <p>+{pitch}&nbsp;semitones</p>
                ) : (
                  <p>{pitch}&nbsp;semitones</p>
                )}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <button
                style={{ width: "100px", height: "50px" }}
                onClick={() => {
                  setSpeed(100);
                  setPitch(0);
                }}
              >
                <p
                  style={{
                    margin: "auto",
                    fontSize: "22px",
                    fontWeight: "bold",
                  }}
                >
                  Reset
                </p>
              </button>
            </div>
          </div>
        </Section>
      </div>
    </>
  );
}

export default App;
