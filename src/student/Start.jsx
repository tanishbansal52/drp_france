import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import '../css/App.css'
import NavBar from '../NavBar';

function Start() {
  const navigate = useNavigate();

  return (
    <>
    <NavBar />
      <div className="text-center mb-10">
        <h1>Mission Topic - Algebra</h1>
        <h2 className="text-info mb-5">Rules of the mission:</h2>
      </div>
      <p className="text-center"> No cheating! </p>
      <p className="text-center"> Answer questions faster for more points.</p>
      <p className="text-center"> You can try again If you get an answer wrong but you wont get as many points. </p>
      <p className="text-center mb-5"> Nominate a group leader to enter the answers.</p>
      <p className="text-center"> Good luck agents!</p>
      <div className="flex flex-col items-center justify-center"> 
      <a 
        className="btn btn-warning btn-lg" 
        onClick={() => navigate('/question1')}
        role="button" 
        tabIndex={0}
      >
        Continue
      </a>
    </div>
    </>
  )
}

export default Start