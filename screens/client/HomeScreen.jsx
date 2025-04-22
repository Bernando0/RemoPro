import React, { useRef } from "react";
import {
  Animated,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Logo from "../../assets/logo.svg";
import NoticeIcon from "../../assets/Notice-icon.svg";
import ProfileIcon from "../../assets/Profile-icon.svg";
import { myProjects, teams } from "../../mock/mockData";
import { useNavigation } from '@react-navigation/native';
import TeamCard from "../../components/TeamCard";


export default function HomeScreen() {
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


  const navigation = useNavigation();

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
      <View className="bg-yellow-300 rounded-b-3xl overflow-hidden">
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

        {/* Анимируемая часть — "Ваши проекты" */}
        <Animated.View
          style={{ height: headerHeight, opacity: projectsOpacity }}
          className="px-4 pb-2"
        >
          <Text className="text-base font-regular mb-2 text-black">
            Ваши проекты
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {myProjects.map((project) => (
              <View key={project.id} className="w-24 h-24 mr-3 relative">
                <Image
                  source={project.image}
                  className="w-24 h-24 rounded-md"
                />
                <View className="absolute bottom-0 left-0 right-0 bg-black/40 px-1 py-0.5 rounded-b-md">
                  <Text
                    numberOfLines={1}
                    className="text-white text-xs font-medium"
                  >
                    {project.title}
                  </Text>
                </View>
              </View>
            ))}
            <TouchableOpacity className="w-24 h-24 border border-dashed border-black rounded-md justify-center items-center">
              <Text className="text-xs text-center text-black">Создать{"\n"}проект</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>

      <Animated.ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 60 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <Text className="text-base font-regular mb-3">Исполнители</Text>
        <View className="flex-row flex-wrap justify-between">
          {teams.map((team) => {
            const visibleTags = team.tags.slice(0, 2);
            const hiddenTagsCount = team.tags.length - 2;

            return (
              <TouchableOpacity
                key={team.id}
                onPress={() => navigation.navigate("TeamDetail", { teamId: team.id })}
                className="w-[48%] bg-yellow-50 rounded-xl mb-4 overflow-hidden"
              >
                <View className="relative w-full h-28">
                  <Image source={team.image} className="w-full h-28" />
                  <TouchableOpacity
                    onPress={() => {
                      team.liked = !team.liked;
                    }}
                    className="absolute top-1 right-1 p-1.5 rounded-full"
                  >
                    <Ionicons
                      name={team.liked ? "heart" : "heart-outline"}
                      size={36}
                      color={team.liked ? "#facc15" : "white"}
                    />
                  </TouchableOpacity>
                </View>
                <View className="p-3 space-y-1">
                  <View className="flex-row items-center space-x-1">
                    <Ionicons name="star" size={12} color="black" />
                    <Text className="text-xs pl-1 text-gray-600">
                      {team.rating}
                    </Text>
                    <Text className="text-xs pl-1 text-gray-600">
                      ({team.reviews} отзывов)
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
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.ScrollView>
    </View>
  );
}