import axios from "axios";

const API_URL = "http://localhost:8080/compras";

export const listarCompras = async () => {

    const response = await axios.get(API_URL);

    return response.data;
};

export const crearCompra = async (compra) => {

    const response = await axios.post(API_URL, compra);

    return response.data;
};