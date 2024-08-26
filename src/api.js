const API_URL = import.meta.env.VITE_API_URL;

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    const error = new Error(errorData.message || "Errore durante la richiesta");
    error.status = response.status;
    throw error;
  }
  return response.json();
};

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await handleResponse(response);
    localStorage.setItem("token", data.accessToken);
    return data;
  } catch (error) {
    console.error("Errore durante il login:", error.message);
    throw error;
  }
};

export const register = async (username, email, password, nome, cognome) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password, nome, cognome }),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante la registrazione:", error.message);
    throw error;
  }
};

export const fetchWithToken = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante la richiesta:", error.message);
    throw error;
  }
};

export const createGioco = async (giocoData) => {
  try {
    const response = await fetch(`${API_URL}/giochi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(giocoData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante la creazione del gioco:", error.message);
    throw error;
  }
};

export const findGiocoById = async (giocoId) => {
  try {
    const response = await fetch(`${API_URL}/giochi/${giocoId}`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante il recupero del gioco per ID:", error.message);
    throw error;
  }
};

export const findGiocoByNome = async (nome) => {
  try {
    const response = await fetch(`${API_URL}/giochi/nomeGioco/${nome}`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante il recupero del gioco per nome:", error.message);
    throw error;
  }
};

export const getAllGiochi = async (page = 0, size = 10, sortBy = "nome") => {
  try {
    const response = await fetch(`${API_URL}/giochi?page=${page}&size=${size}&sortBy=${sortBy}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante il recupero dei giochi:", error.message);
    throw error;
  }
};

export const updateGiocoById = async (giocoId, giocoData) => {
  try {
    const response = await fetch(`${API_URL}/giochi/${giocoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(giocoData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante l'aggiornamento del gioco:", error.message);
    throw error;
  }
};

export const deleteGiocoById = async (giocoId) => {
  try {
    const response = await fetch(`${API_URL}/giochi/${giocoId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Errore durante la cancellazione del gioco");
    }
  } catch (error) {
    console.error("Errore durante la cancellazione del gioco:", error.message);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const response = await fetch(`${API_URL}/utenti/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante il recupero del profilo:", error.message);
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await fetch(`${API_URL}/utenti/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(profileData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante l'aggiornamento del profilo:", error.message);
    throw error;
  }
};

export const getAllUtenti = async (page = 0, size = 10, sortBy = "id") => {
  try {
    const response = await fetch(`${API_URL}/utenti?page=${page}&size=${size}&sortBy=${sortBy}`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante il recupero degli utenti:", error.message);
    throw error;
  }
};

export const findUtenteById = async (utenteId) => {
  try {
    const response = await fetch(`${API_URL}/utenti/${utenteId}`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante il recupero dell'utente per ID:", error.message);
    throw error;
  }
};

export const updateUtenteById = async (utenteId, userData) => {
  try {
    const response = await fetch(`${API_URL}/utenti/${utenteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante l'aggiornamento dell'utente:", error.message);
    throw error;
  }
};

export const deleteUtenteById = async (utenteId) => {
  try {
    const response = await fetch(`${API_URL}/utenti/${utenteId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Errore durante la cancellazione dell'utente");
    }
  } catch (error) {
    console.error("Errore durante la cancellazione dell'utente:", error.message);
    throw error;
  }
};

export const uploadAvatarForUser = async (utenteId, avatarFile) => {
  const formData = new FormData();
  formData.append("avatar", avatarFile);

  try {
    const response = await fetch(`${API_URL}/utenti/${utenteId}/avatar`, {
      method: "PATCH",
      body: formData,
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante il caricamento dell'avatar per l'utente:", error.message);
    throw error;
  }
};

export const uploadAvatarForCurrentUser = async (avatarFile) => {
  const formData = new FormData();
  formData.append("avatar", avatarFile);

  try {
    const response = await fetch(`${API_URL}/utenti/me/avatar`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante il caricamento dell'avatar per l'utente autenticato:", error.message);
    throw error;
  }
};

export const createSquadra = async (utenteId, squadraData) => {
  try {
    const response = await fetch(`${API_URL}/squadre/${utenteId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(squadraData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante la creazione della squadra:", error.message);
    throw error;
  }
};

export const findSquadraById = async (squadraId) => {
  try {
    const response = await fetch(`${API_URL}/squadre/${squadraId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante il recupero della squadra per ID:", error.message);
    throw error;
  }
};

export const findSquadraByNome = async (nome) => {
  try {
    const response = await fetch(`${API_URL}/squadre/nome?nome=${nome}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante il recupero della squadra per nome:", error.message);
    throw error;
  }
};

export const updateSquadraById = async (squadraId, squadraData) => {
  try {
    const response = await fetch(`${API_URL}/squadre/${squadraId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(squadraData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante l'aggiornamento della squadra:", error.message);
    throw error;
  }
};

export const deleteSquadraById = async (squadraId) => {
  try {
    const response = await fetch(`${API_URL}/squadre/${squadraId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Errore durante la cancellazione della squadra");
    }
  } catch (error) {
    console.error("Errore durante la cancellazione della squadra:", error.message);
    throw error;
  }
};

export const addMembroToSquadra = async (squadraId, utenteId) => {
  try {
    const response = await fetch(`${API_URL}/squadre/${squadraId}/membri/${utenteId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante l'aggiunta del membro alla squadra:", error.message);
    throw error;
  }
};

export const removeMembroFromSquadra = async (squadraId, utenteId) => {
  try {
    const response = await fetch(`${API_URL}/squadre/${squadraId}/membri/${utenteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Errore durante la rimozione del membro dalla squadra");
    }
  } catch (error) {
    console.error("Errore durante la rimozione del membro dalla squadra:", error.message);
    throw error;
  }
};

export const uploadAvatarForSquadraMember = async (utenteId, avatarFile) => {
  const formData = new FormData();
  formData.append("avatar", avatarFile);

  try {
    const response = await fetch(`${API_URL}/squadre/${utenteId}/avatar`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante il caricamento dell'avatar per il membro della squadra:", error.message);
    throw error;
  }
};

export const createTorneo = async (utenteId, torneoData) => {
  try {
    const response = await fetch(`${API_URL}/tornei/${utenteId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(torneoData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante la creazione del torneo:", error.message);
    throw error;
  }
};

export const findTorneoById = async (torneoId) => {
  try {
    const response = await fetch(`${API_URL}/tornei/${torneoId}`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante il recupero del torneo per ID:", error.message);
    throw error;
  }
};

export const getAllTornei = async (page = 0, size = 10, sortBy = "id") => {
  try {
    const response = await fetch(`${API_URL}/tornei?page=${page}&size=${size}&sortBy=${sortBy}`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante il recupero dei tornei:", error.message);
    throw error;
  }
};

export const updateTorneoById = async (torneoId, torneoData) => {
  try {
    const response = await fetch(`${API_URL}/tornei/${torneoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(torneoData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante l'aggiornamento del torneo:", error.message);
    throw error;
  }
};

export const deleteTorneoById = async (torneoId) => {
  try {
    const response = await fetch(`${API_URL}/tornei/${torneoId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Errore durante la cancellazione del torneo");
    }
  } catch (error) {
    console.error("Errore durante la cancellazione del torneo:", error.message);
    throw error;
  }
};

export const searchTornei = async (
  nome,
  tipoTorneo,
  dataInizioIscrizione,
  dataFineIscrizione,
  page = 0,
  size = 10,
  sortBy = "nome"
) => {
  try {
    const queryParams = new URLSearchParams({
      nome: nome || "",
      tipoTorneo: tipoTorneo || "",
      dataInizioIscrizione: dataInizioIscrizione || "",
      dataFineIscrizione: dataFineIscrizione || "",
      page,
      size,
      sortBy,
    }).toString();

    const response = await fetch(`${API_URL}/tornei/search?${queryParams}`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante la ricerca dei tornei:", error.message);
    throw error;
  }
};

export const createPartecipazione = async (partecipazioneData) => {
  try {
    const response = await fetch(`${API_URL}/partecipazioni`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(partecipazioneData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante la creazione della partecipazione:", error.message);
    throw error;
  }
};

export const getPartecipazioni = async (pageNumber = 0, pageSize = 10, sortBy = "id") => {
  try {
    const response = await fetch(
      `${API_URL}/partecipazioni?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}`
    );
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante il recupero delle partecipazioni:", error.message);
    throw error;
  }
};

export const createPartita = async (partitaData) => {
  try {
    const response = await fetch(`${API_URL}/partite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(partitaData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante la creazione della partita:", error.message);
    throw error;
  }
};

export const createRisultato = async (partitaId, risultatoData) => {
  try {
    const response = await fetch(`${API_URL}/risultati/${partitaId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(risultatoData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante la creazione del risultato:", error.message);
    throw error;
  }
};

export const getRisultatoById = async (risultatoId) => {
  try {
    const response = await fetch(`${API_URL}/risultati/${risultatoId}`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante il recupero del risultato:", error.message);
    throw error;
  }
};

export const updateRisultatoById = async (risultatoId, risultatoData) => {
  try {
    const response = await fetch(`${API_URL}/risultati/${risultatoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(risultatoData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante l'aggiornamento del risultato:", error.message);
    throw error;
  }
};

export const deleteRisultatoById = async (risultatoId) => {
  try {
    const response = await fetch(`${API_URL}/risultati/${risultatoId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.message || "Errore durante la cancellazione del risultato");
      error.status = response.status;
      throw error;
    }
  } catch (error) {
    console.error("Errore durante la cancellazione del risultato:", error.message);
    throw error;
  }
};

export const getAllRisultati = async (page = 0, size = 10, sortBy = "id") => {
  try {
    const response = await fetch(`${API_URL}/risultati?page=${page}&size=${size}&sortBy=${sortBy}`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante il recupero dei risultati:", error.message);
    throw error;
  }
};

export const createStatistica = async (statisticaData) => {
  try {
    const response = await fetch(`${API_URL}/statistiche`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(statisticaData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante la creazione della statistica:", error.message);
    throw error;
  }
};

export const getStatisticaById = async (statisticaId) => {
  try {
    const response = await fetch(`${API_URL}/statistiche/${statisticaId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante il recupero della statistica:", error.message);
    throw error;
  }
};

export const updateStatisticaById = async (statisticaId, statisticaData) => {
  try {
    const response = await fetch(`${API_URL}/statistiche/${statisticaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(statisticaData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante l'aggiornamento della statistica:", error.message);
    throw error;
  }
};

export const deleteStatisticaById = async (statisticaId) => {
  try {
    const response = await fetch(`${API_URL}/statistiche/${statisticaId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.message || "Errore durante la cancellazione della statistica");
      error.status = response.status;
      throw error;
    }
  } catch (error) {
    console.error("Errore durante la cancellazione della statistica:", error.message);
    throw error;
  }
};

export const getAllStatistiche = async (page = 0, size = 10, sortBy = "id") => {
  try {
    const response = await fetch(`${API_URL}/statistiche?page=${page}&size=${size}&sortBy=${sortBy}`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante il recupero delle statistiche:", error.message);
    throw error;
  }
};

export const getStatisticaByUtenteId = async (utenteId) => {
  try {
    const response = await fetch(`${API_URL}/statistiche/utente/${utenteId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Errore durante il recupero della statistica per utente ID:", error.message);
    throw error;
  }
};
