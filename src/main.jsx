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
          </Routes>
      </Router>
    </>
  </StrictMode>,
)
