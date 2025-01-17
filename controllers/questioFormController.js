const Topic = require("../models/questionForm");



// Create a questionForm with Image Upload
const createQuestion = async (req, res) => {
  console.log(req.body, "   : body data");
  
  const { topic, question, options, answer, filePath } = req.extractedData; // Extract data from request
  
  console.log(filePath, ": image path");

  try {
    // Check if the topic already exists
    let existingTopic = await Topic.findOne({ topicName: topic });

    const newQuestion = {
      question,
      options: JSON.parse(options), // Parse options as it comes in as a string
      answer,
      imagePath: filePath, // Save the uploaded image path
    };

    if (existingTopic) {
      // If topic exists, add the new question to the existing topic
      existingTopic.questions.push(newQuestion);
      await existingTopic.save();
    } else {
      // If topic does not exist, create a new topic with the question
      existingTopic = await Topic.create({
        topicName: topic,
        questions: [newQuestion],
      });
    }

    res.status(201).json({
      message: "Question added successfully",
      topic: existingTopic,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating question", error });
  }
};


const getAllQuestions = async (req, res) => {
  try {
    const { topicId, page = 1, limit = 1 } = req.query; // Extract query parameters

    console.log("topicId   : ",topicId );
    
    // Validate and parse pagination parameters
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 1;

    if (!topicId) {
      return res.status(400).json({ message: "Topic ID is required" });
    }

    console.log(`Fetching questions for Topic ID: ${topicId}`);
    console.log(`Pagination Parameters - Page: ${parsedPage}, Limit: ${parsedLimit}`);

    // Find the topic by ID
    const topic = await Topic.findById(topicId);

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    // Paginate questions within the topic
    const startIndex = (parsedPage - 1) * parsedLimit;
    const paginatedQuestions = topic.questions.slice(startIndex, startIndex + parsedLimit);

    res.status(200).json({
      data: paginatedQuestions,
      meta: {
        topicId : topicId,
        totalDocuments: topic.questions.length,
        totalPages: Math.ceil(topic.questions.length / parsedLimit),
        currentPage: parsedPage,
        hasNextPage: startIndex + parsedLimit < topic.questions.length,
        hasPreviousPage: parsedPage > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Error fetching questions", error });
  }
};



const getTopic = async (req, res) => {
  try {
    const topics = await Topic.find().populate("questions"); // Retrieve all topics with their questions

    if (!topics || topics.length === 0) {
      return res.status(404).json({ message: "No topics found" });
    }

    res.status(200).json({
      message: "Topics fetched successfully",
      data: topics,
    });
  } catch (error) {
    console.error("Error fetching topics:", error);
    res.status(500).json({ message: "Error fetching topics", error });
  }
};




module.exports = { createQuestion, getAllQuestions, getTopic };
