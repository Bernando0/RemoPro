import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../../store/authStore";
import { BACKEND_URL } from "../../utils/config";


export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("Неверный логин или пароль");

      const data = await response.json();
      setAuth({ role: data.role, username: data.username, token: data.token });

      if (data.role === "ROLE_CLIENT") {
        navigation.replace("Client");
      } else if (data.role === "ROLE_CONTRACTOR") {
        navigation.replace("Contractor");
      } else {
        Alert.alert("Ошибка", "Неизвестная роль пользователя");
      }
    } catch (err) {
      Alert.alert("Ошибка входа", err.message);
    }
  };

  return (
    <View className="flex-1 bg-white justify-center items-center px-6">
      <Image source={require("../../assets/logo.png")} className="w-32 h-8 mb-8" resizeMode="contain" />
      <Text className="text-xl font-semibold mb-6">Войти в RemoPro</Text>

      <TextInput
        placeholder="Имя пользователя или Email"
        value={username}
        onChangeText={setUsername}
        className="border border-gray-300 w-full p-3 rounded-lg mb-3"
        placeholderTextColor="#999"
      />

      <TextInput
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="border border-gray-300 w-full p-3 rounded-lg mb-3"
        placeholderTextColor="#999"
      />

      <TouchableOpacity
        onPress={handleLogin}
        className="bg-black py-3 rounded-xl w-full mb-6"
      >
        <Text className="text-white text-center font-semibold">Войти</Text>
      </TouchableOpacity>

      <Text className="text-gray-400 mb-3">Или</Text>

      <TouchableOpacity className="bg-blue-500 py-3 rounded-xl w-full mb-2 items-center">
        <Text className="text-white font-semibold">Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity className="border border-black py-3 rounded-xl w-full items-center">
        <Text className="text-black font-semibold">Continue with Apple</Text>
      </TouchableOpacity>

      <Text className="text-gray-300 mt-6">Нет аккаунта RemoPro?</Text>
      <TouchableOpacity className="mt-2 border border-black py-2 px-6 rounded-xl">
        <Text className="text-black font-semibold">Зарегистрироваться</Text>
      </TouchableOpacity>
    </View>
  );
}