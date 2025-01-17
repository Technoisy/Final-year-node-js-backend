const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { createQuestion, getAllQuestions, getTopic } = require("../controllers/questioFormController");

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads", "images");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Ensure directory exists
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

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
  
  module.exports = router;
  
