import axios from "axios";

const API_URL =
  "https://tienda-backend-production-f8dc.up.railway.app/ingresos";

export const registrarIngreso = async (valor) => {
  const response = await axios.post(
    `${API_URL}?totalIngresos=${valor}`
  );
  return response.data;
};

export const listarIngresos = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};