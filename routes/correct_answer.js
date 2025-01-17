const express = require("express");
const Topic = require("../models/questionForm")
const router = express.Router();

// Route to calculate test results
router.post("/checking_answer", async (req, res) => {
  try {
    const { currentTopicId, answers } = req.body;
    console.log("answers    :     ", currentTopicId, answers);

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
