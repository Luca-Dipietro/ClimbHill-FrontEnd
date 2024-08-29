import { useEffect, useState } from "react";
import { getAllTornei, createTorneo, getAllGiochi, getProfile } from "../../api";
import { useNavigate } from "react-router-dom";
import "./TorneiDisponibili.css";
import SuccessAlert from "./SuccessAlert";

const TorneiDisponibili = () => {
  const [tornei, setTornei] = useState([]);
  const [giochi, setGiochi] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [utenteId, setUtenteId] = useState(null);
  const [newTorneo, setNewTorneo] = useState({
    nome: "",
    descrizione: "",
    numeroMaxPartecipanti: 0,
    dataInizioIscrizione: "",
    dataFineIscrizione: "",
    tipoTorneo: "torneo_singolo",
    nomeGioco: "",
  });
  const [showForm, setShowForm] = useState(false);

  const closeSuccessAlert = () => {
    setSuccessMessage("");
  };

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

    const fetchProfileAndGiochi = async () => {
      try {
        const profile = await getProfile();
        setUtenteId(profile.id);

        const giochiResponse = await getAllGiochi();
        setGiochi(giochiResponse.content);
      } catch (error) {
        console.error("Errore durante il recupero dei dati", error);
      }
    };

    fetchTornei();
    fetchProfileAndGiochi();
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTorneo({ ...newTorneo, [name]: value });
  };

  const handleCreateTorneo = async (e) => {
    e.preventDefault();
    try {
      if (utenteId) {
        const createdTorneo = await createTorneo(utenteId, newTorneo);
        setTornei([...tornei, createdTorneo]);

        setSuccessMessage(`Torneo "${createdTorneo.nome}" creato con successo!`);

        setNewTorneo({
          nome: "",
          descrizione: "",
          numeroMaxPartecipanti: 0,
          dataInizioIscrizione: "",
          dataFineIscrizione: "",
          tipoTorneo: "torneo_singolo",
          nomeGioco: "",
        });

        setShowForm(false);
      } else {
        setAlertMessage("Errore nel recupero dell'utente, riprova più tardi.");
      }
    } catch (error) {
      console.error("Errore durante la creazione del torneo:", error.message);
      setAlertMessage("Errore nella creazione del torneo, riprova.");
    }
  };

  return (
    <div className="tornei-container">
      <h2>Tornei Disponibili</h2>
      {alertMessage && (
        <div className="modal">
          <div className="modal-content">
            <h3>Attenzione</h3>
            <p>{alertMessage}</p>
            <button className="modal-close-button" onClick={() => setAlertMessage("")}>
              Chiudi
            </button>
          </div>
        </div>
      )}

      {successMessage && <SuccessAlert message={successMessage} onClose={closeSuccessAlert} />}

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

      <div className="create-torneo-toggle">
        <button onClick={() => setShowForm(!showForm)} className="action-button">
          {showForm ? "-" : "+"} Crea Torneo
        </button>
      </div>

      {showForm && (
        <div className="create-torneo-container">
          <h3>Crea un Nuovo Torneo</h3>
          <form onSubmit={handleCreateTorneo} className="create-torneo-form">
            <input
              type="text"
              name="nome"
              placeholder="Nome Torneo"
              value={newTorneo.nome}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="descrizione"
              placeholder="Descrizione"
              value={newTorneo.descrizione}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="numeroMaxPartecipanti"
              placeholder="Numero Max Partecipanti"
              value={newTorneo.numeroMaxPartecipanti}
              onChange={handleInputChange}
              required
            />
            <input
              type="date"
              name="dataInizioIscrizione"
              placeholder="Data Inizio Iscrizione"
              value={newTorneo.dataInizioIscrizione}
              onChange={handleInputChange}
              required
            />
            <input
              type="date"
              name="dataFineIscrizione"
              placeholder="Data Fine Iscrizione"
              value={newTorneo.dataFineIscrizione}
              onChange={handleInputChange}
              required
            />

            <select name="tipoTorneo" value={newTorneo.tipoTorneo} onChange={handleInputChange} required>
              <option value="torneo_singolo">Torneo Singolo</option>
              <option value="torneo_a_squadre">Torneo a Squadre</option>
            </select>

            <select name="nomeGioco" value={newTorneo.nomeGioco} onChange={handleInputChange} required>
              <option value="">Seleziona un Gioco</option>
              {giochi.map((gioco) => (
                <option key={gioco.id} value={gioco.nome}>
                  {gioco.nome}
                </option>
              ))}
            </select>

            <button type="submit" className="action-button">
              Crea Torneo
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TorneiDisponibili;
