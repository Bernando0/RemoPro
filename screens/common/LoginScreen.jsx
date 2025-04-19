import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../../store/authStore";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const navigation = useNavigation();
  const setRole = useAuthStore((state) => state.setRole);

  const handleLogin = () => {
    const trimmed = username.trim().toLowerCase();

    if (trimmed === "test_client") {
      setRole("client");
      navigation.replace("Client");
    } else if (trimmed === "test_contractor") {
      setRole("contractor");
      navigation.replace("Contractor");
    } else {
      alert("Неверный логин. Используйте test_client или test_contractor");
    }
  };

  return (
    <View className="flex-1 bg-white justify-center items-center px-6">
      <Text className="text-2xl font-bold mb-6">Вход</Text>
      <TextInput
        placeholder="Введите логин"
        value={username}
        onChangeText={setUsername}
        className="border border-gray-300 w-full p-3 rounded-lg mb-4"
      />
      <TouchableOpacity
        onPress={handleLogin}
        className="bg-black py-3 px-6 rounded-xl"
      >
        <Text className="text-white text-base font-semibold">Войти</Text>
      </TouchableOpacity>
    </View>
  );
}
