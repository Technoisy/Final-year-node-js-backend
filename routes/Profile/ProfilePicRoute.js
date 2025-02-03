const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const storage = require("../../middlewares/diskStorage")
const ProfilePic = require("../../controllers/ProfileControler")


  
  const upload = multer({ storage: storage });
  

router.post("/upload", upload.single("profileImage"), ProfilePic.ProfilePic);

module.exports = router;