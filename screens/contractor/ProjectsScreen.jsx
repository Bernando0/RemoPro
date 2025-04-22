import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Logo from "../../assets/logo.svg";
import NoticeIcon from "../../assets/Notice-icon.svg";
import ProfileIcon from "../../assets/Profile-icon.svg";
import ArrowIcon from "../../assets/Arrow-icon.svg";
import { contractorProjects, contractorRequests } from "../../mock/contractorMockData";

export default function ContractorProjectsScreen() {
  const [activeTab, setActiveTab] = useState("projects");

  const renderTab = (label, value) => (
    <TouchableOpacity
      onPress={() => setActiveTab(value)}
      className={`flex-1 pb-2 items-center ${activeTab === value ? "border-b-2 border-black" : ""}`}
    >
      <Text className={`text-sm font-semibold ${activeTab === value ? "text-black" : "text-gray-400"}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderProjectCard = (project) => (
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
          <View key={i} className="bg-yellow-200 px-2 py-1 rounded-full mr-2 mb-2">
            <Text className="text-xs text-black">{tag}</Text>
          </View>
        ))}
      </View>

      <View className="flex-row items-center space-x-4 mt-1">
        <View className="flex-row items-center space-x-1">
          <Ionicons name="chatbubble-outline" size={12} color="#999" />
          <Text className="text-xs text-gray-500">{project.comments}</Text>
        </View>
        <View className="flex-row items-center ml-2 space-x-1">
          <Ionicons name="eye-outline" size={12} color="#999" />
          <Text className="text-xs text-gray-500">{project.views}</Text>
        </View>
      </View>
    </View>
  );

  const renderRequestCard = (request) => (
    <View key={request.id} className="bg-yellow-50 rounded-xl mb-4 p-3">
      <View className="flex-row mb-2">
        <Image source={request.project.image} className="w-20 h-20 rounded-md mr-3" />
        <View className="flex-1">
          <Text numberOfLines={3} className="text-xs text-black mb-1">
            {request.project.description}
          </Text>
          <Text className="text-[10px] text-gray-500">{request.date}</Text>
        </View>
      </View>

      <View className="flex-row flex-wrap">
        {request.project.tags.map((tag, i) => (
          <View key={i} className="bg-yellow-200 px-2 py-1 rounded-full mr-2 mb-2">
            <Text className="text-xs text-black">{tag}</Text>
          </View>
        ))}
      </View>

      <View className="h-[1px] bg-gray-300 my-3" />

      <View className="flex-row space-x-4">
        <TouchableOpacity className="flex-1 bg-black py-2 rounded-lg">
          <Text className="text-white text-center text-sm font-regular">Принять</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 border border-black py-2 rounded-lg">
          <Text className="text-black text-center text-sm font-regular">Отказаться</Text>
        </TouchableOpacity>
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
              <NoticeIcon width={36} height={36} />
            </TouchableOpacity>
            <TouchableOpacity className="p-1">
              <ProfileIcon width={36} height={36} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Табы — на белом фоне */}
      <View className="flex-row px-4 pt-4 bg-white">
        {renderTab("Проекты", "projects")}
        {renderTab("Заявки", "requests")}
      </View>

      {/* Контент */}
      <ScrollView className="px-4 pt-4" contentContainerStyle={{ paddingBottom: 60 }}>
        {activeTab === "projects" ? (
          <>
            <Text className="text-base font-regular mb-2">Активные</Text>
            {contractorProjects.active.map(renderProjectCard)}

            <Text className="text-base font-regular mt-4 mb-2">Выполненные</Text>
            {contractorProjects.completed.map(renderProjectCard)}
          </>
        ) : (
          contractorRequests.map(renderRequestCard)
        )}
      </ScrollView>
    </View>
  );
}
