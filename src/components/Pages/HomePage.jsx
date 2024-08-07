import { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { fetchWithToken } from "../../api";
import "./HomePage.css";

const HomePage = () => {
  const [giochi, setGiochi] = useState([]);

  useEffect(() => {
    const fetchGiochi = async () => {
      try {
        const data = await fetchWithToken("/giochi");
        setGiochi(data.content);
      } catch (error) {
        console.error("Errore nel recupero dei giochi:", error);
      }
    };

    fetchGiochi();
  }, []);

  return (
    <Container className="homepage-container mt-5">
      <h1 className="text-center text-white mb-4">Giochi Disponibili</h1>
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
  );
};

export default HomePage;
