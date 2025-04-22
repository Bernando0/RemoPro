import React from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { teams } from "../../mock/mockData";
import { useState } from "react";
import FilterHeader from "../../components/TeamsFilter";
import NoticeIcon from "../../assets/Notice-icon.svg";
import ProfileIcon from "../../assets/Profile-icon.svg";
import ArrowIcon from "../../assets/Arrow-icon.svg";

export default function TeamsScreen() {
  const [city, setCity] = useState("Алматы");
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const cities = ["Алматы", "Астана", "Шымкент"];
  const allFilters = ["Отделка", "Электрика", "Дизайн", "Плитка", "Мебель"];

  // Компонент для отображения количества скрытых тегов
  const HiddenTagsCount = ({ count }) => {
    if (count <= 0) return null;

    return (
      <View className="bg-transparent px-2 py-0.5 rounded-full mr-2 mt-2">
        <Text className="text-xs text-gray-800">+{count}</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Хедер */}
      <View className="bg-yellow-300 px-4 pt-20 pb-4 rounded-b-3xl">
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity className="p-1">
            <ArrowIcon name="arrow-back" size={36} />
          </TouchableOpacity>

          <View className="w-[60%] border border-black h-[36px] rounded-[12px] px-3 py-1 flex-row items-center">
            <TextInput
              className="flex-1 ml-2 text-base"
              placeholder="Поиск..."
              placeholderTextColor="#000000"
            />
          </View>

          <View className="flex-row space-x-2">
            <TouchableOpacity className="p-1">
              <NoticeIcon size={36} />
            </TouchableOpacity>
            <TouchableOpacity className="p-1">
              <ProfileIcon size={36} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View className="mb-4 mt-2">
        <FilterHeader />
      </View>

      {/* Список исполнителей */}
      <ScrollView
        className="flex-1 px-4 pt-2"
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <View className="flex-row flex-wrap justify-between">
          {teams.map((team) => {
            const visibleTags = team.tags.slice(0, 2);
            const hiddenTagsCount = team.tags.length - 2;

            return (
              <View
                key={team.id}
                className="w-[48%] bg-yellow-50 rounded-xl mb-4 overflow-hidden"
              >
                <View className="relative w-full h-28">
                  <Image source={team.image} className="w-full h-28" />
                  <TouchableOpacity
                    onPress={() => {
                      team.liked = !team.liked; // временно
                    }}
                    className="absolute top-1 right-1 p-1.5 rounded-full"
                  >
                    <Ionicons
                      name={team.liked ? "heart" : "heart-outline"}
                      size={24}
                      color={team.liked ? "#facc15" : "white"}
                    />
                  </TouchableOpacity>
                </View>

                <View className="p-3 space-y-1">
                  <View className="flex-row items-center space-x-1">
                    <Ionicons name="star" size={12} color="black" />
                    <Text className="text-xs text-gray-600">
                      {team.rating} ({team.reviews} отзывов)
                    </Text>
                  </View>

                  <Text className="font-regular text-sm" numberOfLines={2}>
                    {team.title}
                  </Text>

                  <View className="flex-row flex-wrap items-center">
                    {visibleTags.map((tag, i) => (
                      <View
                        key={i}
                        className="bg-yellow-200 px-2 py-0.5 rounded-full mr-2 mt-2"
                      >
                        <Text className="text-xs text-gray-800">{tag}</Text>
                      </View>
                    ))}
                    <HiddenTagsCount count={hiddenTagsCount} />
                  </View>

                  <View className="flex-row items-center mt-1">
                    <Ionicons name="location-outline" size={14} color="#999" />
                    <Text className="text-xs text-gray-600 ml-1">
                      {team.location}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
