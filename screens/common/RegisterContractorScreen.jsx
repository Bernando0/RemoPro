// screens/common/ContractorRegisterScreen.jsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BACKEND_URL } from "../../utils/config";

export default function ContractorRegisterScreen() {
  const navigation = useNavigation();
  const [accountName, setAccountName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleRegister = async () => {
    if (!accountName || !password || !email || !phone) {
      Alert.alert("Ошибка", "Пожалуйста, заполните все поля");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/register/contractor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account_name: accountName,
          password,
          email,
          phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        throw new Error(errorData.message || "Ошибка регистрации");
      }

      Alert.alert("Успех", "Вы успешно зарегистрированы");
      navigation.replace("Login");
    } catch (err) {
      Alert.alert("Ошибка", err.message);
    }
  };

  return (
    <View className="flex-1 bg-white justify-center px-6">
      <Text className="text-2xl font-bold mb-6 text-center">Регистрация подрядчика</Text>

      <TextInput
        placeholder="Логин"
        value={accountName}
        onChangeText={setAccountName}
        className="border border-gray-300 w-full p-3 rounded-lg mb-4"
      />

      <TextInput
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="border border-gray-300 w-full p-3 rounded-lg mb-4"
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="border border-gray-300 w-full p-3 rounded-lg mb-4"
      />

      <TextInput
        placeholder="Телефон"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        className="border border-gray-300 w-full p-3 rounded-lg mb-6"
      />

      <TouchableOpacity
        className="bg-black py-4 rounded-xl items-center"
        onPress={handleRegister}
      >
        <Text className="text-white text-base font-semibold">Зарегистрироваться</Text>
      </TouchableOpacity>

      <View className="mt-6 items-center">
        <Text className="text-gray-400 text-sm">
          Уже есть аккаунт?{" "}
          <Text
            className="text-black font-semibold"
            onPress={() => navigation.navigate("Login")}
          >
            Войти
          </Text>
        </Text>
      </View>
    </View>
  );
}
