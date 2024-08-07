import { Button, Container, Nav, Navbar, Image } from "react-bootstrap";
import "../NavBar/NavBar.css";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useEffect, useState } from "react";
import logo from "../../assets/CLIMB.png";
import { fetchWithToken } from "../../api";
import { FaHome, FaUser, FaTrophy, FaEnvelope } from "react-icons/fa";

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
  const expand = "lg";
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
      <Navbar expand={expand} className="navbar-custom bg-black">
        <Container fluid>
          <Navbar.Brand href="/" className="text-white d-flex align-items-center">
            <img src={logo} alt="Logo" className="logo-img me-2" />
            <span className="fw-bold text-uppercase">ClimbHill</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
          <Navbar.Collapse id={`offcanvasNavbar-expand-${expand}`} className="justify-content-end">
            <Nav className="me-auto">
              <Nav.Link href="/" className="text-white d-flex align-items-center">
                <FaHome className="me-1" /> Home
              </Nav.Link>
              <Nav.Link href="/" className="text-white d-flex align-items-center" onClick={handleProtectedLinkClick}>
                <FaUser className="me-1" /> Profilo
              </Nav.Link>
              <Nav.Link href="/" className="text-white d-flex align-items-center">
                <FaTrophy className="me-1" /> Tornei
              </Nav.Link>
              <Nav.Link href="#footer" className="text-white d-flex align-items-center">
                <FaEnvelope className="me-1" /> Contatti
              </Nav.Link>
            </Nav>
            <Nav>
              {!userData ? (
                <>
                  <Button variant="outline-light" onClick={handleLoginModalShow} className="custom-button">
                    Login
                  </Button>
                </>
              ) : (
                <>
                  <Image src={userData.avatar} height={30} width={30} className="rounded-circle me-2" />
                  <Button variant="outline-light" onClick={handleLogout} className="custom-button">
                    Logout
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <LoginModal
        show={showLoginModal}
        handleClose={handleLoginModalClose}
        handleShowRegisterModal={handleRegisterModalShow}
      />
      <RegisterModal show={showRegisterModal} handleClose={handleRegisterModalClose} />
    </>
  );
};

export default NavBar;
