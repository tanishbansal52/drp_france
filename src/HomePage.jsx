import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './NavBar';
import TeacherLanding from './teacher/TeacherLanding';
import StudentLanding from './student/StudentLanding';

function HomePage() {
  return (
    <>
      <NavBar />
      <div className="d-flex" style={{ height: 'calc(100vh - 56px)' }}>
        <div className="w-50 border-end d-flex justify-content-center align-items-center text-center">
          <TeacherLanding />
        </div>
        <div className="w-50 d-flex justify-content-center align-items-center text-center">
          <StudentLanding />
        </div>
      </div>
    </>
  );
}

export default HomePage;