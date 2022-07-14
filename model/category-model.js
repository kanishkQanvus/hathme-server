const mongoose = require("mongoose");
const validator = require("validator");
const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

module.exports = mongoose.model("category", categorySchema);
