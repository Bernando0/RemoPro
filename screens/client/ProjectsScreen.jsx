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
import { useNavigation } from "@react-navigation/native";

import Logo from "../../assets/logo.svg";
import NoticeIcon from "../../assets/Notice-icon.svg";
import ProfileIcon from "../../assets/Profile-icon.svg";
import ArrowIcon from "../../assets/Arrow-icon.svg";
import { BACKEND_URL } from "../../utils/config";
import { useAuthStore } from "../../store/authStore";

export default function ProjectsScreen() {
  const token = useAuthStore((state) => state.token);
  const navigation = useNavigation();

  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProjects = useCallback(() => {
    setRefreshing(true);
    fetch(`${BACKEND_URL}/api/project/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setProjects)
      .catch((err) => console.error("Ошибка загрузки проектов", err))
      .finally(() => setRefreshing(false));
  }, [token]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const toggleOptions = (id) => {
    setActiveProjectId((prev) => (prev === id ? null : id));
  };

  const handleEdit = (id) => {
    Alert.alert("Редактирование", `Редактировать проект с ID ${id}`);
  };

  const handleDelete = (id) => {
    Alert.alert("Удаление", `Удалить проект с ID ${id}`);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Хедер */}
      <View className="bg-yellow-300 px-4 pt-20 pb-4 rounded-b-3xl">
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity className="p-1">
            <ArrowIcon size={36} />
          </TouchableOpacity>
          <View className="absolute left-0 right-0 items-center z-0">
            <Logo width={130} height={20} />
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

        <TouchableOpacity
          className="bg-yellow-300 border border-black py-3 px-5 rounded-xl mt-2 items-center"
          onPress={() => navigation.navigate("CreateProjectStep1")}
        >
          <Text className="text-black font-regular text-sm">
            Создать проект с <Text className="font-bold">RemoAI</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Список проектов */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 60 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchProjects} />
        }
      >
        {projects.map((project) => (
          <TouchableOpacity
            key={project.id}
            onPress={() => navigation.navigate("ProjectDetail", { projectId: project.id })}
            className="bg-yellow-50 rounded-xl mb-4 p-3 relative"
          >
            <View className="flex-row mb-2">
              <Image
                source={{ uri: `${BACKEND_URL}${project.sourceImg}` }}
                className="w-20 h-20 rounded-md mr-3"
              />
              <View className="flex-1">
                <Text numberOfLines={2} className="text-base font-medium text-black mb-1">
                  {project.title}
                </Text>
                <Text numberOfLines={3} className="text-xs text-gray-500">
                  {project.description}
                </Text>
              </View>

              <TouchableOpacity onPress={() => toggleOptions(project.id)}>
                <Ionicons name="ellipsis-horizontal" size={25} color="#000" />
              </TouchableOpacity>

              {activeProjectId === project.id && (
                <View className="absolute top-6 right-4 bg-white border border-gray-300 rounded-xl shadow-lg px-5 py-4 z-20 w-44">
                  <TouchableOpacity onPress={() => handleEdit(project.id)}>
                    <Text className="text-sm mb-2">Редактировать</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(project.id)}>
                    <Text className="text-sm text-red-500">Удалить</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View className="flex-row flex-wrap">
  {project.tags.map((tag, i) => (
    <View
      key={i}
      className="bg-yellow-200 px-2 py-1 rounded-full mr-2 mb-2"
    >
      <Text className="text-xs text-black">{tag.category?.action}</Text>
    </View>
  ))}
</View>

          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
