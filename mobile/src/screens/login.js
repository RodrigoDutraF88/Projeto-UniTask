import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";

export default function Login() {
  // Estados dos campos
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Função de login
  async function handleLogin() {
    try {
      // Envia email e senha para o backend
      const response = await api.post("/login", {
        email,
        password,
      });

      // Pega o token retornado
      const { token } = response.data;

      // Salva o token no celular
      await AsyncStorage.setItem("@token", token);

      Alert.alert("Sucesso", "Login realizado com sucesso!");

    } catch (error) {
      Alert.alert("Erro", "Email ou senha inválidos");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>UniTask</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Senha"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#383737",
  },
  title: {
    fontSize: 28,
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});
