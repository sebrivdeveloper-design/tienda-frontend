import axios from "axios";

const API_URL = "http://localhost:8080/balance";

export const obtenerBalance = async (fecha) => {

    const response = await axios.get(
        `${API_URL}?fecha=${fecha}`
    );

    return response.data;
};