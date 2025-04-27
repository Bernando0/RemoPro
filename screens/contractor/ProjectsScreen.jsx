import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { BACKEND_URL } from "../../utils/config";
import { useAuthStore } from "../../store/authStore";
import ArrowIcon from "../../assets/Arrow-icon.svg";
import Logo from "../../assets/logo.svg";
import NoticeIcon from "../../assets/Notice-icon.svg";
import ProfileIcon from "../../assets/Profile-icon.svg";

export default function OrdersScreen() {
  const token = useAuthStore((state) => state.token);
  const navigation = useNavigation();

  const [projects, setProjects] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("projects");

  const removeDuplicateProjects = (projectsArray) => {
    const unique = {};
    projectsArray.forEach((project) => {
      const id = project.projectId || project.id; // на всякий случай обрабатываем оба варианта
      if (!unique[id]) {
        unique[id] = project;
      }
    });
    return Object.values(unique);
  };
  

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/project-contractor/get/my/approved`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProjects(removeDuplicateProjects(data));
      } catch (err) {
        console.error("Ошибка загрузки проектов:", err);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchRequests = async () => {
      setRequestsLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/project-contractor/get/my/action`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRequests(removeDuplicateProjects(data)); // <-- тоже очищаем заявки от дублей
      } catch (err) {
        console.error("Ошибка загрузки заявок:", err);
      } finally {
        setRequestsLoading(false);
      }
    };
    

    fetchProjects();
    fetchRequests();
  }, [token]);

  const renderProjectCard = (project) => {
    const tags = project.projectTags || [];
    const imageUrl = project.projectFirstImg ? `${BACKEND_URL}${project.projectFirstImg}` : null;

    return (
      <TouchableOpacity
        key={project.projectId}
        onPress={() =>
          navigation.navigate("ContractorProjectDetail", { projectId: project.projectId })
        }
        className="bg-yellow-50 rounded-xl mb-4 p-3"
      >
        <View className="flex-row mb-2">
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              className="w-20 h-20 rounded-md mr-3"
            />
          ) : (
            <View className="w-20 h-20 rounded-md mr-3 bg-gray-300 justify-center items-center">
              <Ionicons name="image-outline" size={30} color="#aaa" />
            </View>
          )}
          <View className="flex-1">
            <Text numberOfLines={2} className="text-base font-medium text-black mb-1">
              {project.projectTitle}
            </Text>
            <Text numberOfLines={3} className="text-xs text-gray-500">
              {project.projectDescription || "Нет описания"}
            </Text>
          </View>
        </View>

        {/* Теги категорий */}
        <View className="flex-row flex-wrap">
        {tags.map((tag, idx) => {
  console.log(tags); // Лог здесь ок
  return (
    <View key={idx} className="bg-yellow-200 px-2 py-1 rounded-full mr-2 mb-2">
      <Text className="text-xs text-black">{tag.categoryName || "Категория"}</Text>
    </View>
  );
})}

        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Хедер */}
      <View className="bg-yellow-300 px-4 pt-20 pb-4 rounded-b-3xl">
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity className="p-1" onPress={() => navigation.goBack()}>
            <ArrowIcon width={36} height={36} />
          </TouchableOpacity>
          <View className="absolute left-0 right-0 items-center z-0">
            <Logo width={130} height={20} />
          </View>
          <View className="flex-row space-x-2">
            <TouchableOpacity className="p-1" onPress={() => navigation.navigate("ContractorNotification")}>
              <NoticeIcon width={36} height={36} />
            </TouchableOpacity>
            <TouchableOpacity className="p-1" onPress={() => navigation.navigate("ContractorProfile")}>
              <ProfileIcon width={36} height={36} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Табы */}
      <View className="flex-row px-4 pt-4 bg-white">
        <TouchableOpacity
          onPress={() => setActiveTab("projects")}
          className={`flex-1 pb-2 items-center ${
            activeTab === "projects" ? "border-b-2 border-black" : ""
          }`}
        >
          <Text
            className={`text-sm font-semibold ${
              activeTab === "projects" ? "text-black" : "text-gray-400"
            }`}
          >
            Проекты
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("requests")}
          className={`flex-1 pb-2 items-center ${
            activeTab === "requests" ? "border-b-2 border-black" : ""
          }`}
        >
          <Text
            className={`text-sm font-semibold ${
              activeTab === "requests" ? "text-black" : "text-gray-400"
            }`}
          >
            Заявки
          </Text>
        </TouchableOpacity>
      </View>

      {/* Список проектов/заявок */}
      <ScrollView className="px-4 pt-4" contentContainerStyle={{ paddingBottom: 60 }}>
        {activeTab === "projects" ? (
          <>
            <Text className="text-base font-regular mb-2">Активные проекты</Text>
            {projects.map(renderProjectCard)}
          </>
        ) : (
          <>
            <Text className="text-base font-regular mb-2">Заявки</Text>
            {requestsLoading ? (
              <ActivityIndicator size="large" color="black" />
            ) : (
              requests.map(renderProjectCard)
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
