import './App.css'
import React, { useState } from 'react';
import quizes_json from './assets/q_raw.json';
import QuizForm from './components/QuizForm';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const App = () => {
  const [activeQuiz, setActiveQuiz] = useState(null)

  const quizSize = 50
  const nbQuiz = Math.floor(quizes_json.length / quizSize)

  const menuQuiz = () => 
    Array.from({ length: nbQuiz }, (_, i) => (
      <div 
        key={`Test_${i + 1}`} 
        className='quiz_card' 
        onClick={() => setActiveQuiz(i + 1)}
      >
        Test {i + 1}
      </div>
  ));

  const QuizDropdown = () => {
    const handleChange = (event) => {
      setActiveQuiz(event.target.value);
    };

    return (
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="quiz-select-label">Test</InputLabel>
        <Select
          labelId="quiz-select-label"
          id="quiz-select"
          value={activeQuiz}
          label="Test"
          onChange={handleChange}
        >
          {Array.from({ length: nbQuiz }, (_, i) => (
            <MenuItem key={`test-${i + 1}`} value={i + 1}>
              Test {i + 1}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
  
  return (
    <div id="main_app">
      <div id="header">
        {/* <h1 onClick={() => setActiveQuiz(0)}>Prepit</h1> */}
        <QuizDropdown />
      </div>
      <div id='content'>
        <div className='menuQuiz'>
          {activeQuiz ?  
            <QuizForm questions={quizes_json.slice( quizSize * (activeQuiz - 1), quizSize * activeQuiz)}/>
            :
            menuQuiz()
          }
        </div>
       
        
      </div>
    </div>
  );
};

export default App;