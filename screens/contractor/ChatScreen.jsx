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
import { projectChats, messages } from "../../mock/chatMockData";

export default function ContractorChatScreen() {
  const [activeTab, setActiveTab] = useState("projects");

  const renderTab = (label, value) => (
    <TouchableOpacity
      onPress={() => setActiveTab(value)}
      className={`flex-1 pb-2 items-center ${
        activeTab === value ? "border-b-2 border-black" : ""
      }`}
    >
      <Text
        className={`text-sm font-semibold ${
          activeTab === value ? "text-black" : "text-gray-400"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderProjectChatItem = (chat) => (
    <TouchableOpacity key={chat.id} className="bg-gray-50 rounded-xl p-4 mb-4">
      <View className="flex-row items-start space-x-3 mb-2">
        <Image source={chat.avatar} className="w-14 h-14 mr-2 rounded-md" />
        <View className="flex-1">
          <Text className="font-semibold text-base">{chat.name}</Text>
          <Text className="text-sm text-gray-700" numberOfLines={1}>
            {chat.message}
          </Text>
        </View>
        {chat.badge > 0 && (
          <View className="bg-yellow-300 rounded-full px-2 py-1 min-w-[24px] items-center">
            <Text className="text-xs font-bold text-black">{chat.badge}</Text>
          </View>
        )}
      </View>
      <View className="h-[1px] bg-gray-200 mb-2" />
      <View className="flex-row items-start space-x-3">
        <Image
          source={chat.project.image}
          className="w-14 h-14 mr-2 rounded-md"
        />
        <Text className="text-sm text-gray-700 flex-1" numberOfLines={2}>
          {chat.project.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderMessageItem = (msg) => (
    <TouchableOpacity key={msg.id} className="bg-gray-50 rounded-xl p-4 mb-4">
      <View className="flex-row items-start space-x-3">
        <Image source={msg.avatar} className="w-14 h-14 mr-2 rounded-md" />
        <View className="flex-1">
          <Text className="font-semibold text-base">{msg.name}</Text>
          <Text className="text-sm text-gray-700" numberOfLines={1}>
            {msg.message}
          </Text>
        </View>
        {msg.badge > 0 && (
          <View className="bg-yellow-300 rounded-full px-2 py-1 min-w-[24px] items-center">
            <Text className="text-xs font-bold text-black">{msg.badge}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-yellow-300 px-4 pt-20 pb-4 rounded-b-3xl">
              <View className="flex-row items-center justify-between mb-2">
                <TouchableOpacity className="p-1" onPress={() => navigation.goBack()}>
                  <ArrowIcon name="arrow-back" width={36} height={36} />
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

      {/* Tabs */}
      <View className="flex-row px-4 pt-4 bg-white">
        {renderTab("Проекты", "projects")}
        {renderTab("Сообщения", "messages")}
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {activeTab === "projects"
          ? projectChats.map(renderProjectChatItem)
          : messages.map(renderMessageItem)}
      </ScrollView>
    </View>
  );
}
