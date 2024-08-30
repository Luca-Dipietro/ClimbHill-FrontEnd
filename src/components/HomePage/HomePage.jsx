import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { getAllGiochi } from "../../api";
import LoginModal from "../NavBar/LoginModal";
import RegisterModal from "../NavBar/RegisterModal";
import "./HomePage.css";

const HomePage = () => {
  const [giochi, setGiochi] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);

  useEffect(() => {
    const fetchGiochi = async () => {
      try {
        const data = await getAllGiochi();
        setGiochi(data.content.slice(0, 6));
      } catch (error) {
        console.error("Errore nel recupero dei giochi:", error);
      }
    };

    fetchGiochi();
  }, []);

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkAuthentication();
  }, []);

  const handleDiscoverMoreClick = () => {
    if (isLoggedIn) {
      window.location.href = "/giochidisponibili";
    } else {
      setShowAlertModal(true);
    }
  };

  const handleAlertModalClose = () => setShowAlertModal(false);
  const handleLoginModalClose = () => setShowLoginModal(false);
  const handleRegisterModalClose = () => setShowRegisterModal(false);

  return (
    <main className="homepage-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Benvenuto su ClimbHill!</h1>
          <p>Scopri i migliori giochi e sfida i tuoi amici.</p>
          <Button variant="primary" onClick={handleDiscoverMoreClick}>
            Scopri di più
          </Button>
        </div>
      </section>

      {isLoggedIn && (
        <section id="giochi" className="featured-games">
          <Container>
            <h2 className="text-center mb-4">Giochi in Evidenza</h2>
            <Row>
              {giochi.map((gioco) => (
                <Col key={gioco.id} sm={12} md={6} lg={4} className="mb-4">
                  <Card className="game-card">
                    <Card.Body>
                      <Card.Title>{gioco.nome}</Card.Title>
                      <Card.Text>{gioco.descrizione}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}

      <section className="cta">
        <Container>
          <h2>Unisciti a Noi!</h2>
          <p>Iscriviti per non perdere nessuna novità e per partecipare ai nostri tornei.</p>
          <Button variant="primary" onClick={() => setShowRegisterModal(true)}>
            Registrati ora
          </Button>
        </Container>
      </section>

      <Modal show={showAlertModal} onHide={handleAlertModalClose} dialogClassName="custom-modal">
        <Modal.Header className="custom-modal" closeButton>
          <Modal.Title>Accesso Richiesto</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal">
          <p>Per accedere a questa pagina, devi essere loggato. Per favore, accedi o registrati.</p>
        </Modal.Body>
        <Modal.Footer className="custom-modal">
          <Button
            variant="primary"
            onClick={() => {
              handleAlertModalClose();
              setShowLoginModal(true);
            }}
          >
            Accedi o Registrati
          </Button>
        </Modal.Footer>
      </Modal>

      <LoginModal
        show={showLoginModal}
        handleClose={handleLoginModalClose}
        handleShowRegisterModal={() => {
          handleLoginModalClose();
          setShowRegisterModal(true);
        }}
      />

      <RegisterModal show={showRegisterModal} handleClose={handleRegisterModalClose} />
    </main>
  );
};

export default HomePage;
