import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Divider 
} from '@mui/material';

const QuizResult = ({questions, submissionResult, selectedAnswers }) => {
    const numerateABC = (index, text) => `${String.fromCharCode(65 + index)}. ${text}`

    return (
        <Paper elevation={3} sx={{ p: 3, mt: 4, maxWidth: 800, margin: 'auto' }}>
        <Typography variant="h4" gutterBottom align="center">
            Quiz Results
        </Typography>
        <Typography variant="h6" gutterBottom align="center">
            You scored: {submissionResult.correctAnswers} out of {submissionResult.totalQuestions} 
            {' '}({submissionResult.percentage}%)
        </Typography>

        <Divider sx={{ my: 3 }} />

        {questions.map((question, questionIndex) => {
            const isQuestionCorrect = submissionResult.results[questionIndex];
            const selectedAnswerIndices = selectedAnswers[questionIndex];

            return (
            <Paper 
                key={questionIndex} 
                elevation={2} 
                sx={{ 
                mb: 3, 
                p: 2, 
                backgroundColor: isQuestionCorrect ? '#e8f5e9' : '#ffebee'
                }}
            >
                <div
                    style={{
                        fontSize: '1.1rem',
                        marginBottom: '1rem'
                    }}
                    >
                    Question {questionIndex + 1}:<br/>
                    {question.q_text}
                </div>
                                

                {question.answers.map((answer, answerIndex) => {
                const isSelected = selectedAnswerIndices.includes(answerIndex);
                const isCorrect = answer.val === true;
                
                return (
                    <Box 
                    key={answerIndex}
                    sx={{ 
                        mb: 1,
                        pl: 2,
                        fontWeight: isSelected ? 'bold' : 'normal',
                        color: 
                        isCorrect 
                            ? 'green' 
                            : (isSelected ? 'red' : 'inherit')
                    }}
                    >
                    {numerateABC(answerIndex, answer.ans)} 
                    {isCorrect && ' ✓'}
                    {isSelected && !isCorrect && ' ✗'}
                    </Box>
                );
                })}

                {/* Explanation for the question */}
                {question.q_expl && (
                <Box sx={{ mt: 2, p: 2, backgroundColor: '#f0f0f0', borderRadius: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                    Explanation:
                    </Typography>
                    <Typography variant="body2">
                    {question.q_expl}
                    </Typography>
                </Box>
                )}
            </Paper>
            );
        })}
        </Paper>
    );
};

export default QuizResult;