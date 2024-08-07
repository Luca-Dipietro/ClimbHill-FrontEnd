import { Button, Container, Nav, Navbar, NavDropdown, Offcanvas, Image } from "react-bootstrap";
import "../NavBar/NavBar.css";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useEffect, useState } from "react";
import logo from "../../assets/CLIMB.png";
import { fetchWithToken } from "../../api";

const capitalize = (str) => {
  if (typeof str !== "string") return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const fetchUserData = async () => {
  try {
    const data = await fetchWithToken("/utenti/me");
    if (data) {
      data.username = capitalize(data.username);
    }
    return data;
  } catch (error) {
    throw new Error("Effettua il login");
  }
};

const NavBar = () => {
  const expand = "md";
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUserData();
        setUserData(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const handleLoginModalClose = () => setShowLoginModal(false);
  const handleLoginModalShow = () => setShowLoginModal(true);
  const handleRegisterModalClose = () => setShowRegisterModal(false);
  const handleRegisterModalShow = () => setShowRegisterModal(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData(null);
    setError("");
    window.location.reload();
    window.location.href = "/";
  };

  const handleProtectedLinkClick = (e) => {
    if (!userData) {
      e.preventDefault();
      setShowLoginModal(true);
    }
  };

  return (
    <>
      <Navbar expand={expand} className="bg-dark">
        <Container fluid>
          <Navbar.Brand href="/" className="text-white">
            <div className="d-flex align-items-center">
              <img src={logo} alt="Logo" height={30} className="me-2" />
              <span className="fw-bold">ClimbHill</span>
            </div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-${expand}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link href="/" className="text-white">
                  Home
                </Nav.Link>
                <NavDropdown
                  title="Funzionalità"
                  id={`offcanvasNavbarDropdown-expand-${expand}`}
                  className="custom-nav-dropdown"
                >
                  <NavDropdown.Item href="/" onClick={handleProtectedLinkClick}>
                    Profilo
                  </NavDropdown.Item>
                </NavDropdown>
                {userData && <Image src={userData.avatar} height={30} width={30} className="mt-1 rounded" />}
              </Nav>
              <div className="d-flex align-items-center justify-content-end ">
                {!userData ? (
                  <>
                    <Button variant="primary" onClick={handleLoginModalShow}>
                      Login
                    </Button>
                    <Button variant="secondary" onClick={handleRegisterModalShow} className="ms-2">
                      Registrati
                    </Button>
                  </>
                ) : (
                  <Button variant="secondary" onClick={handleLogout} className="bg-transparent">
                    Logout
                  </Button>
                )}
              </div>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
      <LoginModal show={showLoginModal} handleClose={handleLoginModalClose} />
      <RegisterModal
        show={showRegisterModal}
        handleClose={handleRegisterModalClose}
        handleShowLoginModal={handleLoginModalShow}
      />
    </>
  );
};

export default NavBar;
