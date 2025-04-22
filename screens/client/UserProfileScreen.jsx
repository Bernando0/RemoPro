import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  FlatList,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Logo from "../../assets/logo.svg";
import ArrowIcon from "../../assets/Arrow-icon.svg";
import NoticeIcon from "../../assets/Notice-icon.svg";
import { useAuthStore } from "../../store/authStore";
import { BACKEND_URL } from "../../utils/config";
import { useNavigation } from "@react-navigation/native";

const languages = [{ label: "Русский", value: "ru" }];

export default function UserProfileScreen() {
  const token = useAuthStore((state) => state.token);
  const [profile, setProfile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

    const navigation = useNavigation();
 
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
const [selectedLanguage, setSelectedLanguage] = useState("ru");

const logout = useAuthStore((state) => state.logout);


  useEffect(() => {
    fetch(`${BACKEND_URL}/api/user/get-info`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const profileData = data.profile;
        setProfile(profileData);
        setFullName(profileData.fullName || "");
        setEmail(profileData.userId.email || "");
        setPhone(profileData.userId.phone || "");
      })
      .catch((err) => {
        console.error("Ошибка при получении профиля:", err);
        Alert.alert("Ошибка", "Не удалось загрузить данные профиля");
      });
  }, []);

  const handleSave = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/user/update-info`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, email, phone }),
      });

      if (!response.ok) throw new Error("Ошибка обновления профиля");

      Alert.alert("Успешно", "Профиль обновлён");
      setProfile((prev) => ({
        ...prev,
        fullName,
        userId: { ...prev.userId, email, phone },
      }));
      setModalVisible(false);
    } catch (e) {
      Alert.alert("Ошибка", "Не удалось обновить данные");
    }
  };

  if (!profile) return null;

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-yellow-300 px-4 pt-20 pb-4 rounded-b-3xl">
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity className="p-1">
            <ArrowIcon />
          </TouchableOpacity>
          <View className="absolute left-0 right-0 items-center z-0">
            <Logo width={130} height={20} />
          </View>
          <View className="flex-row space-x-2">
            <TouchableOpacity className="p-1">
              <NoticeIcon />
            </TouchableOpacity>
          </View>
        </View>

<View className="flex-row items-center mt-4 space-x-4">
  {/* Лого */}
  <TouchableOpacity
    className="w-16 h-16 rounded-[8px] bg-gray-200 justify-center items-center relative overflow-hidden"
  >
    <Ionicons name="person-outline" size={32} color="#999" />
    {/* Кнопка на логотипе (пока без действия) */}
    <View className="absolute bottom-0 right-0 rounded-full p-1">
      <Ionicons name="create-outline" size={16} color="black" />
    </View>
  </TouchableOpacity>

  {/* Имя + кнопка редактирования */}
  <View className="flex-1 flex-row ml-3 justify-between items-center">
    <View>
      <Text className="text-lg font-bold text-black">{profile.fullName}</Text>
      <Text className="text-sm text-black">
        {profile.userId.role?.roleTag === "ROLE_CLIENT" ? "Клиент" : "Подрядчик"}
      </Text>
    </View>
    <TouchableOpacity
      onPress={() => setModalVisible(true)}
      className="p-2"
    >
      <Ionicons name="create-outline" size={24} color="black" />
    </TouchableOpacity>
  </View>
</View>

      </View>

      {/* Основные данные */}
      <ScrollView className="px-4 pt-4" contentContainerStyle={{ paddingBottom: 80 }}>
        <Text className="text-xs text-gray-400 mb-1">Имя аккаунта</Text>
        <Text className="text-base font-medium mb-3">{profile.userId.accountName}</Text>

        <Text className="text-xs text-gray-400 mb-1">Электронная почта</Text>
        <Text className="text-base font-medium mb-3">{profile.userId.email}</Text>

        <Text className="text-xs text-gray-400 mb-1">Телефон</Text>
        <Text className="text-base font-medium mb-3">{profile.userId.phone}</Text>

       <View className="mb-4">
  <Text className="text-xs text-gray-400 mb-1">Язык</Text>
  <TouchableOpacity
    className="border border-gray-300 rounded-xl px-3 py-3"
    onPress={() => setLanguageModalVisible(true)}
  >
    <Text className="text-base font-medium">
      {languages.find((l) => l.value === selectedLanguage)?.label}
    </Text>
  </TouchableOpacity>
</View>

<Modal visible={languageModalVisible} transparent animationType="fade">
  <TouchableOpacity
    className="flex-1 bg-black/50 justify-center items-center"
    activeOpacity={1}
    onPressOut={() => setLanguageModalVisible(false)}
  >
    <View className="bg-white w-[80%] rounded-xl p-4 space-y-2">
      <Text className="text-lg font-semibold mb-2 text-center">Выберите язык</Text>
      <FlatList
        data={languages}
        keyExtractor={(item) => item.value}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedLanguage(item.value);
              setLanguageModalVisible(false);
            }}
            className="py-3 px-4 rounded-lg bg-gray-100 mb-2"
          >
            <Text className="text-base text-black text-center">{item.label}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  </TouchableOpacity>
</Modal>
{/* Кнопка выхода */}
<View className=" pb-6">
  <TouchableOpacity
    className="w-full bg-red-500 py-3 rounded-xl items-center mt-4"
    onPress={() => {
      useAuthStore.getState().logout(); // вызываем logout из store // возвращаемся на экран входа
    }}
  >
    <Text className="text-white font-semibold text-base">Выйти из аккаунта</Text>
  </TouchableOpacity>
</View>


      </ScrollView>

      {/* Модалка редактирования */}
      <Modal visible={modalVisible} transparent={true}>
  <View className="flex-1 bg-black/50 justify-center items-center px-6">
    <View className="bg-white w-full rounded-2xl p-6 space-y-6">
      <Text className="text-xl font-bold text-center">Редактировать профиль</Text>

      <View className="space-y-2">
        <Text className="text-sm font-semibold text-gray-700">Полное имя</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="Введите имя"
          className="border border-gray-300 rounded-xl px-4 py-3 "
        />
      </View>

      <View className="space-y-2 my-3">
        <Text className="text-sm font-semibold text-gray-700">Телефон</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="+7..."
          keyboardType="phone-pad"
          className="border border-gray-300 rounded-xl px-4 py-3 "
        />
      </View>

      <View className="space-y-2">
        <Text className="text-sm font-semibold text-gray-700">Email</Text>
        <View className="border border-gray-300 rounded-xl px-4 py-2 bg-gray-100">
          <Text className="text-base text-gray-500">{email}</Text>
        </View>
      </View>

      <View className="flex-row space-x-4 pt-4">
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          className="flex-1 py-2 mr-1 rounded-xl border border-black items-center"
        >
          <Text className="text-black font-semibold text-base">Отмена</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSave}
          className="flex-1 py-2 ml-1 rounded-xl bg-black items-center"
        >
          <Text className="text-white font-semibold text-base">Сохранить</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

    </View>
  );
}
