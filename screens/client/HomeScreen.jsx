

import React, { useEffect, useState, useRef } from "react";
import {
  Animated,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BACKEND_URL } from "../../utils/config";
import { useAuthStore } from "../../store/authStore";

import Logo from "../../assets/logo.svg";
import NoticeIcon from "../../assets/Notice-icon.svg";
import ProfileIcon from "../../assets/Profile-icon.svg";
import IconTeam from "../../assets/Inbox.png";

export default function HomeScreen() {

  const navigation = useNavigation();
  const token = useAuthStore((state) => state.token);

  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState(true);


  const [refreshing, setRefreshing] = useState(false);

  const getImageUri = (img) => {
  if (!img) return "";
  const candidate =
    typeof img === "string"
      ? img
      : img.url || img.imageUrl || img.path;
  if (!candidate) return "";
  if (candidate.startsWith("http")) return candidate;
  return `${BACKEND_URL}${candidate}`;
};



const fetchProjectsAndTeams = async () => {
  setRefreshing(true);
  setLoadingProjects(true);
  setLoadingTeams(true);

  try {
    // Загружаем проекты
    const resProjects = await fetch(`${BACKEND_URL}/api/project/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const projectsData = await resProjects.json();
    setProjects(projectsData);

    // Вычисляем категории
    const categoryIds = Array.from(
      new Set(
        projectsData.flatMap((project) =>
          project.tags.map((tag) => tag.category.categoryId)
        )
      )
    );

    // Формируем URL для исполнителей
    let url;
    if (categoryIds.length > 0) {
      url =
        `${BACKEND_URL}/api/contractor/filter?` +
        categoryIds.map((id) => `categoryIds=${id}`).join("&");
    } else {
      url = `${BACKEND_URL}/api/contractor/filter`;
    }

    // Загружаем исполнителей
    const resTeams = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const teamsData = await resTeams.json();
    setTeams(teamsData);

  } catch (err) {
    console.error("Ошибка при загрузке данных:", err);
  } finally {
    setLoadingProjects(false);
    setLoadingTeams(false);
    setRefreshing(false);
  }
};



  const scrollY = useRef(new Animated.Value(0)).current;

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
  fetchProjectsAndTeams();
}, [token]);


const onRefresh = () => {
  fetchProjectsAndTeams();
};

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
    <View className="bg-[#F4F4F9] rounded-b-3xl overflow-hidden">
      {/* Фиксированная часть хедера */}
      <View className="px-4 pt-20 pb-2">
        <View className="flex-row items-center justify-between mb-2">
          <View />
          <View className="absolute left-0 right-0 items-center z-0">
            <Logo width={130} height={20} />
          </View>
          <View className="flex-row space-x-2">
            <TouchableOpacity className="p-1"
            onPress={() => navigation.navigate("ClientNotification")}>
              
              <NoticeIcon name="notifications-outline" size={36} />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-1"
              onPress={() => navigation.navigate("UserProfile")}>
              <ProfileIcon name="person-circle-outline" size={36} />
            </TouchableOpacity>
          </View>

        </View>
      </View>

      



        {/* Анимируемая часть - Ваши проекты */}
        <Animated.View
          style={{ height: headerHeight, opacity: projectsOpacity }}
          className="px-4 pb-2"
       >
          <Text className="text-base font-regular mb-2 text-black">Ваши проекты</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {loadingProjects ? (
              <ActivityIndicator color="black" size="small" />
            ) : (
              <>
                {projects.map((project) => (
                  <TouchableOpacity
                    key={project.id}
                    className="w-24 h-24 mr-3 relative"
                    onPress={() => navigation.navigate("ProjectDetail", { projectId: project.id })}
                  >
                    <Image
  source={{ uri: getImageUri(project.sourceImg) }}
  className="w-24 h-24 rounded-md"
/>

                    <View className="absolute bottom-0 left-0 right-0 bg-black/40 px-1 py-0.5 rounded-b-md">
                      <Text numberOfLines={1} className="text-white text-xs font-medium">
                        {project.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  className="w-24 h-24 border border-dashed border-[#7B04DF] rounded-md justify-center items-center"
                  onPress={() => navigation.navigate("CreateProjectStep1")}
                >
                  <Text className="text-xs text-center text-[#7B04DF]">Создать{"\n"}проект</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </Animated.View>
      </View>

   {/* Исполнители */}
   <Animated.ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 60 }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={16}
        refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
      >
        <Text className="text-base font-regular mb-3">Рекомендованные исполнители</Text>
        <View className="flex-row flex-wrap justify-between">
          {loadingTeams ? (
            <ActivityIndicator color="black" size="small" />
          ) : (
            teams.map((team) => {
              const visibleTags = (team.categories || []).slice(0, 2);
              const hiddenTagsCount = (team.categories || []).length - 2;
              const hasImage = Boolean(team.previewImage);
              const imageUri = getImageUri(team.previewImage);


              return (
                <TouchableOpacity
                  key={team.id}
                  onPress={() => navigation.navigate("TeamDetail", { teamId: team.id })}
                  className="w-[48%] bg-[#F4F4F9] rounded-xl mb-4 overflow-hidden"
                >
                  <View className="relative w-full h-28 justify-center items-center">
                    {hasImage ? (
                      <Image source={{ uri: imageUri }} className="w-full h-28" />
                    ) : (
                      <View className="w-full h-28 bg-gray-200 justify-center items-center">
                        <Image source={IconTeam} className="w-12 h-12 opacity-50" />
                      </View>
                    )}
                    {/* НЕАКТИВНАЯ кнопка лайка */}
                    <TouchableOpacity disabled className="absolute top-1 right-1 p-1.5 rounded-full">
                      <Ionicons name="heart-outline" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                  <View className="p-3 space-y-1">
                    <Text className="font-regular text-sm" numberOfLines={2}>
                      {team.fullName || team.account_name}
                    </Text>
                    <Text className="text-xs text-gray-500" numberOfLines={2}>
                      {team.shortDescription || "Описание отсутствует"}
                    </Text>
                    <View className="flex-row flex-wrap items-center">
                      {visibleTags.map((tag, i) => (
                        <View key={i} className="bg-[#7B04DF20] px-2 py-0.5 rounded-full mr-2 mt-2">
                          <Text className="text-xs text-gray-800">{tag}</Text>
                        </View>
                      ))}
                      <HiddenTagsCount count={hiddenTagsCount} />
                    </View>
                    <View className="flex-row items-center mt-1">
                      <Ionicons name="location-outline" size={14} color="#999" />
                      <Text className="text-xs text-gray-600 ml-1">
                        {team.location?.location|| "Не указано"}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

