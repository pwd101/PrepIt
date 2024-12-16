import React, { useState, useEffect } from 'react';
import { 
  FormControl,
  Radio,
  FormControlLabel,
  Checkbox,
  Button,
  IconButton,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Paper
} from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import TimerIcon from '@mui/icons-material/Timer';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
import QuizResult from './QuizResult';
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
    const unansweredQuestions = selectedAnswers
      .map((answers, index) => ({ index, answered: answers.length > 0 }))
      .filter(q => !q.answered);
    
    const flaggedQuestions = reviewStatus
      .map((isFlagged, index) => ({ index, flagged: isFlagged }))
      .filter(q => q.flagged);

    if (unansweredQuestions.length > 0 || flaggedQuestions.length > 0) {
      setSubmitDialogOpen(true);
    } else {
      handleSubmit();
    }
  };

  const handleSubmitConfirm = () => {
    setSubmitDialogOpen(false);
    handleSubmit();
  };

  const renderQuestionInputs = (question, questionIndex) => {
    const isMultiSelect = question.q_format !== "single";
    
    return (
      <div style={{ position: 'relative' }}>
        <Box sx={{ 
          maxWidth: 800, 
          mx: 'auto', 
          p: 2,
          position: 'relative'
        }}>
          <div className="submit-container" style={{ 
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 1000
          }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitClick}
              className="submit-button"
              sx={{
                boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
                '&:hover': {
                  boxShadow: '0 5px 12px rgba(0,0,0,0.3)'
                }
              }}
            >
              Submit Quiz
            </Button>
          </div>

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

            <div className="question-header" style={{ marginTop: '0px' }}>
              <Typography variant="h6" component="h2" sx={{ mt: 0 }}>
                Question {quizNum + 1}
              </Typography>
            </div>

            <div className="question-text" style={{ marginTop: '12px' }}>{question.q_text}</div>

            <FormControl component="fieldset" className="answer-options">
              {isMultiSelect ? (
                question.answers.map((answer, answerIndex) => (
                  <FormControlLabel
                    key={answerIndex}
                    className="answer-option"
                    control={
                      <Checkbox
                        checked={selectedAnswers[questionIndex].includes(answerIndex)}
                        onChange={() => handleAnswerChange(answerIndex, true)}
                      />
                    }
                    label={numerateABC(answerIndex, answer.ans)}
                  />
                ))
              ) : (
                question.answers.map((answer, answerIndex) => (
                  <FormControlLabel
                    key={answerIndex}
                    className="answer-option"
                    value={answerIndex}
                    control={<Radio 
                      checked={selectedAnswers[questionIndex][0] === answerIndex}
                      onChange={() => handleAnswerChange(answerIndex, false)}
                    />}
                    label={numerateABC(answerIndex, answer.ans)}
                  />
                ))
              )}
            </FormControl>

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
                endIcon={<NavigateNextIcon />}
                onClick={handleNext}
                disabled={quizNum === questions.length - 1}
                variant="outlined"
                size="medium"
              >
                Next
              </Button>
            </div>

            {renderQuestionGrid()}

            <Dialog
              open={submitDialogOpen}
              onClose={() => setSubmitDialogOpen(false)}
              maxWidth="xs"
              fullWidth
            >
              <DialogTitle sx={{ pb: 1 }}>
                <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 500, mb: 1 }}>
                  Quiz Submission Warning
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Are you sure you want to submit?
                </Typography>
              </DialogTitle>
              <DialogContent sx={{ pt: '8px' }}>
                {selectedAnswers.some(answers => answers.length === 0) && (
                  <div style={{ marginBottom: '12px' }}>
                    <Typography variant="subtitle2" color="error" sx={{ mb: 1 }}>
                      Unanswered Questions:
                    </Typography>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {selectedAnswers.map((answers, index) => 
                        answers.length === 0 ? (
                          <Tooltip key={index} title={`Go to Question ${index + 1}`}>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => {
                                setQuizNum(index);
                                setSubmitDialogOpen(false);
                              }}
                              sx={{ 
                                minWidth: '36px',
                                height: '28px',
                                padding: '4px 8px',
                                fontSize: '0.8rem'
                              }}
                            >
                              {index + 1}
                            </Button>
                          </Tooltip>
                        ) : null
                      )}
                    </div>
                  </div>
                )}
                
                {reviewStatus.some(status => status) && (
                  <div style={{ marginBottom: '12px' }}>
                    <Typography variant="subtitle2" color="warning.main" sx={{ mb: 1 }}>
                      Flagged for Review:
                    </Typography>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {reviewStatus.map((isFlagged, index) => 
                        isFlagged ? (
                          <Tooltip key={index} title={`Go to Question ${index + 1}`}>
                            <Button
                              size="small"
                              variant="outlined"
                              color="warning"
                              onClick={() => {
                                setQuizNum(index);
                                setSubmitDialogOpen(false);
                              }}
                              sx={{ 
                                minWidth: '36px',
                                height: '28px',
                                padding: '4px 8px',
                                fontSize: '0.8rem'
                              }}
                            >
                              {index + 1}
                            </Button>
                          </Tooltip>
                        ) : null
                      )}
                    </div>
                  </div>
                )}
              </DialogContent>
              <DialogActions sx={{ px: 2, pb: 2 }}>
                <Button 
                  onClick={() => setSubmitDialogOpen(false)}
                  color="inherit"
                  size="small"
                >
                  Continue
                </Button>
                <Button 
                  onClick={handleSubmitConfirm}
                  color="primary"
                  variant="contained"
                  size="small"
                  startIcon={<SendIcon />}
                >
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
          </Paper>
        </Box>
      </div>
    );
  };

  const isQuestionAnswered = (questionIndex) => {
    return selectedAnswers[questionIndex].length > 0;
  };

  const isAllAnswered = () => {
    return selectedAnswers.every(answers => answers.length > 0);
  };

  const renderQuestionGrid = () => (
    <div className="question-grid">
      {questions.map((_, index) => {
        const isAnswered = selectedAnswers[index]?.length > 0;
        const isFlagged = reviewStatus[index];
        const isCurrent = quizNum === index;
        const timeSpent = questionTimes[index];
        const hasBeenAccessed = timeSpent > 0;
        
        return (
          <Tooltip 
            key={index} 
            title={
              <div style={{ textAlign: 'center' }}>
                <div>Question {index + 1}</div>
                {isFlagged && <div style={{ color: '#ed6c02' }}>Flagged</div>}
                {!isAnswered && <div style={{ color: '#d32f2f' }}>Not answered</div>}
              </div>
            }
            arrow
          >
            <Button
              variant={isCurrent ? "contained" : "outlined"}
              color={!isAnswered ? "error" : isFlagged ? "warning" : "primary"}
              onClick={() => setQuizNum(index)}
              className={`grid-button ${isAnswered ? 'answered' : ''} ${isFlagged ? 'flagged' : ''}`}
              sx={{ 
                minWidth: '42px',
                height: '42px',
                padding: '4px 6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: hasBeenAccessed ? '2px' : 0,
                '& .MuiButton-startIcon': { margin: 0 }
              }}
            >
              <div style={{ 
                fontSize: hasBeenAccessed ? '0.95rem' : '1rem',
                fontWeight: 500,
                lineHeight: 1
              }}>
                {index + 1}
              </div>
              {hasBeenAccessed && (
                <div style={{ 
                  fontSize: '0.7rem',
                  opacity: 0.85,
                  fontFamily: 'monospace',
                  lineHeight: 1,
                  letterSpacing: '-0.5px'
                }}>
                  {formatTime(timeSpent)}
                </div>
              )}
            </Button>
          </Tooltip>
        );
      })}
    </div>
  );

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