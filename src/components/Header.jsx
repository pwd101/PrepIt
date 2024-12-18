import React, { useState } from 'react';
import './Header.css';
import ConfirmationDialog from './ConfirmationDialog';

const Header = ({ children, resetQuizState, activeQuiz }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleTitleClick = () => {
    if (activeQuiz) { 
      setDialogOpen(true);
    }
  };

  const handleConfirm = () => {
    resetQuizState();
    setDialogOpen(false);
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <h1 onClick={handleTitleClick} >PrepIt</h1>
        </div>
        <div className="header-menu">
          {children}
        </div>
      </div>
      <ConfirmationDialog
        open={dialogOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title="Back to Menu?"
        content="Your answers will not be saved."
      />
    </header>
  );
};

export default Header;
