import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTornei, getPartecipazioni } from "../../api";
import "./MieiTorneiPage.css";

const MieiTorneiPage = () => {
  const [torneiDisponibili, setTorneiDisponibili] = useState([]);
  const [torneiIscritto, setTorneiIscritto] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllTornei()
      .then((data) => setTorneiDisponibili(data.content))
      .catch((error) => console.error("Errore nel recupero dei tornei disponibili:", error));
    getPartecipazioni()
      .then((data) => {
        const tornei = data.content.map((partecipazione) => partecipazione.torneo);
        setTorneiIscritto(tornei);
      })
      .catch((error) => console.error("Errore nel recupero dei tornei a cui sei iscritto:", error));
  }, []);

  const handleClick = (id) => {
    navigate(`/torneoDettagli/${id}`);
  };

  return (
    <div className="miei-tornei-container">
      <section>
        <h2>Tornei Organizzati</h2>
        <ul>
          {torneiDisponibili.map((torneo) => (
            <li key={torneo.id} onClick={() => handleClick(torneo.id)}>
              {torneo.nome}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Tornei a cui sei iscritto</h2>
        <ul>
          {torneiIscritto.map((torneo) => (
            <li key={torneo.id} onClick={() => handleClick(torneo.id)}>
              {torneo.nome}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default MieiTorneiPage;
