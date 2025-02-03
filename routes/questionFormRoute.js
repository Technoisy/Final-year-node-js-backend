const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const storage = require("../middlewares/diskStorage")

const { createQuestion, getAllQuestions, getTopic, getResult } = require("../controllers/questioFormController");

// Configure Multer

const upload = multer({ storage: storage });

const router = express.Router();

// POST /api/questions - Create a question with image upload
router.post("/", upload.single("image"), (req, res, next) => {
    // Attach extracted data to req for the controller
    const filePath = req.file?.filename;  // Extract the filename from req.file
    console.log("file path baby:", filePath);  // Log the file path
    
    req.extractedData = {
      filePath: filePath, // Add the uploaded file path
      ...req.body, // Spread other form data
    };
  
    next(); // Pass control to the controller
  }, createQuestion);

  router.get("/getQuestion", getAllQuestions);

  router.get("/getTopic", getTopic )

  router.post("/getResult", getResult )
  
  module.exports = router;
  
