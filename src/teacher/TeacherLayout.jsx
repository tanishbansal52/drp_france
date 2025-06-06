import React from 'react';
import AudioToggle from './AudioToggle';
import SoundEffectsToggle from './SoundEffectsToggle';

function TeacherLayout({ children }) {
  return (
    <>
      <AudioToggle />
      <SoundEffectsToggle />
      {children}
    </>
  );
}

export default TeacherLayout;