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
        
        <div className="header-logo" onClick={handleTitleClick}>
          <img src = "/icon.svg" alt="Prepit Logo" />
          <span style={{ marginLeft: '5px' }}>PrepIt</span>
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
