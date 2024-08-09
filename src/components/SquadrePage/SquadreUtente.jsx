import { useEffect, useState } from "react";
import { createSquadra, getProfile, getSquadreByUserId } from "../../api";
import "./SquadreUtente.css";

const capitalize = (str) => {
  if (typeof str !== "string") return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const fetchUserData = async () => {
  try {
    const data = await getProfile("/utenti/me");
    if (data) {
      data.username = capitalize(data.username);
      return data;
    }
  } catch (error) {
    throw new Error("Errore durante il recupero del profilo");
  }
};

const SquadreUtente = () => {
  const [profileData, setProfileData] = useState(null);
  const [squadre, setSquadre] = useState([]);
  const [nomeSquadra, setNomeSquadra] = useState("");

  useEffect(() => {
    const fetchUserAndSquadre = async () => {
      try {
        const userData = await fetchUserData();
        setProfileData(userData);

        if (userData && userData.id) {
          const squadreUtente = await getSquadreByUserId(userData.id);
          setSquadre(squadreUtente);
        }
      } catch (err) {
        console.error("Errore durante il recupero dell'utente o delle squadre:", err.message);
      }
    };

    fetchUserAndSquadre();
  }, []);

  const handleCreaSquadra = async () => {
    try {
      if (!profileData || !profileData.id) {
        console.error("Profilo utente non trovato");
        return;
      }

      const squadraData = { nome: nomeSquadra };
      await createSquadra(profileData.id, squadraData);

      const squadreUtente = await getSquadreByUserId(profileData.id);
      setSquadre(squadreUtente);
    } catch (error) {
      console.error("Errore durante la creazione della squadra", error);
    }
  };

  return (
    <div className="squadre-container">
      <h2>Le mie squadre</h2>
      <ul>
        {squadre.length > 0 ? (
          squadre.map((squadra) => <li key={squadra.id}>{squadra.nome}</li>)
        ) : (
          <li>Nessuna squadra disponibile</li>
        )}
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
