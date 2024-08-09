import { useEffect, useState } from "react";
import { getAllTornei } from "../../api";
import "./TorneiDisponibili.css";

const TorneiDisponibili = () => {
  const [tornei, setTornei] = useState([]);

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

  return (
    <div className="tornei-container">
      <h2>Tornei Disponibili</h2>
      <ul>
        {tornei.map((torneo) => (
          <li key={torneo.id}>{torneo.nome}</li>
        ))}
      </ul>
    </div>
  );
};

export default TorneiDisponibili;
