import { useEffect, useState } from "react";
import { getAllTornei } from "../../api";
import { useNavigate } from "react-router-dom";
import "./TorneiDisponibili.css";

const TorneiDisponibili = () => {
  const [tornei, setTornei] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTornei = async () => {
      try {
        const response = await getAllTornei();
        setTornei(response.content);
      } catch (error) {
        console.error("Errore durante il recupero dei tornei", error);
      }
    };

    fetchTornei();
  }, []);

  const handleIscrivitiClick = (torneo) => {
    const now = new Date();
    const dataInizioIscrizione = new Date(torneo.dataInizioIscrizione);

    if (now < dataInizioIscrizione) {
      setAlertMessage(
        `Le iscrizioni per ${torneo.nome} non sono ancora aperte. Torna il ${torneo.dataInizioIscrizione}`
      );
    } else {
      navigate(`/torneodettagli/${torneo.id}`);
    }
  };

  const closeModal = () => {
    setAlertMessage("");
  };

  return (
    <div className="tornei-container">
      <h2>Tornei Disponibili</h2>
      {alertMessage && (
        <div className="modal">
          <div className="modal-content">
            <h3>Attenzione</h3>
            <p>{alertMessage}</p>
            <button className="modal-close-button" onClick={closeModal}>
              Chiudi
            </button>
          </div>
        </div>
      )}
      <div className="tornei-header">
        <span>Nome</span>
        <span>Data Inizio Iscrizione</span>
        <span>Data Fine Iscrizione</span>
        <span>Giocatori</span>
        <span>Gioco</span>
        <span></span>
      </div>
      <ul className="tornei-list">
        {tornei.map((torneo) => (
          <li key={torneo.id}>
            <div className="torneo-name">{torneo.nome}</div>
            <div className="torneo-time">{torneo.dataInizioIscrizione}</div>
            <div className="torneo-time">{torneo.dataFineIscrizione}</div>
            <div className="torneo-players">{torneo.numeroMaxPartecipanti}</div>
            <div className="torneo-game">{torneo.gioco.nome}</div>
            <div className="torneo-action">
              <button className="action-button" onClick={() => handleIscrivitiClick(torneo)}>
                Iscriviti
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TorneiDisponibili;
