import axios from "axios";

const API_URL =
  "https://tienda-backend-production-f8dc.up.railway.app/gastos";

export const listarGastos = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const crearGasto = async (gasto) => {
  const response = await axios.post(API_URL, gasto);
  return response.data;
};