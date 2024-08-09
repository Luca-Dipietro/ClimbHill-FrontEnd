import { useEffect, useState } from "react";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import { fetchWithToken, getProfile, getStatisticaById } from "../../api";
import "./ProfilePage.css";

const capitalize = (str) => {
  if (typeof str !== "string") return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const fetchProfileData = async () => {
  try {
    const data = await fetchWithToken("/utenti/me");
    if (data) {
      data.username = capitalize(data.username);
      return data;
    }
  } catch (error) {
    throw new Error("Errore durante il recupero del profilo");
  }
};

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [statistica, setStatistica] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await fetchProfileData();
        setProfile(profileData);

        if (profileData && profileData.id) {
          const statisticaData = await getStatisticaById(profileData.id);
          setStatistica(statisticaData);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <Container className="profile-page-container">
      {error && <div className="error-message">{error}</div>}
      <Row>
        <Col md={4}>
          <Card className="profile-card">
            <Card.Body>
              <Card.Title>
                {profile?.nome} {profile?.cognome}
              </Card.Title>
              <Card.Text>Email: {profile?.email}</Card.Text>
              <Card.Text>Username: {profile?.username}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          {statistica && (
            <Card className="stats-card">
              <Card.Body>
                <Card.Title>Statistiche</Card.Title>
                <ListGroup>
                  <ListGroup.Item>Partite Giocate: {statistica.partiteGiocate}</ListGroup.Item>
                  <ListGroup.Item>Vittorie: {statistica.vittorie}</ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
