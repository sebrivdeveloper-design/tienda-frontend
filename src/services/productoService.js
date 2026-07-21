import axios from "axios";

const API_URL = "https://tienda-backend-ud29.onrender.com/productos";

export const listarProductos = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const crearProducto = async (producto) => {
    const response = await axios.post(API_URL, producto);
    return response.data;
};