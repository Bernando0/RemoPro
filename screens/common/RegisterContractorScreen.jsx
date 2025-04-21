// screens/auth/RegisterScreen.jsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Logo from "../../assets/logo.svg";

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View className="flex-1 bg-white justify-center items-center px-6">
      <Logo width={130} height={20} className="mb-8" />
      <Text className="text-2xl font-bold mb-6">Регистрация</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="border border-gray-300 w-full p-3 rounded-lg mb-4"
      />

      <TextInput
        placeholder="Имя пользователя"
        value={username}
        onChangeText={setUsername}
        className="border border-gray-300 w-full p-3 rounded-lg mb-4"
      />

      <TextInput
        placeholder="Пароль"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="border border-gray-300 w-full p-3 rounded-lg mb-6"
      />

      <TouchableOpacity className="bg-black py-3 px-6 rounded-xl w-full">
        <Text className="text-white text-center text-base font-semibold">Зарегистрироваться</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} className="mt-4">
        <Text className="text-sm text-gray-500">Уже есть аккаунт? Войти</Text>
      </TouchableOpacity>
    </View>
  );
}
