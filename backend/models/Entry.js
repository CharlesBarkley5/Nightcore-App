const mongoose = require("mongoose");

const EntrySchema = new mongoose.Schema({
  title: {
    type: String,
  },
  session: {
    type: Number,
  },
  num: {
    type: Number,
  },
});

module.exports = Entry = mongoose.model("entry", EntrySchema);