import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../../store/authStore";
import Logo from "../../assets/logo.svg";
import ProfileIcon from "../../assets/Profile-icon.svg";
import ArrowIcon from "../../assets/Arrow-icon.svg";
import { BACKEND_URL } from "../../utils/config";

export default function NotificationScreen() {
  const token = useAuthStore((state) => state.token);
  const navigation = useNavigation();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

 const fetchNotifications = async () => {
  try {
    setLoading(true);

    const res = await fetch(`${BACKEND_URL}/api/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Проверяем, что тело не пустое
    const text = await res.text();

    let data = [];
    if (text) {
      data = JSON.parse(text);
    }

    setNotifications(data);
  } catch (err) {
    console.error("Ошибка загрузки уведомлений:", err);

    // Фоллбек на тестовые данные
    setNotifications([
      {
        id: 1,
        type: "info",
        title: "Материалы подобраны!",
        text: "Мы нашли стройматериалы по вашему запросу.",
        timestamp: Date.now() - 1000 * 60 * 15,
        isRead: false,
      },
    ]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications().finally(() => setRefreshing(false));
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        isRead: true,
      }))
    );
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              isRead: true,
            }
          : n
      )
    );
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-[#F4F4F9] px-4 pt-20 pb-4 rounded-b-3xl">
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowIcon />
          </TouchableOpacity>
          <Logo width={130} height={20} />
          <TouchableOpacity onPress={() => navigation.navigate("UserProfile")}>
            <ProfileIcon />
          </TouchableOpacity>
        </View>

        {notifications.length > 0 && (
          <TouchableOpacity
            onPress={markAllAsRead}
            className="mt-2 bg-black py-2 rounded-xl"
          >
            <Text className="text-white text-center">Отметить все как прочитанные</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4 pt-4"
          contentContainerStyle={{ paddingBottom: 60 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {notifications.length === 0 && (
            <View className="items-center mt-12">
              <Ionicons name="notifications-outline" size={64} color="#ccc" />
              <Text className="mt-4 text-base text-gray-600">Нет уведомлений</Text>
            </View>
          )}

          {notifications.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => !item.isRead && markAsRead(item.id)}
              className={`rounded-xl mb-3 p-4 ${
                item.isRead ? "bg-gray-100" : "bg-yellow-50 border border-yellow-200"
              }`}
            >
              <View className="flex-row items-start">
                <View className="w-10 h-10 rounded-lg bg-yellow-200 items-center justify-center mr-3">
                  {item.type === "info" && (
                    <Ionicons name="checkmark-circle-outline" size={20} />
                  )}
                  {item.type === "chat" && (
                    <Ionicons name="chatbubble-ellipses-outline" size={20} />
                  )}
                  {item.type === "request" && (
                    <Ionicons name="alert-circle-outline" size={20} />
                  )}
                </View>
                <View className="flex-1">
                  <View className="flex-row justify-between items-center">
                    <Text className="font-semibold">{item.title}</Text>
                    <Text className="text-xs text-gray-400">
                      {formatTime(item.timestamp)}
                    </Text>
                  </View>
                  <Text className="text-gray-700 mt-1">{item.text}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
