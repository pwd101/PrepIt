import React, { useState } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import './QuizMenu.css';

const QuizMenu = ({ activeQuiz, setActiveQuiz, totalQuizzes, quizSize }) => {
  const [pendingQuizLevel, setPendingQuizLevel] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleChange = (event) => {
    const newValue = event.target.value;
    if (newValue !== activeQuiz) {
      setPendingQuizLevel(newValue);
      setDialogOpen(true);
    }
  };

  const handleConfirm = () => {
    setActiveQuiz(pendingQuizLevel);
    setDialogOpen(false);
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setPendingQuizLevel(null);
  };

  return (
    <div className="quiz-menu">
      <FormControl sx={{ minWidth: 120 }} size="small">
        <InputLabel id="quiz-select-label">Quiz Level</InputLabel>
        <Select
          labelId="quiz-select-label"
          id="quiz-select"
          value={activeQuiz}
          label="Quiz Level"
          onChange={handleChange}
        >
          {Array.from({ length: totalQuizzes }, (_, i) => (
            <MenuItem 
              key={`quiz-${i + 1}`} 
              value={i + 1}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%'
              }}
            >
              <span>Level {i + 1}</span>
              <span className="question-count">{quizSize} Questions</span>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Dialog
        open={dialogOpen}
        onClose={handleCancel}
      >
        <DialogTitle>Change Quiz Level?</DialogTitle>
        <DialogContent>
          Are you sure you want to change to Level {pendingQuizLevel}? Your current answers will not be saved.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary" variant="contained">
            Change Level
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default QuizMenu;