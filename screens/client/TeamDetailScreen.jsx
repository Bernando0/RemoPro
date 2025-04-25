import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import { useRoute, useNavigation } from "@react-navigation/native";
import ImageView from "react-native-image-viewing";
import ArrowIcon from "../../assets/Arrow-icon.svg";
import { BACKEND_URL } from "../../utils/config";
import { useAuthStore } from "../../store/authStore";

const { width } = Dimensions.get("window");

export default function TeamDetailScreen() {
  const { teamId } = useRoute().params;
  const navigation = useNavigation();
  const token = useAuthStore((state) => state.token);

  const [team, setTeam] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [modalImages, setModalImages] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/contractor/${teamId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setTeam)
      .catch((err) => {
        console.error("Ошибка загрузки данных команды:", err);
      });
  }, [teamId]);

  const openModal = (images, index) => {
    const formatted = images.map((img) => ({
      uri: `${BACKEND_URL}${img.img}`,
    }));
    setModalImages(formatted);
    setModalIndex(index);
    setModalVisible(true);
  };

  if (!team) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500">Команда не найдена</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Карусель изображений */}
        <View className="relative">
          <Swiper
            height={220}
            loop={false}
            showsPagination={true}
            paginationStyle={{ bottom: 6 }}
            dot={
              <View className="w-[6px] h-[6px] rounded-full mx-1 bg-white/40" />
            }
            activeDot={
              <View className="w-[10px] h-[10px] rounded-full mx-1 bg-white" />
            }
          >
            {(team.gallery || []).map((img, i) => (
              <TouchableOpacity
                key={`carousel-${i}`}
                onPress={() => openModal(team.gallery, i)}
              >
                <Image
                  source={{ uri: `${BACKEND_URL}${img.img}` }}
                  className="w-full h-64"
                />
              </TouchableOpacity>
            ))}
          </Swiper>

          {/* Назад и лайк */}
          <View className="absolute top-20 left-4 right-4 flex-row justify-between items-center">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowIcon />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="heart-outline" size={36} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Контент */}
        <View className="px-4 pt-4">
          <View className="flex-row items-center mb-4 space-x-3">
            <Image
              source={
                team.profileImg
                  ? { uri: `${BACKEND_URL}${team.profileImg}` }
                  : require("../../assets/Inbox.png")
              }
              className="w-16 h-16 rounded-md"
            />
            <View>
              <Text className="text-lg font-semibold">{team.fullName}</Text>
              <Text className="text-gray-500 text-sm">{team.account_name}</Text>
            </View>
          </View>

          {/* О команде */}
          
          <Text className="text-base text-black mb-2">
            {team.shortDescription}
          </Text>
          <Text className="text-lg font-semibold mb-2">О команде</Text>
          <Text className="text-sm text-gray-700 mb-4 leading-5">
            {team.fullDescription}
          </Text>

          <View className="h-[1px] bg-gray-200 my-6" />

          {/* Категории */}
          {team.categories?.length > 0 && (
            <>
              <Text className="text-lg font-semibold mb-2">Категории</Text>
              <View className="flex-row flex-wrap gap-2 mb-4">
                {team.categories.map((tag, index) => (
                  <View key={index} className="bg-yellow-200 px-3 py-1 rounded-full">
                    <Text className="text-sm text-gray-800">{tag}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <View className="h-[1px] bg-gray-200 my-6" />

          {/* Контактная информация */}
          <Text className="text-lg font-semibold mb-2">Контактная информация</Text>
          <View className="space-y-2 mb-6">
            <View className="flex-row items-center">
              <Ionicons name="mail-outline" size={18} color="#555" />
              <Text className="ml-2 text-gray-700">{team.email}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="call-outline" size={18} color="#555" />
              <Text className="ml-2 text-gray-700">{team.phone}</Text>
            </View>
          </View>

          {/* Кнопка */}
          <TouchableOpacity className="bg-white border border-black b py-3 rounded-xl mb-6">
            <Text className="text-black text-center font-semibold text-base">
              Отправить сообщение
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Просмотр фото в полноэкранном режиме */}
      <ImageView
        images={modalImages}
        imageIndex={modalIndex}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      />
    </View>
  );
}
