import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import './css/HighContrast.css'
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import Debrief from './student/Debrief.jsx';
import Correct from './student/Correct.jsx';
import Incorrect from './student/Incorrect.jsx';
import End from './student/End.jsx';
import Start from './student/Start.jsx';
import WaitingArea from './student/Waiting.jsx';
import IndividualQuestion from './student/IndividualQuestion.jsx'
import GroupQuestion from './student/GroupQuestion.jsx';
import DisplayRoomCode from './teacher/RoomCodeDisplay.jsx';
import HomePage from './HomePage.jsx';
import TeacherLanding from './teacher/TeacherLanding.jsx';
import StudentLanding from './student/StudentLanding.jsx';
import DisplayQuestion from './teacher/DisplayQuestion.jsx';
import Finish from './teacher/Finish.jsx';
import ChooseQuiz from './teacher/ChooseQuiz.jsx';
import ShowAllQuestions from './teacher/ShowAllQuestions.jsx';
import TeacherLayout from './teacher/TeacherLayout.jsx';
import StudentLayout from './student/StudentLayout.jsx'; 
import PastMissions from './teacher/PastMissions.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <Router>
          <Routes>
              {/* Home page route */}
              <Route exact path="/" element={<HomePage />} />

              {/* Student routes wrapped in StudentLayout */}
              <Route path="/student" element={<StudentLayout><StudentLanding /></StudentLayout>} />
              <Route path="/waiting/:roomCode" element={<StudentLayout><WaitingArea /></StudentLayout>} />
              <Route path="/start/:roomCode" element={<StudentLayout><Start /></StudentLayout>} />
              <Route path="/question1/:roomCode" element={<StudentLayout><IndividualQuestion /></StudentLayout>} />
              <Route path="/groupquestion/:roomCode" element={<StudentLayout><GroupQuestion /></StudentLayout>} />
              <Route path="/correct" element={<StudentLayout><Correct /></StudentLayout>} />
              <Route path="/incorrect" element={<StudentLayout><Incorrect /></StudentLayout>} />
              <Route path="/end" element={<StudentLayout><End /></StudentLayout>} />
              <Route path="/debrief" element={<StudentLayout><Debrief /></StudentLayout>} />

              {/* Teacher routes wrapped in TeacherLayout */}
              <Route path="/teacher" element={<TeacherLayout><TeacherLanding /></TeacherLayout>} />
              <Route path="/teacher/choosequiz" element={<TeacherLayout><ChooseQuiz /></TeacherLayout>} />
              <Route path="/teacher/allquestions" element={<TeacherLayout><ShowAllQuestions /></TeacherLayout>} />
              <Route path="/teacher/dashboard" element={<TeacherLayout><DisplayRoomCode/></TeacherLayout>} />
              <Route path="/teacher/displayquestion/:roomCode" element={<TeacherLayout><DisplayQuestion /></TeacherLayout>} />
              <Route path="/teacher/pastmissions" element={<TeacherLayout><PastMissions/></TeacherLayout>} />
              <Route path="/teacher/finish" element={<TeacherLayout><Finish/></TeacherLayout>} />

          </Routes>
      </Router>
    </>
  </StrictMode>,
)