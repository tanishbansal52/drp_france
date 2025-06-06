import React from 'react';
import HighContrastToggle from './HighContrastToggle';

function StudentLayout({ children }) {
  return (
    <>
      <HighContrastToggle />
      {children}
    </>
  );
}

export default StudentLayout;