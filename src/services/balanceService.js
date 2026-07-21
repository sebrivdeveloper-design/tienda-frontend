import axios from "axios";

const API_URL =
  "https://tienda-backend-ud29.onrender.com";

export const obtenerBalance = async (fecha) => {
  const response = await axios.get(
    `${API_URL}?fecha=${fecha}`
  );

  return response.data;
};