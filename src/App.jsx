import './App.css'
import React, { useState } from 'react';
import quizes_json from './assets/q_raw.json';
import QuizForm from './components/QuizForm';
import QuizMenu from './components/QuizMenu';

const App = () => {
  const [activeQuiz, setActiveQuiz] = useState(null)
  const quizSize = 50
  const nbQuiz = Math.floor(quizes_json.length / quizSize)

  const menuQuiz = () => (
    <div className="quiz-container">
      <h1 className="quiz-title">Select Your Quiz Level</h1>
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
      <header className="header">
        {activeQuiz && (
          <QuizMenu 
            activeQuiz={activeQuiz}
            setActiveQuiz={setActiveQuiz}
            totalQuizzes={nbQuiz}
            quizSize={quizSize}
          />
        )}
      </header>
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