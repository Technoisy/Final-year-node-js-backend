const express = require("express");
const Topic = require("../models/questionForm")
const router = express.Router();
const User = require("../models/Users")

// Route to calculate test results
router.post("/checking_answer", async (req, res) => {
  try {
    const { currentTopicId, topicName, answers, userId } = req.body;
    console.log("answers topicName    :     ", topicName, userId, currentTopicId, answers);

    // Validate input
    if (!currentTopicId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Invalid input format." });
    }

    let correctAnswersCount = 0;
    const incorrectAnswers = []; // Array to store incorrect answers

    for (const userAnswer of answers) {
      const { questionId, selectedOption } = userAnswer;
      console.log("selected answer : ", questionId, selectedOption);

      // Find the question within the current topic
      const questionData = await Topic.findOne(
        {
          _id: currentTopicId,
          "questions._id": questionId,
        },
        {
          "questions.$": 1, // Project only the matched question
        }
      );

      if (!questionData || !questionData.questions || questionData.questions.length === 0) {
        console.log("Question not found for questionId:", questionId);
        continue; // Skip to the next iteration
      }

      const matchedQuestion = questionData.questions[0];

      // Compare the user's answer with the correct answer
      if (matchedQuestion.answer === selectedOption) {
        correctAnswersCount++;
      } else {
        // Track incorrect answers
        incorrectAnswers.push({
          question: matchedQuestion.question,
          options: matchedQuestion.options,
          questionId,
          selectedOption,
          correctAnswer: matchedQuestion.answer,
        });
      }
    }

    // Calculate the score
    const totalQuestions = answers.length;
    const score = ((correctAnswersCount / totalQuestions) * 100).toFixed(2);
    console.log("score : ", score);
    
    await Topic.findOneAndUpdate(
      { _id: currentTopicId}, // Find the topic & question
      { $set: { score : score, incorrectAnswers },
     }, 
      { new: true } 
    );
    

    await User.findOneAndUpdate(
      { _id: userId }, // Find user by ID
      { $push: { Tests: { currentTopicId: currentTopicId, topic: topicName } } }, // Push a new object into Tests array
      { new: true } // Returns updated user document
    );
    

    res.status(200).json({
      message: "Test result calculated successfully.",
      totalQuestions,
      correctAnswers: correctAnswersCount,
      incorrectAnswers,
      score: `${score}%`,
    });
  } catch (error) {
    console.error("Error calculating test result:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});



module.exports = router;
