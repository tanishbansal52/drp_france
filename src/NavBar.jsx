import { Navbar, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();

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