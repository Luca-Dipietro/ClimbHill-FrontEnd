import { useEffect, useState } from "react";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import { createStatistica, uploadAvatarForCurrentUser, getProfile, getStatisticaByUtenteId } from "../../api";
import "./ProfilePage.css";

const capitalize = (str) => {
  if (typeof str !== "string") return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const fetchUserData = async () => {
  try {
    const data = await getProfile("/utenti/me");
    if (data) {
      data.username = capitalize(data.username);
      return data;
    }
  } catch (error) {
    throw new Error("Errore durante il recupero del profilo");
  }
};

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [statistica, setStatistica] = useState(null);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUserData();
        setProfileData(userData);

        if (userData && userData.id) {
          try {
            const statisticaData = await getStatisticaByUtenteId(userData.id);

            if (statisticaData) {
              setStatistica(statisticaData);
            } else {
              const newStatistica = {
                userId: userData.id,
                usernameUtente: userData.username,
                partiteGiocate: 0,
                vittorie: 0,
              };
              const createdStatistica = await createStatistica(newStatistica);
              setStatistica(createdStatistica);
            }
          } catch (error) {
            console.error("Error while fetching or creating statistics:", error.message);
            setError(error.message);
          }
        } else {
          console.error("User data is missing or invalid:", userData);
        }
      } catch (error) {
        console.error("Error in fetchData:", error.message);
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
              <img src={profileData?.avatar} alt="Avatar" />
              <label htmlFor="avatar-upload" className="camera-button">
                <i className="bi bi-camera"></i>
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
                {profileData?.nome} {profileData?.cognome}
              </Card.Title>
              <Card.Text>Email: {profileData?.email}</Card.Text>
              <Card.Text>Username: {profileData?.username}</Card.Text>
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
