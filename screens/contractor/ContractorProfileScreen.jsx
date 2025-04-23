import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Logo from "../../assets/logo.svg";
import ArrowIcon from "../../assets/Arrow-icon.svg";
import NoticeIcon from "../../assets/Notice-icon.svg";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useAuthStore } from "../../store/authStore";

export default function ContractorProfileScreen() {
  const navigation = useNavigation();
  const token = useAuthStore((state) => state.token);

  const [profile, setProfile] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://185.47.167.143:8000/api/contractor/get-info", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error("Ошибка при загрузке профиля:", err);
      Alert.alert("Ошибка", "Не удалось загрузить данные подрядчика");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  };

  if (!profile) return null;

  return (
    <View className="flex-1 bg-white">
      <View className="bg-yellow-300 px-4 pt-20 pb-4 rounded-b-3xl">
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-1">
            <ArrowIcon />
          </TouchableOpacity>
          <View className="absolute left-0 right-0 items-center z-0">
            <Logo width={130} height={20} />
          </View>
          <TouchableOpacity className="p-1">
            <NoticeIcon />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center mt-4 space-x-4">
          <View className="w-16 h-16 rounded-[8px] bg-gray-200 justify-center items-center relative overflow-hidden">
            {profile.profileImg ? (
              <Image
                source={{ uri: `http://185.47.167.143:8000${profile.profileImg}` }}
                className="w-16 h-16 rounded-[8px]"
              />
            ) : (
              <Ionicons name="person-outline" size={32} color="#999" />
            )}
          </View>

          <View className="flex-1 flex-row ml-3 justify-between items-center">
            <View>
              <Text className="text-lg font-bold text-black">{profile.user_data.accountName}</Text>
              <Text className="text-sm text-black">Подрядчик</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("EditContractorProfile")}
              className="p-2"
            >
              <Ionicons name="create-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        className="px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text className="text-xs text-gray-400 mb-1">Email</Text>
        <Text className="text-base font-medium mb-4">{profile.user_data.email}</Text>

        <Text className="text-xs text-gray-400 mb-1">Краткое описание</Text>
        <Text className="text-base font-medium mb-4">{profile.shortDescription}</Text>

        <Text className="text-xs text-gray-400 mb-1">Полное описание</Text>
        <Text className="text-base font-medium mb-4">{profile.fullDescription}</Text>

        <Text className="text-xs text-gray-400 mb-1">Категории работ</Text>
        <View className="flex-row flex-wrap mb-4">
          {profile.tags.length > 0 ? (
            profile.tags.map((cat, idx) => (
              <View
                key={idx}
                className="bg-black px-4 py-2 rounded-full mr-2 mb-2"
              >
                <Text className="text-white text-sm font-medium">{cat}</Text>
              </View>
            ))
          ) : (
            <Text className="text-gray-400 text-sm">Категории не указаны</Text>
          )}
        </View>

        <Text className="text-xs text-gray-400 mb-1">Галерея</Text>
        {profile.gallery.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            {profile.gallery.map((img, index) => (
              <Image
                key={index}
                source={{ uri: `http://185.47.167.143:8000${img.img}` }}
                className="w-32 h-32 rounded-xl mr-3"
              />
            ))}
          </ScrollView>
        ) : (
          <TouchableOpacity
            className="border border-black rounded-xl py-3 px-4 items-center"
            onPress={() => navigation.navigate("EditContractorProfile")}
          >
            <Text className="text-black font-medium">Перейти в редактирование профиля</Text>
          </TouchableOpacity>
        )}
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
      
    </View>
  );
}