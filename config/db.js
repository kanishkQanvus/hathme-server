const mongoose = require("mongoose");

const db = async () => {
  try {
    const result = await mongoose.connect(process.env.MONGO_URL_ADMIN);
    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("DB Can't Connect" + error);
  }
};

module.exports = db;




// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MjM1YTJhY2RmNzcwMDBiNzE1YTlhNTkiLCJpYXQiOjE2NDc2ODIyMjB9.uVNFDilBtZAmbLHt-oJqZMXMUuj7O3at8yQTwbo9YGg     ===>new admin