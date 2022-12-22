import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Header = () => {
  const { auth: { isAuthenticated }, signOut } = useAuth()


  return (
    <Navbar variant="dark" bg="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">Socket To Me</Navbar.Brand>
        <Nav>
          {
            isAuthenticated ?
              <>
                <Nav.Link as={Link} to="/dashboard/friendsearch">Find Friends</Nav.Link>
                <Nav.Link as={Link} to="/dashboard/chat">My Chats</Nav.Link>
              </>
              :
              <Nav.Link as={Link} to="/signin">Sign In</Nav.Link>
          }
          {
            isAuthenticated &&
            <Nav.Link onClick={signOut}>Sign Out</Nav.Link>
          }
        </Nav>
      </Container>
    </Navbar>
  )
}

export default Header