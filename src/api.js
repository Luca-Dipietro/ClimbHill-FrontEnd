const API_URL = import.meta.env.VITE_API_URL;

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = new Error("Credenziali non valide");
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    localStorage.setItem("token", data.accessToken);
    return data;
  } catch (error) {
    console.error("Errore durante il login");
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

    if (!response.ok) {
      const error = new Error("Registrazione fallita");
      error.status = response.status;
      throw error;
    }

    return response.json();
  } catch (error) {
    console.error("Errore durante la registrazione");
    throw error;
  }
};

// export const fetchWithToken = async (endpoint, options = {}) => {
//   const token = localStorage.getItem("token");
//   // eslint-disable-next-line no-useless-catch
//   try {
//     const response = await fetch(`${API_URL}${endpoint}`, {
//       ...options,
//       headers: {
//         ...options.headers,
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     if (!response.ok) {
//       const error = new Error("Richiesta Fallita");
//       error.status = response.status;
//       throw error;
//     }
//     return response.json();
//   } catch (error) {
//     throw error;
//   }
// };
