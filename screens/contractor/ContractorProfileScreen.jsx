// screens/contractor/ContractorProfileScreen.jsx
import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Logo from "../../assets/logo.svg";
import NoticeIcon from "../../assets/Notice-icon.svg";
import ProfileIcon from "../../assets/Profile-icon.svg";
import ArrowIcon from "../../assets/Arrow-icon.svg";
import { teamDetails } from "../../mock/teamDetailMockData";

const team = teamDetails[1]; // Берем первую команду

export default function ContractorProfileScreen() {
  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Header */}
        <View className="bg-yellow-300 px-4 pt-20 pb-4 rounded-b-3xl">
          <View className="flex-row items-center justify-between mb-2">
            <TouchableOpacity className="p-1">
              <ArrowIcon name="arrow-back" size={36} />
            </TouchableOpacity>
            <View className="absolute left-0 right-0 items-center z-0">
              <Logo width={130} height={20} />
            </View>
            <View className="flex-row space-x-2">
              <TouchableOpacity className="p-1">
                <NoticeIcon width={36} height={36} />
              </TouchableOpacity>
              <TouchableOpacity className="p-1">
                <ProfileIcon width={36} height={36} />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row items-center mt-2">
            <Image
              source={team.logo}
              className="w-20 h-20 rounded-lg mr-4"
            />
            <View className="flex-1">
              <Text className="font-bold text-lg text-black">
                {team.name} ★ {team.rating}
              </Text>
              <Text className="text-sm text-yellow-800">Строительная команда</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View className="px-4 pt-4">
          <Text className="text-base text-gray-700 leading-5 mb-3">{team.description}</Text>

          <Text className="font-semibold text-base mb-2">Теги</Text>
          <View className="flex-row flex-wrap mb-4">
            {team.tags.map((tag, i) => (
              <View
                key={i}
                className="bg-yellow-200 px-2 py-1 rounded-full mr-2 mb-2"
              >
                <Text className="text-xs text-black">{tag}</Text>
              </View>
            ))}
          </View>

          <Text className="font-semibold text-base mb-2">Фотографии</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
            {team.images.map((img, i) => (
              <Image
                key={i}
                source={img}
                className="w-32 h-32 rounded-lg mr-3"
              />
            ))}
          </ScrollView>

          <TouchableOpacity className="bg-black py-3 rounded-xl">
            <Text className="text-white text-center font-semibold text-base">
              Редактировать профиль
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
