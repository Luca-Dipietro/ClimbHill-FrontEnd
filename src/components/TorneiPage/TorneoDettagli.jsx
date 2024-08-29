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

  useEffect(() => {
    const fetchTorneo = async () => {
      try {
        const response = await findTorneoById(id);
        setTorneo(response);
        const partecipantiResponse = await getPartecipazioniPerTorneo(response.nome);
        setPartecipanti(partecipantiResponse);

        const userProfile = await getProfile();
        setSquadre(userProfile.squadre);

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
          <strong>Data Inizio:</strong> {torneo.dataInizioIscrizione}
        </div>
        <div>
          <strong>Data Fine:</strong> {torneo.dataFineIscrizione}
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
                    <strong>Utente:</strong> {partecipazione.utente.username}
                  </>
                ) : (
                  <>
                    <strong>Squadra:</strong> {partecipazione.squadra.nome}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
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
