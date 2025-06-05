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
import ShowAllQuestions from './teacher/ShowAllQuestions.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <Router>
          <Routes>
              {/* Home page route */}
              <Route exact path="/" element={<HomePage />} />

              {/* Student route (in order) */}
              <Route path="/student" element={<StudentLanding />} />
              <Route path="/waiting/:roomCode" element={<WaitingArea />} />
              <Route path="/start/:roomCode" element={<Start />} />
              <Route path="/question1/:roomCode" element={<IndividualQuestion />} />
              <Route path="/groupquestion/:roomCode" element={<GroupQuestion />} />
              <Route path="/correct" element={<Correct />} />
              <Route path="/incorrect" element={<Incorrect />} />
              <Route path="/end" element={<End />} />
              <Route path="/debrief" element={<Debrief />} />
              <Route path="/finish" element={<Finish/>} />

              {/* Teacher route (in order) */}
              <Route path="/teacher" element={<TeacherLanding />} />
              <Route path="/student" element={<StudentLanding />} />
              <Route path="/teacher/choosequiz" element={<ChooseQuiz />} />
              <Route path="/teacher/allquestions" element={<ShowAllQuestions />} />
              <Route path="/teacher/dashboard" element={<DisplayRoomCode/>} />
              <Route path="/teacher/displayquestion/:roomCode" element={<DisplayQuestion />} />
          </Routes>
      </Router>
    </>
  </StrictMode>,
)