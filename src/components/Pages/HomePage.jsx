import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { getAllGiochi } from "../../api";
import "./HomePage.css";

const HomePage = ({ handleShowRegisterModal }) => {
  const [giochi, setGiochi] = useState([]);
  const [featuredGiochi, setFeaturedGiochi] = useState([]);

  useEffect(() => {
    const fetchGiochi = async () => {
      try {
        const data = await getAllGiochi();
        setGiochi(data.content);
        setFeaturedGiochi(data.content.filter((gioco) => gioco.isFeatured));
      } catch (error) {
        console.error("Errore nel recupero dei giochi:", error);
      }
    };

    fetchGiochi();
  }, []);

  return (
    <main className="homepage-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Benvenuto su ClimbHill!</h1>
          <p>Scopri i migliori giochi e sfida i tuoi amici.</p>
          <Button variant="primary" href="#giochi">
            Scopri di più
          </Button>
        </div>
      </section>

      <section id="giochi" className="featured-games">
        <Container>
          <h2 className="text-center mb-4">Giochi in Evidenza</h2>
          <Row>
            {featuredGiochi.map((gioco) => (
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

      <section className="cta">
        <Container>
          <h2>Unisciti a Noi!</h2>
          <p>Iscriviti per non perdere nessuna novità e per partecipare ai nostri tornei.</p>
          <Button variant="primary" onClick={handleShowRegisterModal}>
            Registrati ora
          </Button>
        </Container>
      </section>
    </main>
  );
};

export default HomePage;
