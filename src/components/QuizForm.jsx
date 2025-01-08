import React, { useState, useEffect } from 'react';
import { 
  FormControl,
  Radio,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  Box,
  Paper
} from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
import QuizResult from './QuizResult';
import QuizSubmission from './QuizSubmission';
import QuestionGrid from './QuestionGrid';
import './QuizForm.css';

const QuizForm = ({ questions }) => {
  const [quizNum, setQuizNum] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(
    Array(questions.length).fill(null).map(() => [])
  );
  const [reviewStatus, setReviewStatus] = useState(
    Array(questions.length).fill(false)
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  
  // Timer states
  const [totalTime, setTotalTime] = useState(0);
  const [questionTimes, setQuestionTimes] = useState(
    Array(questions.length).fill(0)
  );
  const [startTime, setStartTime] = useState(Date.now());

  const resetQuizState = () => {
    setQuizNum(0);
    setSelectedAnswers(Array(questions.length).fill(null).map(() => []));
    setReviewStatus(Array(questions.length).fill(false));
    setIsSubmitted(false);
    setSubmissionResult(null);
    setSubmitDialogOpen(false);
    setTotalTime(0);
    setQuestionTimes(Array(questions.length).fill(0));
    setStartTime(Date.now());
  };

  useEffect(() => {
    resetQuizState();
  }, [questions]);

  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = Date.now();
      const elapsed = Math.floor((currentTime - startTime) / 1000);
      setTotalTime(elapsed);
      
      setQuestionTimes(prev => {
        const newTimes = [...prev];
        newTimes[quizNum] += 1;
        return newTimes;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizNum, startTime]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const numerateABC = (index, text) => `${String.fromCharCode(65 + index)}. ${text}`;

  const handleNext = () => {
    if (quizNum < questions.length - 1) setQuizNum(quizNum + 1);
  };
  
  const handlePrev = () => {
    if (quizNum > 0) setQuizNum(quizNum - 1);
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
      if (currentQuestionAnswers[0] === answerIndex) {
        currentQuestionAnswers.length = 0;
      } else {
        currentQuestionAnswers[0] = answerIndex;
      }
    }
    
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[quizNum] = currentQuestionAnswers;
    setSelectedAnswers(updatedAnswers);
  };

  const handleReviewToggle = (questionIndex) => {
    const updatedReviewStatus = [...reviewStatus];
    updatedReviewStatus[questionIndex] = !updatedReviewStatus[questionIndex];
    setReviewStatus(updatedReviewStatus);
  };

  const handleSubmitClick = () => {
    const hasUnanswered = selectedAnswers.some(answer => answer.length === 0);
    const hasFlagged = reviewStatus.some(isFlagged => isFlagged);

    if (hasUnanswered || hasFlagged) {
      setSubmitDialogOpen(true);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const results = questions.map((question, index) => {
      const selectedAnswerIndices = selectedAnswers[index];
      const isCorrect = selectedAnswerIndices.every(
        (selectedIndex) => question.answers[selectedIndex].val === true
      ) && 
      question.answers.filter(
        (answer) => answer.val === true
      ).length === selectedAnswerIndices.length;

      return isCorrect;
    });

    const correctCount = results.filter(result => result).length;
    const totalQuestions = questions.length;

    setSubmissionResult({
      correctAnswers: correctCount,
      totalQuestions: totalQuestions,
      percentage: ((correctCount / totalQuestions) * 100).toFixed(2),
      results: results,
      questionTimes: questionTimes,
      totalTime: totalTime
    });

    setIsSubmitted(true);
  };

  const renderQuestionInputs = (question, questionIndex) => {
    const isMultiSelect = question.q_format !== "single";

    const renderAnswerOptions = () => {
      return question.answers.map((answer, answerIndex) => (
        <FormControlLabel
          key={answerIndex}
          className="answer-option"
          control={
            isMultiSelect ? (
              <Checkbox
                checked={selectedAnswers[questionIndex].includes(answerIndex)}
                onChange={() => handleAnswerChange(answerIndex, true)}
              />
            ) : (
              <Radio
                checked={selectedAnswers[questionIndex][0] === answerIndex}
                onChange={() => handleAnswerChange(answerIndex, false)}
              />
            )
          }
          label={numerateABC(answerIndex, answer.ans)}
        />
      ));
    };

    const renderNavigationButtons = () => (
      <div className="navigation-buttons">
        <Button
          startIcon={<NavigateBeforeIcon />}
          onClick={handlePrev}
          disabled={quizNum === 0}
          variant="outlined"
          size="medium"
        >
          Previous
        </Button>

        <Button
          startIcon={reviewStatus[quizNum] ? <FlagIcon sx={{ color: 'white' }} /> : <FlagOutlinedIcon />}
          onClick={() => handleReviewToggle(quizNum)}
          variant={reviewStatus[quizNum] ? "contained" : "outlined"}
          color="warning"
          size="medium"
          className="review-button"
          sx={{
            ml: 2,
            color: reviewStatus[quizNum] ? 'white' : undefined,
            backgroundColor: reviewStatus[quizNum] ? '#ed6c02 !important' : undefined,
            '&:hover': {
              backgroundColor: reviewStatus[quizNum] ? '#c55a02 !important' : undefined
            }
          }}
        >
          {reviewStatus[quizNum] ? "Flagged" : "Flag for Review"}
        </Button>

        <Button
          endIcon={quizNum === questions.length - 1 ? <SendIcon /> : <NavigateNextIcon />}
          onClick={quizNum === questions.length - 1 ? handleSubmitClick : handleNext}
          variant="outlined"
          size="medium"
        >
          {quizNum === questions.length - 1 ? "Submit" : "Next"}
        </Button>
      </div>
    );

    return (
      <div style={{ position: 'relative' }}>
        
        <Box sx={{ 
          maxWidth: 800, 
          mx: 'auto', 
          p: 2,
          position: 'relative'
        }}>
          <Paper elevation={2} sx={{ p: 2.5, position: 'relative', mb: 7 }}>
            <div style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              backgroundColor: 'white',
              padding: '8px 12px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              zIndex: 1
            }}>
              <AccessTimeIcon sx={{ fontSize: '1.1rem', opacity: 0.7 }} />
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                {formatTime(totalTime)}
              </Typography>
            </div>

            <div className="question-header">
              <Typography variant="h6" component="h2" sx={{ mt: 0 }}>
                Question {quizNum + 1}
              </Typography>
            </div>

            <div className="question-text">{question.q_text}</div>

            <FormControl component="fieldset" className="answer-options">
              {renderAnswerOptions()}
            </FormControl>

            {renderNavigationButtons()}

            <QuestionGrid
              questions={questions}
              selectedAnswers={selectedAnswers}
              reviewStatus={reviewStatus}
              quizNum={quizNum}
              questionTimes={questionTimes}
              setQuizNum={setQuizNum}
              formatTime={formatTime}
            />

            <QuizSubmission
              open={submitDialogOpen}
              onClose={() => setSubmitDialogOpen(false)}
              onSubmit={handleSubmit}
              selectedAnswers={selectedAnswers}
              reviewStatus={reviewStatus}
              setQuizNum={setQuizNum}
              questions={questions}
              handleSubmitClick={handleSubmitClick}
              totalTime={totalTime}
              questionTimes={questionTimes}
            />
          </Paper>
        </Box>
      </div>
    );
  };

  if (isSubmitted) {
    return (
      <QuizResult 
        questions={questions}
        submissionResult={submissionResult}
        selectedAnswers={selectedAnswers}
      />
    );
  }

  return renderQuestionInputs(questions[quizNum], quizNum);
};

export default QuizForm;