import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { BACKEND_URL } from "../../utils/config";
import Logo from "../../assets/logo.svg";
import NoticeIcon from "../../assets/Notice-icon.svg";
import ProfileIcon from "../../assets/Profile-icon.svg";

export default function ProjectDetailScreen() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const { projectId } = params;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/project/${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки проекта:", err);
        setLoading(false);
      });
  }, [projectId]);

  if (loading || !project) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Хедер */}
      <View className="bg-yellow-300 px-4 pt-20 pb-4 rounded-b-3xl">
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity className="p-1" onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>
          <View className="absolute left-0 right-0 items-center z-0">
            <Logo width={130} height={20} />
          </View>
          <View className="flex-row space-x-2">
            <TouchableOpacity className="p-1">
              <NoticeIcon width={28} height={28} />
            </TouchableOpacity>
            <TouchableOpacity className="p-1">
              <ProfileIcon width={28} height={28} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Контент */}
      <View className="px-4 pt-6 pb-24">
        <Text className="text-sm text-gray-500 mb-1">Название работы</Text>
        <Text className="text-lg font-semibold mb-4">{project.title}</Text>

        <Text className="text-sm text-gray-500 mb-1">Описание работы</Text>
        <Text className="text-base text-gray-700 mb-4">{project.description}</Text>

        <Text className="text-sm text-gray-500 mb-2">Объект ремонта сейчас</Text>
        <ScrollView horizontal className="mb-4">
          {project.sourceImg.map((img, i) => (
            <Image
              key={i}
              source={{ uri: `${BACKEND_URL}${img}` }}
              className="w-24 h-24 mr-2 rounded-md"
            />
          ))}
        </ScrollView>

        <Text className="text-sm text-gray-500 mb-2">Примеры желаемого объекта</Text>
        <ScrollView horizontal className="mb-4">
          {project.refImg.map((img, i) => (
            <Image
              key={i}
              source={{ uri: `${BACKEND_URL}${img}` }}
              className="w-24 h-24 mr-2 rounded-md"
            />
          ))}
        </ScrollView>

        <Text className="text-sm text-gray-500 mb-2">Категории работ</Text>
        <View className="border border-gray-200 rounded-lg overflow-hidden">
          {project.tags.map((tag, index) => (
            <View key={index} className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100 bg-yellow-100">
              <Text className="text-base text-black">{tag.category}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}