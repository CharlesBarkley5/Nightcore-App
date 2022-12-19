import Section from "./components/Section";
import Input from "./components/Input";
import Bar from "./components/Bar";
import { Navbar } from "react-bootstrap";
import { useState, useEffect } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import Slider from "@mui/material/Slider";
import * as Tone from 'tone'

function App() {
  const [linkInput, setLinkInput] = useState(true);
  const [status, setStatus] = useState(0);
  const [speed, setSpeed] = useState(100);
  const [detune, setDetune] = useState(0);

  function inputChangeHandler(event) {
    setLinkInput(!linkInput);
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
                }}
              >
                Download song from Youtube link
              </p>
              <input
                type="radio"
                value="link"
                name="input"
                style={{
                  display: "inline",
                  marginLeft: "auto",
                  marginRight: "100px",
                }}
                checked={linkInput === true}
                onChange={inputChangeHandler}
              />
            </div>
            <br />
            <div style={{ display: "flex", margin: "auto", padding: "5px" }}>
              <p
                style={{
                  display: "inline",
                  margin: "auto",
                  fontWeight: "bold",
                }}
              >
                Upload audio file
              </p>
              <input
                type="radio"
                value="file"
                name="input"
                style={{
                  display: "inline",
                  marginLeft: "auto",
                  marginRight: "100px",
                }}
                checked={linkInput === false}
                onChange={inputChangeHandler}
              />
            </div>
          </form>
        </Section>
        <br></br>
        <Section width="500px">
          <Input linkInput={linkInput} />
        </Section>
        <br></br>
        <Section width="500px" height="50px">
          <div style={{ textAlign: "center" }}>
            <Bar status={status} />
          </div>
        </Section>
        <br></br>
        <AudioPlayer style={{ width: "50rem", margin: "auto" }} src="" />
        <br></br>
        <Section width="500px">
          <div style={{padding: "30px", textAlign: "center", fontSize: "17px"}}>
            <p style={{fontWeight: "bold"}}>Audio Settings</p>
            <Slider sx={{color: "white"}}></Slider>
          </div>
        </Section>
      </div>
    </>
  );
}

export default App;