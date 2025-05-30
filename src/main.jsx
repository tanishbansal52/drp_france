import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import App from './App.jsx'
import Landing from './Landing.jsx'
import Debrief from './Debrief.jsx';
import Correct from './Correct.jsx';
import Incorrect from './Incorrect.jsx';
import End from './End.jsx';
import Start from './Start.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <Router>
          <Routes>
              <Route
                  exact
                  path="/"
                  element={<Landing />}
              />
              <Route
                  path="/question"
                  element={<App />}
              />
              <Route
                  path="/start"
                  element={<Start />}
              />
              <Route
                  path="/debrief"
                  element={<Debrief />}
              />
              <Route
                  path="/correct"
                  element={<Correct />}
              />
              <Route
                  path="/incorrect"
                  element={<Incorrect />}
              />
              <Route
                  path="/end"
                  element={<End />}
              />
          </Routes>
      </Router>
    </>
  </StrictMode>,
)
