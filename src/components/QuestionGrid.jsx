import React from 'react';
import { Tooltip, Button } from '@mui/material';

const QuestionGrid = ({ questions, selectedAnswers, reviewStatus, quizNum, questionTimes, setQuizNum, formatTime }) => {
  const flexStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '5px', // Maintain gap between items
    margin: '10px', // Maintain overall margin
    flexDirection: 'row',
    alignItems: 'center'
  };

  return (
    <div className="question-grid" style={flexStyle}>
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
};

export default QuestionGrid;
