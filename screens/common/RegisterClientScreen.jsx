import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import Logo from "../../assets/logo.svg";
import { useNavigation } from "@react-navigation/native";
import { BACKEND_URL } from "../../utils/config";

export default function RegisterClientScreen() {
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

    const payload = {
      account_name: accountName,
      password,
      email,
      phone,
    };

    try {
      const response = await fetch(`${BACKEND_URL}/api/register/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Ошибка регистрации");

      Alert.alert("Успех", "Аккаунт успешно создан");
      navigation.navigate("Login");
    } catch (err) {
      Alert.alert("Ошибка", err.message);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-20" contentContainerStyle={{ paddingBottom: 60 }}>
      <View className="items-center mb-8">
        <Logo width={150} height={30} />
        <Text className="text-2xl font-bold mt-6">Регистрация клиента</Text>
      </View>

      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
        placeholder="Имя пользователя"
        placeholderTextColor="#999"
        value={accountName}
        onChangeText={setAccountName}
      />

      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
        placeholder="Email"
        keyboardType="email-address"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
        placeholder="Телефон"
        keyboardType="phone-pad"
        placeholderTextColor="#999"
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-6"
        placeholder="Пароль"
        secureTextEntry
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        onPress={handleRegister}
        className="bg-black py-4 rounded-xl items-center"
      >
        <Text className="text-white font-semibold text-base">Зарегистрироваться</Text>
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
    </ScrollView>
  );
}
