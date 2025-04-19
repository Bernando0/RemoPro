import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { userProfile, userProjects } from "../../mock/userProfileMock";
import Logo from "../../assets/logo.svg";
import NoticeIcon from "../../assets/Notice-icon.svg";
import ArrowIcon from "../../assets/Arrow-icon.svg";

export default function UserProfileScreen() {
  const user = userProfile;

  const renderProjectCard = (proj) => (
    <View key={proj.id} className="bg-yellow-50 rounded-xl mb-4 p-3">
      <View className="flex-row mb-2">
        <Image source={proj.image} className="w-20 h-20 rounded-md mr-3" />
        <View className="flex-1">
          <Text numberOfLines={3} className="text-s text-black mb-1">
            {proj.description || "Описание проекта отсутствует"}
          </Text>
          {proj.date && (
            <Text className="text-[10px] text-gray-500">{proj.date}</Text>
          )}
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={18} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Теги */}
      {proj.tags && (
        <View className="flex-row flex-wrap">
          {proj.tags.map((tag, i) => (
            <View
              key={i}
              className="bg-yellow-200 px-2 py-1 rounded-full mr-2 mb-2"
            >
              <Text className="text-xs text-black">{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Статистика */}
      <View className="flex-row items-center space-x-4 mt-1">
        <View className="flex-row items-center space-x-1">
          <Ionicons name="chatbubble-outline" size={12} color="#999" />
          <Text className="text-xs text-gray-500">{proj.comments || 0}</Text>
        </View>
        <View className="flex-row items-center ml-2 space-x-1">
          <Ionicons name="eye-outline" size={12} color="#999" />
          <Text className="text-xs text-gray-500">{proj.views || 0}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
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
                <NoticeIcon name="notifications-outline" size={36} />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row  px-4 justify-between mt-2">
  <View className="flex-row ">
    <Image source={user.avatar} className="w-24 h-24 rounded-[8px] mr-3" />
    <View>
      <Text className="font-bold text-base">
        {user.name} ★ {user.rating}
      </Text>
      <Text className="text-sm text-yellow-800">{user.role}</Text>
      <Text className="text-xs text-gray-800 mt-1">{user.phone}</Text>
    </View>
    <TouchableOpacity className="pl-4">
    <Ionicons name="create-outline" size={24} color="black" />
  </TouchableOpacity>
  </View>

  
</View>
        </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Header */}
       

        {/* Active Projects */}
        <View className="px-4 mt-4">
          <Text className="text-base font-semibold mb-3">Текущие проекты</Text>
          {userProjects.current.map((proj) => renderProjectCard(proj))}
        </View>

        {/* Completed Projects */}
        <View className="px-4 mt-2">
          <Text className="text-base font-semibold mb-3">Завершённые проекты</Text>
          {userProjects.completed.map((proj) => renderProjectCard(proj))}
        </View>
      </ScrollView>
    </View>
  );
}