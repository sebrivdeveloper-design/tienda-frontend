import axios from "axios";

const API_URL =
  "https://tienda-backend-production-f8dc.up.railway.app/balance";

export const obtenerBalance = async (fecha) => {
  const response = await axios.get(
    `${API_URL}?fecha=${fecha}`
  );

  return response.data;
};