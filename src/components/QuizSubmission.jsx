import React from 'react';
import { 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Tooltip
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import './QuizSubmission.css';

const QuizSubmission = ({
  open,
  onClose,
  onSubmit,
  selectedAnswers,
  reviewStatus,
  setQuizNum,
  questions,
  handleSubmitClick,
  totalTime,
  questionTimes
}) => {
  const handleSubmitConfirm = () => {
    onClose();
    onSubmit();
  };

  const calculateResults = () => {
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

    return {
      correctAnswers: correctCount,
      totalQuestions: totalQuestions,
      percentage: ((correctCount / totalQuestions) * 100).toFixed(2),
      results: results,
      questionTimes: questionTimes,
      totalTime: totalTime
    };
  };

  return (
    <>
      <div className="submit-container">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmitClick}
          className="submit-button"
        >
          Submit Answers
        </Button>
      </div>

      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" className="dialog-title">
            Quiz Submission Warning
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to submit?
          </Typography>
        </DialogTitle>

        <DialogContent className="dialog-content">
          {selectedAnswers.some(answers => answers.length === 0) && (
            <div className="question-group">
              <Typography variant="subtitle2" color="error" gutterBottom>
                Unanswered Questions:
              </Typography>
              <div className="question-buttons">
                {selectedAnswers.map((answers, index) => 
                  answers.length === 0 ? (
                    <Tooltip key={index} title={`Go to Question ${index + 1}`}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          setQuizNum(index);
                          onClose();
                        }}
                        className="question-button"
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
            <div className="question-group">
              <Typography variant="subtitle2" color="warning.main" gutterBottom>
                Flagged for Review:
              </Typography>
              <div className="question-buttons">
                {reviewStatus.map((isFlagged, index) => 
                  isFlagged ? (
                    <Tooltip key={index} title={`Go to Question ${index + 1}`}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        onClick={() => {
                          setQuizNum(index);
                          onClose();
                        }}
                        className="question-button"
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

        <DialogActions className="dialog-actions">
          <Button 
            onClick={onClose}
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
    </>
  );
};

export default QuizSubmission;
