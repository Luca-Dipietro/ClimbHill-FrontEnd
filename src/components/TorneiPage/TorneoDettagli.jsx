import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { findTorneoById } from "../../api";
import "./TorneoDettagli.css";

const TorneoDettagli = () => {
  const { id } = useParams();
  const [torneo, setTorneo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTorneo = async () => {
      try {
        const response = await findTorneoById(id);
        setTorneo(response);
        setLoading(false);
      } catch (error) {
        console.error("Errore durante il recupero del torneo", error);
        setLoading(false);
      }
    };

    fetchTorneo();
  }, [id]);

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
      <button className="iscriviti-button">Iscriviti al Torneo</button>
    </div>
  );
};

export default TorneoDettagli;
