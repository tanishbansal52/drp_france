import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import IndividualQuestion from './student/IndividualQuestion.jsx'
import Debrief from './student/Debrief.jsx';
import Correct from './student/Correct.jsx';
import Incorrect from './student/Incorrect.jsx';
import End from './student/End.jsx';
import Start from './student/Start.jsx';
import WaitingArea from './student/Waiting.jsx';
import GroupQuestion from './student/GroupQuestion.jsx';
import DisplayRoomCode from './teacher/RoomCodeDisplay.jsx';
import HomePage from './HomePage.jsx';
import TeacherLanding from './teacher/TeacherLanding.jsx';
import StudentLanding from './student/StudentLanding.jsx';
import DisplayQuestion from './teacher/DisplayQuestion.jsx';
import Finish from './Finish.jsx';
import ChooseQuiz from './teacher/ChooseQuiz.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <Router>
          <Routes>
              <Route exact path="/" element={<HomePage />} />
              <Route path="/question1" element={<IndividualQuestion />} />
              <Route path="/groupquestion" element={<GroupQuestion />} />
              <Route path="/start" element={<Start />} />
              <Route path="/debrief" element={<Debrief />} />
              <Route path="/correct" element={<Correct />} />
              <Route path="/incorrect" element={<Incorrect />} />
              <Route path="/end" element={<End />} />
              <Route path="/waiting" element={<WaitingArea />} />
              <Route path="/teacher" element={<TeacherLanding />} />
              <Route path="/student" element={<StudentLanding />} />
              <Route path="/teacher/dashboard" element={<DisplayRoomCode/>} />
              <Route path="/teacher/displayquestion" element={<DisplayQuestion />} />
              <Route path="/teacher/choosequiz" element={<ChooseQuiz />} />
              <Route path="/finish" element={<Finish/>} />
          </Routes>
      </Router>
    </>
  </StrictMode>,
)