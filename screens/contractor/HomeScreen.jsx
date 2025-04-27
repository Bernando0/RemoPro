import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from "../../store/authStore";
import { BACKEND_URL } from "../../utils/config";

import Logo from "../../assets/logo.svg";
import NoticeIcon from "../../assets/Notice-icon.svg";
import ProfileIcon from "../../assets/Profile-icon.svg";

export default function ContractorHomeScreen() {
  const navigation = useNavigation();
  const token = useAuthStore((state) => state.token);
  const scrollY = useRef(new Animated.Value(0)).current;

  const [myProjects, setMyProjects] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [120, 0],
    extrapolate: "clamp",
  });

  const projectsOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsRes, recsRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/project-contractor/get/my/approved`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BACKEND_URL}/api/contractor/project/find`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
  
        const projectsData = await projectsRes.json();
        const recsData = await recsRes.json();
  
        // Убираем дубли по projectId
        const uniqueProjects = [];
        const seen = new Set();
        for (const project of projectsData) {
          if (!seen.has(project.projectId)) {
            uniqueProjects.push(project);
            seen.add(project.projectId);
          }
        }
  
        setMyProjects(uniqueProjects);
        setRecommendations(recsData);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchData();
  }, [token]);
  

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-yellow-300 rounded-b-3xl overflow-hidden">
        <View className="px-4 pt-20 pb-2">
          <View className="flex-row items-center justify-between mb-2">
            <View className="absolute left-0 right-0 items-center z-0">
              <Logo width={130} height={20} />
            </View>
            <View className="flex-row space-x-2 ml-auto">
              <TouchableOpacity className="p-1" onPress={() => navigation.navigate("ContractorNotification")}>
                <NoticeIcon width={36} height={36} />
              </TouchableOpacity>
              <TouchableOpacity className="p-1" onPress={() => navigation.navigate("ContractorProfile")}>
                <ProfileIcon width={36} height={36} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Animated Projects */}
        <Animated.View style={{ height: headerHeight, opacity: projectsOpacity }} className="px-4 pb-2">
          <Text className="text-base font-regular mb-2 text-black">Ваши проекты</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {myProjects.map((project) => (
              <TouchableOpacity
                key={project.projectId}
                onPress={() => navigation.navigate("ContractorProjectDetail", { projectId: project.projectId })}
                className="w-24 h-24 mr-3 relative"
              >
                <Image
                  source={{ uri: `${BACKEND_URL}${project.projectFirstImg}` }}
                  className="w-24 h-24 rounded-md"
                />
                <View className="absolute bottom-0 left-0 right-0 bg-black/40 px-1 py-0.5 rounded-b-md">
                  <Text numberOfLines={1} className="text-white text-xs font-medium">
                    {project.projectTitle}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => navigation.navigate("Projects")}
              className="w-24 h-24 border border-dashed border-black rounded-md justify-center items-center"
            >
              <Text className="text-xs text-black text-center">Посмотреть{"\n"}заявки</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>

      {/* Recommendations */}
      <Animated.ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 60 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <Text className="text-base font-regular mb-3">Рекомендации</Text>

        {recommendations.map((project) => {
          const firstImage = project.sourceImg?.find((img) => img.type === "SOURCE")?.imageUrl;
          const imageUrl = firstImage ? `${BACKEND_URL}${firstImage}` : null;
          const tags = project.projectTags || [];

          return (
            <TouchableOpacity
              key={project.id}
              onPress={() => navigation.navigate("ContractorProjectDetail", { projectId: project.id })}
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
                    {project.title}
                  </Text>
                  <Text numberOfLines={3} className="text-xs text-gray-500">
                    {project.description || "Нет описания"}
                  </Text>
                </View>
              </View>

              {/* Теги категорий */}
              <View className="flex-row flex-wrap">
                {tags.map((tag, idx) => (
                  <View key={idx} className="bg-yellow-200 px-2 py-1 rounded-full mr-2 mb-2">
                    <Text className="text-xs text-black">{tag.category?.action}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}
