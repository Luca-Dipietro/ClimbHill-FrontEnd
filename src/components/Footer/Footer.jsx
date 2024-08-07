import { Container, Row, Col } from "react-bootstrap";
import { FaGithub, FaEnvelope } from "react-icons/fa";
import logo from "../../assets/CLIMB.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer" className="footer-custom">
      <Container>
        <Row className="align-items-center">
          <Col md={4} className="text-center text-md-left">
            <a href="/" className="footer-logo-link">
              <img src={logo} alt="Logo" className="footer-logo" />
              <span className="footer-site-name">ClimbHill</span>
            </a>
          </Col>
          <Col md={4} className="text-center my-3 my-md-0">
            <a href="mailto:luca.dipietro.ld@gmail.com" className="footer-link">
              <FaEnvelope className="footer-icon" /> luca.dipietro.ld@gmail.com
            </a>
            <br />
            <a
              href="https://github.com/Luca-Dipietro"
              className="footer-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="footer-icon" /> GitHub Profile
            </a>
          </Col>
          <Col md={4} className="text-center text-md-right">
            <p className="footer-text">© {new Date().getFullYear()} Luca Dipietro. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
