const express = require("express");
const router = express.Router();

// Load Entry model
const Entry = require("../models/Entry");

// @route GET api/books/test
// @description tests books route
// @access Public
router.get("/test", (req, res) => res.send("entry route testing!"));

// @route GET api/entries
// @description Get all books
// @access Public
router.get("/", (req, res) => {
  Entry.find()
    .then((entries) => res.json(entries))
    .catch((err) =>
      res.status(404).json({ noentriesfound: "no entries found" })
    );
});

router.get("/:session/:num", (req, res) => {
  Entry.find({session: req.params.session, num: req.params.num})
    .then((entries) => res.json(entries))
    .catch((err) => res.status(404).json({ noentryfound: "No entry found" }));
});

router.post("/", (req, res) => {
  Entry.create(req.body)
    .then((entry) => res.json({ msg: "Entry added successfully" }))
    .catch((err) =>
      res.status(400).json({ error: "Unable to add this entry" })
    );
});

// @route GET api/books/:id
// @description Update book
// @access Public
router.put("/:id", (req, res) => {
  Entry.findByIdAndUpdate(req.params.id, req.body)
    .then((entry) => res.json({ msg: "Updated successfully" }))
    .catch((err) =>
      res.status(400).json({ error: "Unable to update the Database" })
    );
});

// @route GET api/books/:id
// @description Delete book by id
// @access Public
router.delete("/:id", (req, res) => {
  Entry.findByIdAndRemove(req.params.id, req.body)
    .then((entry) => res.json({ msg: "Entry deleted succcessfully" }))
    .catch((err) => res.status(404).json({ error: "No such entry" }));
});

module.exports = router;