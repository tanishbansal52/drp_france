import React from 'react';
import { Button } from 'react-bootstrap';
import soundEffectsService from '../SoundEffectsService';

function TeacherButton({ onClick, children, ...props }) {
  const handleClick = (e) => {
    soundEffectsService.playClick();
    if (onClick) onClick(e);
  };

  return (
    <Button 
      {...props} 
      onClick={handleClick}
    >
      {children}
    </Button>
  );
}

export default TeacherButton;