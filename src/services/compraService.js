import axios from "axios";

const API_URL =
  " https://tienda-backend-ud29.onrender.com/compras";

export const listarCompras = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const crearCompra = async (compra) => {
  const response = await axios.post(API_URL, compra);
  return response.data;
};