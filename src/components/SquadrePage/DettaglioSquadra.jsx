import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  findSquadraById,
  addMembroToSquadra,
  removeMembroFromSquadra,
  getProfile,
  getStatisticaBySquadraId,
  createStatistica,
  getMembriSquadra,
  uploadAvatarForSquadraMember,
} from "../../api";
import "./DettaglioSquadra.css";
import SuccessAlert from "../TorneiPage/SuccessAlert";

const DettaglioSquadra = () => {
  const { squadraId } = useParams();
  const navigate = useNavigate();
  const [squadra, setSquadra] = useState(null);
  const [statistica, setStatistica] = useState(null);
  const [membri, setMembri] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCapoSquadra, setIsCapoSquadra] = useState(false);
  const [newAvatar, setNewAvatar] = useState(null);
  const [newMembroUsername, setnewMembroUsername] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const closeSuccessAlert = () => {
    setSuccessMessage("");
  };

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

        try {
          const statisticaData = await getStatisticaBySquadraId(squadraId);
          setStatistica(statisticaData);
        } catch (error) {
          if (error.message === `Elemento con id ${squadraId} non è stato trovato!`) {
            const newStatistica = {
              nomeSquadra: squadraData.nome,
              partiteGiocate: 0,
              vittorie: 0,
            };
            const createdStatistica = await createStatistica(newStatistica);
            setStatistica(createdStatistica);
          } else {
            throw error;
          }
        }

        const membriData = await getMembriSquadra(squadraId);
        setMembri(membriData);
      } catch (error) {
        console.error("Errore durante il recupero dei dettagli della squadra o del profilo:", error);
        setError(error.message);
      }
    };

    fetchData();
  }, [squadraId]);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    setNewAvatar(file);
    if (file) {
      handleUploadAvatar(file);
    }
  };

  const handleUploadAvatar = async (file) => {
    if (file) {
      try {
        await uploadAvatarForSquadraMember(squadraId, file);
        const updatedSquadra = await findSquadraById(squadraId);
        setSquadra(updatedSquadra);
      } catch (error) {
        console.error("Errore durante l'aggiornamento dell'avatar", error);
      }
    }
  };

  const handleAddMembro = async () => {
    if (newMembroUsername) {
      try {
        await addMembroToSquadra(squadraId, newMembroUsername);
        const updatedMembri = await getMembriSquadra(squadraId);
        setMembri(updatedMembri);
        setnewMembroUsername("");

        setSuccessMessage("Membro aggiunto con successo alla squadra!");
      } catch (error) {
        console.error("Errore durante l'aggiunta del membro", error);
      }
    }
  };

  const handleRemoveMembro = async (utenteId) => {
    try {
      await removeMembroFromSquadra(squadraId, utenteId);
      const updatedMembri = await getMembriSquadra(squadraId);
      setMembri(updatedMembri);
    } catch (error) {
      console.error("Errore durante la rimozione del membro", error);
    }
  };

  if (!squadra) return <p>Caricamento...</p>;

  return (
    <div className="dettaglio-squadra-container">
      <h2>{squadra.nome}</h2>

      {successMessage && <SuccessAlert message={successMessage} onClose={closeSuccessAlert} />}

      <div className="avatar-wrapper">
        <img src={squadra.avatar} alt={`${squadra.nome} Avatar`} />
        {(isAdmin || isCapoSquadra) && (
          <div className="upload-avatar-container">
            <input type="file" onChange={handleAvatarChange} accept="image/*" id="upload-avatar-input" />
            <i className="fas fa-camera" onClick={() => document.getElementById("upload-avatar-input").click()}></i>
          </div>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}

      <h3>Statistiche</h3>
      {statistica ? (
        <ul>
          <li>Numero di partite giocate: {statistica.numeroPartiteGiocate}</li>
          <li>Vittorie: {statistica.vittorie}</li>
        </ul>
      ) : (
        <p>Caricamento statistiche...</p>
      )}

      {(isAdmin || isCapoSquadra) && (
        <>
          <h3>Membri</h3>
          <ul>
            {membri?.map((membro) => (
              <li key={membro.id}>
                {membro.username}
                <i className="fas fa-trash-alt remove-icon" onClick={() => handleRemoveMembro(membro.id)}></i>
              </li>
            ))}
          </ul>
          <div>
            <h3>Aggiunta Membri</h3>
            <input
              type="text"
              value={newMembroUsername}
              onChange={(e) => setnewMembroUsername(e.target.value)}
              placeholder="Username del nuovo membro"
            />
            <button onClick={handleAddMembro}>Aggiungi Membro</button>
          </div>
        </>
      )}
    </div>
  );
};

export default DettaglioSquadra;
