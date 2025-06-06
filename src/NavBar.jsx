import { Navbar, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react'
import audioService from './AudioService'  

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation() 

  // Stop background music on student-side routes
  useEffect(() => {
    if (!location.pathname.startsWith('/teacher')) {
      audioService.stop()
    }
  }, [location])

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <Navbar 
      bg="light" 
      expand="lg" 
      className="shadow-sm px-4 justify-content-between mb-4"
      fixed="top"
      style={{ 
        width: '100vw', 
        zIndex: 1030
      }}
    >
      <Navbar.Brand 
        href="/"
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      >
        Pentagon
      </Navbar.Brand>
      <Button variant="outline-dark" onClick={handleLogout}>
        Exit Quiz
      </Button>
    </Navbar>
  );
}

export default NavBar;