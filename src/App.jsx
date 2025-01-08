import './App.css'
import React, { useState } from 'react';
import quizes_json from './assets/q_raw.json';
import QuizForm from './components/QuizForm';
import QuizDropdown from './components/QuizDropdown';
import Header from './components/Header';

const App = () => {
  const [activeQuiz, setActiveQuiz] = useState(null)
  const quizSize = 20
  const nbQuiz = Math.floor(quizes_json.length / quizSize)

  const resetQuizState = () => {
    setActiveQuiz(null);
  };

  const menuQuiz = () => (
    <div className="quiz-container">
      <div className="quiz-grid">
        {Array.from({ length: nbQuiz }, (_, i) => (
          <div 
            key={`Test_${i + 1}`}
            className="quiz-card"
            onClick={() => setActiveQuiz(i + 1)}
          >
            <h2 className="card-title">Level {i + 1}</h2>
            <p className="card-subtitle">{quizSize} Questions</p>
          </div>
        ))}
      </div>
    </div>
  );
  
  return (
    <div id="main_app">
      <Header resetQuizState={resetQuizState} activeQuiz={activeQuiz}>
        {activeQuiz && (
          <QuizDropdown 
            activeQuiz={activeQuiz}
            setActiveQuiz={setActiveQuiz}
            totalQuizzes={nbQuiz}
            quizSize={quizSize}
          />
        )}
      </Header>
      <main className="content">
        {activeQuiz ? 
          <QuizForm questions={quizes_json.slice(quizSize * (activeQuiz - 1), quizSize * activeQuiz)}/>
          :
          menuQuiz()
        }
      </main>
    </div>
  );
};

export default App;