import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Cria a instância do axios apontando para o backend
const api = axios.create({
  baseURL: "http://SEU_IP:3000", // IP da sua máquina
});

// Antes de toda requisição
api.interceptors.request.use(async (config) => {
  // Busca o token salvo
  const token = await AsyncStorage.getItem("@token");

  // Se existir token, envia no header Authorization
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
