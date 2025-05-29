import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './NavBar';

function End() {

    

  return (
    <>
    <div className="flex flex-col items-center justify-center">
        <NavBar />
      <h1 className="text-4xl font-bold mb-4">Well done agents!</h1>
      <p className="text-lg text-gray-700 mb-8">You have successfully completed your mission.</p>
    </div>
    
    <div className="flex flex-col items-center justify-center">
        
      <a href="/debrief" className="btn btn-warning btn-lg">
        Continue
      </a>
    </div>
    </>
  );
}
export default End;