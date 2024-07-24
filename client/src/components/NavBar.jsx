import { Container, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LogoutButton } from "./AuthComponents";
import { EmojiSunglassesFill } from "react-bootstrap-icons";

// UPDATED
function NavHeader(props) {
    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container fluid>
                <Link to="/" className="navbar-brand">
                    <EmojiSunglassesFill size={30} className="me-2" />
                    What Do You Meme - WA1
                </Link>

                {props.loggedIn ? (
                    <Container className="d-flex justify-content-end">
                    <Link to="/profile" className="btn btn-outline-light me-3"> Profile </Link> 
                    <LogoutButton logout={props.handleLogout} />
                    </Container>
                ) : (
                    <Link to="/login" className="btn btn-outline-light">
                        Login
                    </Link>
                )}
            </Container>
        </Navbar>
    );
}

export default NavHeader;
