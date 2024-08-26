import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { findSquadraById, updateSquadraById, addMembroToSquadra, removeMembroFromSquadra, getProfile } from "../../api";
import "./DettaglioSquadra.css";

const DettaglioSquadra = () => {
  const { squadraId } = useParams();
  const navigate = useNavigate();
  const [squadra, setSquadra] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCapoSquadra, setIsCapoSquadra] = useState(false);
  const [newAvatar, setNewAvatar] = useState(null);
  const [newMembroId, setNewMembroId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const squadraData = await findSquadraById(squadraId);
        setSquadra(squadraData);

        const userProfile = await getProfile();
        const { ruoli } = userProfile;

        const ruoloAdmin = ruoli.some((ruolo) => ruolo.ruolo === "ADMIN");
        const ruoloCapoSquadra = ruoli.some((ruolo) => ruolo.ruolo === "CAPO_SQUADRA");

        setIsAdmin(ruoloAdmin);
        setIsCapoSquadra(ruoloCapoSquadra);
      } catch (error) {
        console.error("Errore durante il recupero dei dettagli della squadra o del profilo:", error);
      }
    };

    fetchData();
  }, [squadraId]);

  const handleAvatarChange = (event) => {
    setNewAvatar(event.target.files[0]);
  };

  const handleUploadAvatar = async () => {
    if (newAvatar) {
      try {
        await updateSquadraById(squadraId, { avatar: newAvatar });
        const updatedSquadra = await findSquadraById(squadraId);
        setSquadra(updatedSquadra);
      } catch (error) {
        console.error("Errore durante l'aggiornamento dell'avatar", error);
      }
    }
  };

  const handleAddMembro = async () => {
    if (newMembroId) {
      try {
        await addMembroToSquadra(squadraId, newMembroId);
        const updatedSquadra = await findSquadraById(squadraId);
        setSquadra(updatedSquadra);
        setNewMembroId("");
      } catch (error) {
        console.error("Errore durante l'aggiunta del membro", error);
      }
    }
  };

  const handleRemoveMembro = async (utenteId) => {
    try {
      await removeMembroFromSquadra(squadraId, utenteId);
      const updatedSquadra = await findSquadraById(squadraId);
      setSquadra(updatedSquadra);
    } catch (error) {
      console.error("Errore durante la rimozione del membro", error);
    }
  };

  if (!squadra) return <p>Caricamento...</p>;

  return (
    <div className="dettaglio-squadra-container">
      <h2>{squadra.nome}</h2>
      <div className="avatar-wrapper">
        <img src={squadra.avatar} alt={`${squadra.nome} Avatar`} />
        {(isAdmin || isCapoSquadra) && (
          <div className="upload-avatar-container">
            <input type="file" onChange={handleAvatarChange} accept="image/*" id="upload-avatar-input" />
            <i className="fas fa-camera" onClick={() => document.getElementById("upload-avatar-input").click()}></i>
          </div>
        )}
      </div>
      <h3>Statistiche</h3>
      <ul>
        {squadra.statistiche?.map((statistica) => (
          <li key={statistica.id}>
            {statistica.numeroPartiteGiocate} : {statistica.vittorie}
          </li>
        ))}
      </ul>
      {isAdmin ||
        (isCapoSquadra && (
          <>
            <h3>Membri</h3>
            <ul>
              {squadra.membri?.map((membro) => (
                <li key={membro.id}>
                  {membro.username}
                  <button onClick={() => handleRemoveMembro(membro.id)}>Rimuovi</button>
                </li>
              ))}
            </ul>
            <div>
              <input
                type="text"
                value={newMembroId}
                onChange={(e) => setNewMembroId(e.target.value)}
                placeholder="ID del nuovo membro"
              />
              <button onClick={handleAddMembro}>Aggiungi Membro</button>
            </div>
          </>
        ))}
    </div>
  );
};

export default DettaglioSquadra;
