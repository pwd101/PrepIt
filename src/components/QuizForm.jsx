import React, { useState } from 'react';
import { 
  FormControl, 
  FormLabel, 
  RadioGroup, 
  Radio, 
  FormControlLabel, 
  Checkbox,
  Button,
  Box
} from '@mui/material';
import QuizResult from './QuizResult';

const QuizForm = ({ questions }) => {
  const [quizNum, setQuizNum] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(
    Array(questions.length).fill(null).map(() => [])
  );
  
  const [reviewStatus, setReviewStatus] = useState(
    Array(questions.length).fill(false)
  );
  
  // New state for submit-related functionality
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  
  const quiz_len = questions.length;


  const numerateABC = (index, text) => `${String.fromCharCode(65 + index)}. ${text}`
  

  
  const handleNext = () => {
    if (quizNum < quiz_len - 1)
      setQuizNum(quizNum + 1);
  };
  
  const handlePrev = () => {
    if (quizNum > 0)
      setQuizNum(quizNum - 1);
  };

  const handleAnswerChange = (answerIndex, isMultiSelect) => {
    const currentQuestionAnswers = [...selectedAnswers[quizNum]];
    
    if (isMultiSelect) {
      const currentIndex = currentQuestionAnswers.indexOf(answerIndex);
      if (currentIndex === -1) {
        currentQuestionAnswers.push(answerIndex);
      } else {
        currentQuestionAnswers.splice(currentIndex, 1);
      }
    } else {
      currentQuestionAnswers[0] = answerIndex;
    }
    
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[quizNum] = currentQuestionAnswers;
    setSelectedAnswers(updatedAnswers);
  };

  const handleReviewToggle = () => {
    const updatedReviewStatus = [...reviewStatus];
    updatedReviewStatus[quizNum] = !updatedReviewStatus[quizNum];
    setReviewStatus(updatedReviewStatus);
  };

  const renderQuestionInputs = (question, questionIndex) => {
    const isMultiSelect = question.q_format !== "single";
    
    return (
      <FormControl key={questionIndex} fullWidth margin="normal">
        <div>Question {quizNum+1} of {questions.length}</div>
        <FormLabel disabled={true} id={`question-label-${questionIndex}`}>{question.q_text}</FormLabel>

        {isMultiSelect ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {question.answers.map((answer, answerIndex) => (
              <FormControlLabel
                key={answerIndex}
                control={
                  <Checkbox
                    checked={selectedAnswers[questionIndex].includes(answerIndex)}
                    onChange={() => handleAnswerChange(answerIndex, true)}
                  />
                }
                label={numerateABC(answerIndex, answer.ans)}
              />
            ))}
          </div>
        ) : (
          <RadioGroup
            aria-labelledby={`question-label-${questionIndex}`}
            name={`radio-group-${questionIndex}`}
            value={selectedAnswers[questionIndex][0] ?? ''}
            onChange={(e) => handleAnswerChange(Number(e.target.value), false)}
          >
            {question.answers.map((answer, answerIndex) => (
              <FormControlLabel
                key={answerIndex}
                value={answerIndex}
                control={<Radio />}
                // label={answer.ans}
                label={numerateABC(answerIndex, answer.ans)}
                
              />
            ))}
          </RadioGroup>
        )}
      </FormControl>
    );
  };

  const isQuestionAnswered = (questionIndex) => {
    return selectedAnswers[questionIndex].length > 0;
  };

  const renderQuestionStatusGrid = () => {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 1, 
        justifyContent: 'center', 
        mt: 2, 
        p: 2, 
        border: '1px solid #ddd', 
        borderRadius: 2 
      }}>
        {questions.map((_, index) => (
          <Box 
            key={index} 
            sx={{
              width: 30,
              height: 30,
              backgroundColor: reviewStatus[index] 
                ? '#FDFD96' 
                : (isQuestionAnswered(index) 
                  ? '#77DD77' 
                  : '#AEC6CF'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'black',
              borderRadius: 1,
              cursor: 'pointer'
            }}
            onClick={() => setQuizNum(index)}
          >
            {index + 1}
          </Box>
        ))}
      </Box>
    );
  };

  // Validate answers
  const handleSubmit = () => {
    // Check if all questions are answered

    // Validate answers
    const results = questions.map((question, index) => {
      const selectedAnswerIndices = selectedAnswers[index];
      
      // Check if the selected answers match the correct answers
      const isCorrect = selectedAnswerIndices.every(
        (selectedIndex) => question.answers[selectedIndex].val === true
      ) && 
      // Ensure no incorrect answers are selected
      question.answers.filter(
        (answer) => answer.val === true
      ).length === selectedAnswerIndices.length;

      return isCorrect;
    });

    // Calculate score
    const correctCount = results.filter(result => result).length;
    const totalQuestions = questions.length;

    // Set submission results
    setSubmissionResult({
      correctAnswers: correctCount,
      totalQuestions: totalQuestions,
      percentage: ((correctCount / totalQuestions) * 100).toFixed(2),
      results: results
    });

    setIsSubmitted(true);
  };

  // If quiz is submitted, render results page
  if (isSubmitted) {
    return (
      <QuizResult 
        questions={questions}
        submissionResult={submissionResult}
        selectedAnswers={selectedAnswers}
      />
    );
  }

  return (
    <div>
      {renderQuestionInputs(questions[quizNum], quizNum)}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant="outlined" onClick={handlePrev} disabled={quizNum === 0}>Previous</Button>
        <Button 
          variant={reviewStatus[quizNum] ? "contained" : "outlined"} 
          color="warning"
          onClick={handleReviewToggle}
        >
          {reviewStatus[quizNum] ? "Marked for Review" : "Review"}
        </Button>
        <Button variant="outlined" onClick={handleNext} disabled={quizNum === quiz_len - 1}>
          Next
        </Button>
      </Box>
      {renderQuestionStatusGrid()}
      
      {/* Submit Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSubmit}
          fullWidth
        >
          Submit Quiz
        </Button>
      </Box>
    </div>
  );
};

export default QuizForm;