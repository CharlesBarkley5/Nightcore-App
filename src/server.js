const express = require("express");
const db = require("./config/db").default;
const cors = require("cors");

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());

// Route to get all sessions
app.get("/api/get", (req, res) => {
  db.query("SELECT * FROM sessions", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

// Route to get one session
app.get("/api/getFromId/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM sessions WHERE id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

// Route for creating the session
app.post("/api/create", (req, res) => {
  const username = req.body.userName;
  const title = req.body.title;
  const text = req.body.text;

  db.query(
    "INSERT INTO sessions (title, post_text, user_name) VALUES (?,?,?)",
    [title, text, username],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result);
    }
  );
});

// Route to set speed
app.post("/api/speed/:id", (req, res) => {
  const id = req.params.id;
  const speed = req.body.speed;

  db.query(
    "UPDATE posts SET speed = ? WHERE id = ?",
    [speed, id],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result);
    }
  );
});

// Route to set pitch
app.post("/api/pitch/:id", (req, res) => {
    const id = req.params.id;
    const pitch = req.body.pitch;
  
    db.query(
      "UPDATE posts SET pitch = ? WHERE id = ?",
      [pitch, id],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log(result);
      }
    );
  });

  // Route to set volume
app.post("/api/volume/:id", (req, res) => {
    const id = req.params.id;
    const volume = req.body.volume;
  
    db.query(
      "UPDATE posts SET volume = ? WHERE id = ?",
      [volume, id],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log(result);
      }
    );
  });

  // Route to increment count
app.post('/api/count/:id',(req,res)=>{

    const id = req.params.id;
    db.query("UPDATE posts SET count = count + 1 WHERE id = ?",id, (err,result)=>{
        if(err) {
       console.log(err)   } 
       console.log(result)
        });    
    });

// Route to delete a session

app.delete("/api/delete/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM sessions WHERE id= ?", id, (err, result) => {
    if (err) {
      console.log(err);
    }
  });
});

app.listen(PORT, () => {
  console.log('Server is running on ${PORT}');
});
