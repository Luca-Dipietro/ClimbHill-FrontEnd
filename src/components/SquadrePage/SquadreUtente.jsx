import { useEffect, useState } from "react";
import { createSquadra, getProfile } from "../../api";
import "./SquadreUtente.css";
import { Link } from "react-router-dom";

const SquadreUtente = () => {
  const [squadre, setSquadre] = useState([]);
  const [nomeSquadra, setNomeSquadra] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await getProfile();
        setSquadre(userProfile.squadre);
        setUserId(userProfile.id);
      } catch (error) {
        console.error("Errore durante il recupero del profilo utente", error);
      }
    };

    fetchProfile();
  }, []);

  const handleCreaSquadra = async () => {
    if (!userId) {
      console.error("ID utente non disponibile");
      return;
    }

    try {
      const squadraData = { nome: nomeSquadra };
      await createSquadra(userId, squadraData);
      const updatedProfile = await getProfile();
      setSquadre(updatedProfile.squadre);
    } catch (error) {
      console.error("Errore durante la creazione della squadra", error);
    }
  };

  return (
    <div className="squadre-container">
      <h2>Le mie squadre</h2>
      <ul>
        {squadre?.map((squadra) => (
          <li key={squadra.id}>
            <Link to={`/squadreutente/${squadra.id}`}>{squadra.nome}</Link>
          </li>
        ))}
      </ul>
      <h2>Creazione Squadra</h2>
      <input
        type="text"
        value={nomeSquadra}
        onChange={(e) => setNomeSquadra(e.target.value)}
        placeholder="Nome della nuova squadra"
      />
      <button onClick={handleCreaSquadra}>Crea Squadra</button>
    </div>
  );
};

export default SquadreUtente;
