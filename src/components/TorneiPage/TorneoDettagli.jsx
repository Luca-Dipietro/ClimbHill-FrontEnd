import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { findTorneoById, createPartecipazione, getPartecipazioniPerTorneo, getProfile } from "../../api";
import Modale from "./Modale";
import "./TorneoDettagli.css";

const TorneoDettagli = () => {
  const { id } = useParams();
  const [torneo, setTorneo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [iscrizione, setIscrizione] = useState(false);
  const [partecipanti, setPartecipanti] = useState([]);
  const [showModale, setShowModale] = useState(false);
  const [squadre, setSquadre] = useState([]);
  const [selectedSquadra, setSelectedSquadra] = useState(null);
  const [userIscrizioneSquadra, setUserIscrizioneSquadra] = useState(null);
  const [partite, setPartite] = useState([]);
  const [torneoIniziato, setTorneoIniziato] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [oggi, setOggi] = useState(new Date());
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const fetchTorneo = async () => {
      try {
        const response = await findTorneoById(id);
        setTorneo(response);
        const partecipantiResponse = await getPartecipazioniPerTorneo(response.nome);
        setPartecipanti(partecipantiResponse);

        const userProfile = await getProfile();
        setSquadre(userProfile.squadre);
        setUserRole(userProfile.ruolo);

        const userPartecipazione = partecipantiResponse.find(
          (p) => p.utente && p.utente.username === userProfile.username
        );
        if (userPartecipazione) {
          setUserIscrizioneSquadra(userPartecipazione.squadra ? userPartecipazione.squadra.nome : null);
          setIscrizione(true);
        }

        setLoading(false);
      } catch (error) {
        console.error("Errore durante il recupero del torneo", error);
        setLoading(false);
      }
    };

    fetchTorneo();
  }, [id]);

  const handleIscrizione = () => {
    if (torneo.tipoTorneo === "TORNEO_A_SQUADRE") {
      setShowModale(true);
    } else {
      iscriviAlTorneo();
    }
  };

  const iscriviAlTorneo = async (nomeSquadra = null) => {
    try {
      const userName = await getProfile();
      const partecipazioneData = {
        nomeTorneo: torneo.nome,
        ...(nomeSquadra ? { nomeSquadra } : { usernameUtente: userName.username }),
      };

      await createPartecipazione(partecipazioneData);
      setIscrizione(true);
      setUserIscrizioneSquadra(nomeSquadra);
      setShowModale(false);
    } catch (error) {
      console.error("Errore durante l'iscrizione al torneo", error);
    }
  };

  const handleSelectSquadra = (squadra) => {
    setSelectedSquadra(squadra);
    iscriviAlTorneo(squadra.nome);
  };

  const handleIniziaTorneo = () => {
    const dataInizioTorneo = new Date(torneo?.dataFineIscrizione);
    dataInizioTorneo.setDate(dataInizioTorneo.getDate() + 1);

    if (oggi < dataInizioTorneo) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }

    const partiteGenerare = [];
    for (let i = 0; i < partecipanti.length; i += 2) {
      const partita = partecipanti[i + 1]
        ? `${partecipanti[i].utente?.username || partecipanti[i].squadra.nome} vs ${
            partecipanti[i + 1].utente?.username || partecipanti[i + 1].squadra.nome
          }`
        : `${partecipanti[i].utente?.username || partecipanti[i].squadra.nome} vince automaticamente`;
      partiteGenerare.push(partita);
    }
    setPartite(partiteGenerare);
    setTorneoIniziato(true);
  };

  const dataInizioTorneo = new Date(torneo?.dataFineIscrizione);
  dataInizioTorneo.setDate(dataInizioTorneo.getDate() + 1);
  const inizioTorneoAttivo =
    userRole && (userRole === "ORGANIZZATORE" || userRole === "ADMIN") && oggi >= dataInizioTorneo;

  if (loading) {
    return <div>Caricamento in corso...</div>;
  }

  if (!torneo) {
    return <div>Torneo non trovato</div>;
  }

  return (
    <div className="torneo-dettaglio-container">
      <h2>{torneo.nome}</h2>
      <div className="torneo-info">
        <div>
          <strong>Data Inizio:</strong> {dataInizioTorneo.toLocaleDateString()}
        </div>
        <div>
          <strong>Numero Massimo di Partecipanti:</strong> {torneo.numeroMaxPartecipanti}
        </div>
        <div>
          <strong>Gioco:</strong> {torneo.gioco.nome}
        </div>
        <div>
          <strong>Descrizione:</strong> {torneo.descrizione || "Nessuna descrizione disponibile"}
        </div>
        <div>
          <strong>Tipo di torneo:</strong> {torneo.tipoTorneo}
        </div>
      </div>
      <button
        className={`iscriviti-button ${iscrizione || userIscrizioneSquadra ? "iscritto" : ""}`}
        onClick={handleIscrizione}
        disabled={iscrizione || userIscrizioneSquadra}
      >
        {iscrizione || userIscrizioneSquadra ? "Iscritto al Torneo" : "Iscriviti al Torneo"}
      </button>
      <div className="torneo-dettagli-content">
        <div className="partecipanti">
          <h3>Partecipanti</h3>
          <ul>
            {partecipanti.map((partecipazione) => (
              <li key={partecipazione.id}>
                {partecipazione.utente ? (
                  <>
                    <img src={partecipazione.utente.avatar} alt="Avatar utente" className="avatar" />
                    {partecipazione.utente.username}
                  </>
                ) : (
                  <>
                    <img src={partecipazione.squadra.logo} alt="Logo squadra" className="avatar" />
                    {partecipazione.squadra.nome}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
        {torneoIniziato && (
          <div className="partite">
            <h3>Partite del Torneo</h3>
            <ul>
              {partite.map((partita, index) => (
                <li key={index}>{partita}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {!torneoIniziato && (
        <>
          <button className="inizia-torneo-button" onClick={handleIniziaTorneo}>
            Inizia Torneo
          </button>
          {showWarning && (
            <div className="warning-message">
              Non è possibile iniziare il torneo prima della data di inizio: {dataInizioTorneo.toLocaleDateString()}
            </div>
          )}
        </>
      )}
      <Modale
        isOpen={showModale}
        onClose={() => setShowModale(false)}
        squadre={squadre}
        onSelectSquadra={handleSelectSquadra}
      />
    </div>
  );
};

export default TorneoDettagli;
