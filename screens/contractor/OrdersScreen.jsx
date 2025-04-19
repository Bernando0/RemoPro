import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NoticeIcon from "../../assets/Notice-icon.svg";
import ProfileIcon from "../../assets/Profile-icon.svg";
import ArrowIcon from "../../assets/Arrow-icon.svg";
import FilterHeader from "../../components/TeamsFilter";
import { projects } from "../../mock/projectsData";

export default function OrdersScreen() {
  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-yellow-300 px-4 pt-20 pb-4 rounded-b-3xl">
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity className="p-1">
            <ArrowIcon name="arrow-back" size={36} />
          </TouchableOpacity>

          <View className="flex-1 mx-2 border border-black h-[36px] rounded-[12px] px-3 py-1 flex-row items-center">
            <TextInput
              className="flex-1 ml-2 text-l"
              placeholder="Поиск..."
              placeholderTextColor="#000000"
            />
          </View>

          <View className="flex-row space-x-3">
            <TouchableOpacity>
              <NoticeIcon width={36} height={36} />
            </TouchableOpacity>
            <TouchableOpacity>
              <ProfileIcon width={36} height={36} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Фильтры */}
      <View className="mb-4 mt-2">
        <FilterHeader />
      </View>

      {/* Список проектов */}
      <ScrollView className="flex-1 px-4 pt-2" contentContainerStyle={{ paddingBottom: 60 }}>
        <Text className="text-base font-semibold mb-3">Проекты</Text>
        {projects.map((project) => (
          <View key={project.id} className="bg-yellow-50 rounded-xl mb-4 p-3">
            <View className="flex-row mb-2">
              <Image source={project.image} className="w-20 h-20 rounded-md mr-3" />
              <View className="flex-1">
                <Text numberOfLines={3} className="text-xs text-black mb-1">
                  {project.description}
                </Text>
                <Text className="text-[10px] text-gray-500">{project.date}</Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="ellipsis-horizontal" size={18} color="#999" />
              </TouchableOpacity>
            </View>

            <View className="flex-row flex-wrap">
              {project.tags.map((tag, i) => (
                <View
                  key={i}
                  className="bg-yellow-200 px-2 py-1 rounded-full mr-2 mb-2"
                >
                  <Text className="text-xs text-black">{tag}</Text>
                </View>
              ))}
            </View>

            <View className="flex-row items-center space-x-4 mt-1">
              <View className="flex-row items-center space-x-1">
                <Ionicons name="chatbubble-outline" size={12} color="#999" />
                <Text className="text-xs text-gray-500">{project.comments || 0}</Text>
              </View>
              <View className="flex-row items-center ml-2 space-x-1">
                <Ionicons name="eye-outline" size={12} color="#999" />
                <Text className="text-xs text-gray-500">{project.views || 0}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
