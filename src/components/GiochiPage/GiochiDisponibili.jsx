import { useEffect, useState } from "react";
import { getAllGiochi } from "../../api";
import "./GiochiDisponibili.css";

const GiochiDisponibili = () => {
  const [giochi, setGiochi] = useState([]);

  useEffect(() => {
    const fetchGiochi = async () => {
      try {
        const response = await getAllGiochi();
        setGiochi(response.content);
      } catch (error) {
        console.error("Errore durante il recupero dei giochi", error);
      }
    };

    fetchGiochi();
  }, []);

  return (
    <div className="giochi-container">
      <h2>Giochi Disponibili</h2>
      <ul>
        {giochi.map((gioco) => (
          <li key={gioco.id}>
            <span className="gioco-nome">{gioco.nome}</span>
            <span className="gioco-descrizione">{gioco.descrizione}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GiochiDisponibili;
