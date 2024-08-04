import './Navbar.css'
import Nav from 'react-bootstrap/Nav';
import logo from '../../assets/logo1.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBurger } from '@fortawesome/free-solid-svg-icons' // Importe o ícone específico que você quer usar
import { Navigate, useNavigate } from 'react-router-dom';

const NavBar = ({ onToken }: any) => {
  const navigate = useNavigate();
  
  function exit() {
    sessionStorage.removeItem('token');
    onToken(false)
    navigate('/')
  }

  return (
    <Nav className='mt-2 mb-2'>
      <img src={logo} alt="Logo" height="60" className='ms-2' />
      <Nav.Item className='nav-item margin-nav margin-nav-link mt-3 pointer'>
        <Nav.Link  className="nav-link text-hover tipografia">
          <FontAwesomeIcon icon={faBurger} /> Menu</Nav.Link> {/* Use o ícone importado aqui */}
      </Nav.Item>
      <Nav.Item className='nav-item margin-nav margin-nav-link mt-3 pointer'>
        <li className='nav-link text-hover tipografia' onClick={exit}>Sair</li>
      </Nav.Item>
    </Nav>
  );
};

export default NavBar;