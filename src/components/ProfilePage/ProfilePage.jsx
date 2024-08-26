import { useEffect, useState } from "react";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import { fetchWithToken, getStatisticaByUtenteId, createStatistica, uploadAvatarForCurrentUser } from "../../api";
import "./ProfilePage.css";

const capitalize = (str) => {
  if (typeof str !== "string") return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const fetchUserData = async () => {
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
  const [userData, setUserData] = useState(null);
  const [statistica, setStatistica] = useState(null);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await fetchUserData();
        setUserData(profileData);

        if (profileData && profileData.id) {
          try {
            const statisticaData = await getStatisticaByUtenteId(profileData.id);
            setStatistica(statisticaData);
          } catch (error) {
            if (error.message === `Elemento con id ${profileData.id} non è stato trovato!`) {
              const newStatistica = {
                usernameUtente: profileData.username,
                partiteGiocate: 0,
                vittorie: 0,
              };
              const createdStatistica = await createStatistica(newStatistica);
              setStatistica(createdStatistica);
            } else {
              throw error;
            }
          }
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        await uploadAvatarForCurrentUser(file);
        setAvatar(URL.createObjectURL(file));
      } catch (error) {
        setError("Errore durante il caricamento dell'avatar.");
      }
    }
  };

  return (
    <Container className="profile-page-container">
      {error && <div className="error-message">{error}</div>}
      <Row>
        <Col md={4}>
          <Card className="profile-card">
            <div className="avatar-container">
              <img src={userData?.avatar || avatar} alt="Avatar" />
              <label htmlFor="avatar-upload" className="camera-button">
                <i className="fas fa-camera"></i>
              </label>
              <input
                type="file"
                id="avatar-upload"
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleAvatarUpload}
              />
            </div>
            <Card.Body>
              <Card.Title>
                {userData?.nome} {userData?.cognome}
              </Card.Title>
              <Card.Text>Email: {userData?.email}</Card.Text>
              <Card.Text>Username: {userData?.username}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          {statistica && (
            <Card className="stats-card">
              <Card.Body>
                <Card.Title>Statistiche</Card.Title>
                <ListGroup>
                  <ListGroup.Item>Partite Giocate: {statistica.numeroPartiteGiocate}</ListGroup.Item>
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
