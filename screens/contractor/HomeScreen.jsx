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
import { myProjects } from "../../mock/mockData";
import { projects } from "../../mock/projectsData";

import Logo from "../../assets/logo.svg";
import NoticeIcon from "../../assets/Notice-icon.svg";
import ProfileIcon from "../../assets/Profile-icon.svg";
import { useNavigation } from '@react-navigation/native';

export default function ContractorHomeScreen() {
  const navigation = useNavigation();
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
              <TouchableOpacity className="p-1"
              onPress={() => navigation.navigate("ContractorProfile")}>
                <ProfileIcon width={36} height={36} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
 
        {/* Animated Projects */}
        <Animated.View
          style={{ height: headerHeight, opacity: projectsOpacity }}
          className="px-4 pb-2"
        >
          <Text className="text-base font-semibold mb-2 text-black">Ваши проекты</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {myProjects.map((project) => (
              <View key={project.id} className="w-24 h-24 mr-3 relative">
                <Image source={project.image} className="w-24 h-24 rounded-md" />
                <View className="absolute bottom-0 left-0 right-0 bg-black/40 px-1 py-0.5 rounded-b-md">
                  <Text numberOfLines={1} className="text-white text-xs font-medium">
                    {project.title}
                  </Text>
                </View>
              </View>
            ))}
            <TouchableOpacity className="w-24 h-24 border border-dashed border-black rounded-md justify-center items-center">
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
        <Text className="text-base font-semibold mb-3">Рекомендации</Text>
        {projects.map((project) => (
          <View key={project.id} className="bg-yellow-50 rounded-xl mb-4 p-3">
            <View className="flex-row mb-2">
              <Image source={project.image} className="w-20 h-20 rounded-md mr-3" />
              <View className="flex-1">
                <Text numberOfLines={3} className="text-xs text-black mb-1">{project.description}</Text>
                <Text className="text-[10px] text-gray-500">{project.date}</Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="ellipsis-horizontal" size={18} color="#999" />
              </TouchableOpacity>
            </View>

            <View className="flex-row flex-wrap">
              {project.tags.map((tag, i) => (
                <View key={i} className="bg-yellow-200 px-2 py-1 rounded-full mr-2 mb-2">
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
      </Animated.ScrollView>
    </View>
  );
}
