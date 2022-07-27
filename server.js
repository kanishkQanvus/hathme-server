const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const mime = require("mime");
const bodyParser = require("body-parser");

app.use(cors());
app.use(express.json({ limit: 2000000 }));
app.use(express.urlencoded({ limit: 2000000, extended: false }));
app.use(express.static(path.join(__dirname, "build")));

//serve static file
app.use(express.static("public"));
app.use("/uploads/panCardImages", express.static("uploads/panCardImages"));
app.use("/uploads/aadharCardImages", express.static("uploads/aadharCardImages"));
app.use("/uploads/profileImages", express.static("uploads/profileImages"));
app.use("/uploads/coverImages", express.static("uploads/coverImages"));
app.use("/uploads/categoryImages", express.static("uploads/categoryImages"));
app.use("/uploads/productImages", express.static("uploads/productImages"));
app.use("/uploads/drivingLicenseImages", express.static("uploads/drivingLicenseImages"));
app.use("/uploads/userVideos/videos", express.static("uploads/userVideos/videos"));
app.use("/uploads/userVideos/reels", express.static("uploads/userVideos/reels"));
app.use("/uploads/qrcode", express.static("uploads/qrcode"));



// for Device Info

// env
const env = require("dotenv");
env.config({ path: "./config/.env" });
const port = process.env.PORT;
// db
const db = require("./config/db.js");
db();
// for image upload
// app.use(express.static(path.join(__dirname, "uploads")));
// app.use("/images/uploads", express.static("./uploads"));
// routes
const user = require("./router/userMaster-router");
app.use("/api/user", user);
const merchant = require("./router/merchantMaster-router");
app.use("/api/merchant", merchant);
const driver = require("./router/driverMaster-router");
app.use("/api/driver", driver);
const admin = require("./router/adminMaster-router");
app.use("/admin", admin);  


app.listen(port, () =>
  console.log(`Server Successfully Runing on PORT ${port}`)
);

