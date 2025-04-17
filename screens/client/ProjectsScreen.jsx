import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { projects } from "../../mock/projectsData";

import Logo from "../../assets/logo.svg";
import NoticeIcon from "../../assets/Notice-icon.svg";
import ProfileIcon from "../../assets/Profile-icon.svg";
import ArrowIcon from "../../assets/Arrow-icon.svg";


export default function ProjectsScreen() {
  return (
    <View className="flex-1 bg-white">
      {/* Хедер */}
      <View className="bg-yellow-300 px-4 pt-20 pb-4 rounded-b-3xl">
        <View className="flex-row items-center justify-between mb-2">
            <TouchableOpacity className="p-1">
                        <ArrowIcon name="arrow-back" size={36} />
                      </TouchableOpacity>
          {/* Логотип по центру */}
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

        {/* Кнопка */}
        <TouchableOpacity className="bg-yellow-300 border border-black py-3 px-5 rounded-xl mt-2 items-center">
  <Text className="text-black font-semibold text-sm">
    Создать проект с <Text className="font-bold">RemoAI</Text>
  </Text>
</TouchableOpacity>

      </View>

      {/* Список проектов */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {projects.map((project) => (
          <View
            key={project.id}
            className="bg-yellow-50 rounded-xl mb-4 p-3 "
          >
            <View className="flex-row mb-2">
              <Image
                source={project.image}
                className="w-20 h-20 rounded-md mr-3"
              />
              <View className="flex-1">
                <Text numberOfLines={3} className="text-s text-black mb-1">
                  {project.description}
                </Text>
                <Text className="text-[10px] text-gray-500">
                  {project.date}
                </Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="ellipsis-horizontal" size={18} color="#999" />
              </TouchableOpacity>
            </View>

            {/* Теги */}
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

            {/* Статистика */}
            <View className="flex-row items-center space-x-4 mt-1">
              <View className="flex-row items-center space-x-1">
                <Ionicons name="chatbubble-outline" size={12} color="#999" />
                <Text className="text-xs text-gray-500">
                  {project.comments || 0}
                </Text>
              </View>
              <View className="flex-row items-center ml-2 space-x-1">
                <Ionicons name="eye-outline" size={12} color="#999" />
                <Text className="text-xs text-gray-500">
                  {project.views || 0}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
