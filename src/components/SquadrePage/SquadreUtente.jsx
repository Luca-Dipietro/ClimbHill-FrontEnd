import { useEffect, useState } from "react";
import { createSquadra, getProfile } from "../../api";
import "./SquadreUtente.css";

const SquadreUtente = () => {
  const [squadre, setSquadre] = useState([]);
  const [nomeSquadra, setNomeSquadra] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await getProfile();
        setSquadre(userProfile.squadre);
      } catch (error) {
        console.error("Errore durante il recupero del profilo utente", error);
      }
    };

    fetchProfile();
  }, []);

  const handleCreaSquadra = async () => {
    try {
      const squadraData = { nome: nomeSquadra };
      await createSquadra(squadraData);
      const userProfile = await getProfile();
      setSquadre(userProfile.squadre);
    } catch (error) {
      console.error("Errore durante la creazione della squadra", error);
    }
  };

  return (
    <div className="squadre-container">
      <h2>Le mie squadre</h2>
      <ul>
        {squadre.map((squadra) => (
          <li key={squadra.id}>{squadra.nome}</li>
        ))}
      </ul>
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
