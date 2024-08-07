import { useState } from "react";
import { register } from "../../api";
import { Alert, Button, Form, Modal } from "react-bootstrap";

// eslint-disable-next-line react/prop-types
const RegisterModal = ({ show, handleClose }) => {
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!acceptedTerms) {
      setError("Devi accettare i termini di privacy.");
      return;
    }
    try {
      const result = await register(username, email, password, nome, cognome);
      if (result) {
        setSuccess("Registrazione eseguita con successo!");
        setError("");
        setNome("");
        setCognome("");
        setUsername("");
        setEmail("");
        setPassword("");
        setAcceptedTerms(false);
        handleClose();
      }
    } catch (error) {
      setError("Registrazione fallita!");
      setSuccess("");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} className="login-modal">
      <Modal.Header closeButton>
        <Modal.Title>Registrati</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Inserisci Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Inserisci Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formNome">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              placeholder="Inserisci Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCognome">
            <Form.Label>Cognome</Form.Label>
            <Form.Control
              type="text"
              placeholder="Inserisci Cognome"
              value={cognome}
              onChange={(e) => setCognome(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formTerms">
            <Form.Check
              type="checkbox"
              label="Accetto i termini di privacy"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Registrati
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RegisterModal;
