import React, { useEffect, useState, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  RefreshControl
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NoticeIcon from "../../assets/Notice-icon.svg";
import ProfileIcon from "../../assets/Profile-icon.svg";
import ArrowIcon from "../../assets/Arrow-icon.svg";
import IconTeam from "../../assets/Inbox.png"; // Заглушка
import { BACKEND_URL } from "../../utils/config";
import { useAuthStore } from "../../store/authStore";
import { useNavigation } from "@react-navigation/native";


export default function TeamsScreen() {
  const token = useAuthStore((state) => state.token);
  const navigation = useNavigation();


  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [teams, setTeams] = useState([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [refreshing, setRefreshing] = useState(false); 

  const fetchTeams = useCallback(async () => {
    let url = `${BACKEND_URL}/api/contractor/filter`;
    if (selectedCategories.length > 0) {
      const query = selectedCategories.map((id) => `categoryIds=${id}`).join("&");
      url += `?${query}`;
    }

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTeams(data);
    } catch (err) {
      console.error("Ошибка при загрузке команд:", err);
    }
  }, [selectedCategories, token]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTeams().finally(() => setRefreshing(false));
  }, [fetchTeams]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/work-category/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Ошибка при загрузке категорий:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTeams();
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [selectedCategories]);


  const filteredCategories = categorySearch.trim()
    ? categories.filter((cat) =>
        cat.action.toLowerCase().includes(categorySearch.toLowerCase())
      )
    : categories.slice(0, 8);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat.id) ? prev.filter((c) => c !== cat.id) : [...prev, cat.id]
    );
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
      <View className="bg-yellow-300 px-4 pt-20 pb-4 rounded-b-3xl">
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity className="p-1" onPress={() => navigation.navigate("Home")}>
            <ArrowIcon name="arrow-back" size={36} />
          </TouchableOpacity>

          <View className="w-[60%] border border-black h-[36px] rounded-[12px] px-3 py-1 flex-row items-center">
            <TextInput
              className="flex-1 ml-2 text-base"
              placeholder="Поиск..."
              placeholderTextColor="#000000"
              value={searchText}
              onChangeText={setSearchText}
            />
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

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2 px-1 flex-row">
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="border border-black px-4 py-2 rounded-[8px] flex-row items-center mr-2"
          >
            <Text className="text-xs font-medium">Фильтры</Text>
            {selectedCategories.length > 0 && (
              <View className="w-5 h-5 bg-black rounded-full items-center justify-center ml-1">
                <Text className="text-[10px] text-white font-bold">{selectedCategories.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          {selectedCategories.map((id) => {
            const cat = categories.find((c) => c.id === id);
            return (
              <View
                key={id}
                className="bg-black px-3 py-1 rounded-[8px] flex-row items-center space-x-1 mr-2"
              >
                <Text className="text-xs text-white">{cat?.action || "Категория"}</Text>
                <TouchableOpacity
                  onPress={() => toggleCategory(cat)}
                >
                  <View className="w-4 h-4 border ml-1 border-white rounded-full items-center justify-center">
                    <Ionicons name="close" size={10} color="#fff" />
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Модалка фильтров */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <Pressable
          className="flex-1 bg-black/30 justify-center items-center px-6"
          onPress={() => setModalVisible(false)}
        >
          <View className="bg-white rounded-xl w-full p-4 space-y-4">
            <Text className="text-lg font-semibold">Фильтры</Text>
            <TextInput
              value={categorySearch}
              onChangeText={setCategorySearch}
              placeholder="Поиск категории..."
              placeholderTextColor="#999"
              className="border border-gray-300 rounded-full px-3 py-1 text-m text-black"
            />
            <View className="flex-row flex-wrap">
              {filteredCategories.map((cat) => {
                const selected = selectedCategories.includes(cat.id);
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => toggleCategory(cat)}
                    className={`px-3 py-1 rounded-full border mr-2 mt-2 ${
                      selected ? "bg-black" : "bg-white"
                    }`}
                  >
                    <Text className={`text-xs ${selected ? "text-white" : "text-black"}`}>{cat.action}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </Pressable>
      </Modal>

      <ScrollView
  className="flex-1 px-4 pt-2"
  contentContainerStyle={{ paddingBottom: 60 }}
  refreshControl={  // 🔥 Вот сюда добавляем
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
>
        
        <View className="flex-row flex-wrap justify-between">
          {teams.map((team) => {
            const visibleTags = (team.categories || []).slice(0, 2);
            const hiddenTagsCount = (team.categories || []).length - 2;
            const hasImage = Boolean(team.previewImage);
            const imageUri = hasImage ? `${BACKEND_URL}${team.previewImage}` : null;

            return (
              <TouchableOpacity
  key={team.id}
  className="w-[48%] bg-yellow-50 rounded-xl mb-4 overflow-hidden"
  onPress={() => navigation.navigate("TeamDetail", { teamId: team.id })}
>
  <View className="relative w-full h-28 justify-center items-center">
    {hasImage ? (
      <Image source={{ uri: imageUri }} className="w-full h-28" />
    ) : (
      <View className="w-full h-28 bg-gray-200 justify-center items-center">
        <Image source={IconTeam} className="w-12 h-12 opacity-50" />
      </View>
    )}
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
        <View key={i} className="bg-yellow-200 px-2 py-0.5 rounded-full mr-2 mt-2">
          <Text className="text-xs text-gray-800">{tag}</Text>
        </View>
      ))}
      <HiddenTagsCount count={hiddenTagsCount} />
    </View>
    <View className="flex-row items-center mt-1">
      <Ionicons name="location-outline" size={14} color="#999" />
      <Text className="text-xs text-gray-600 ml-1">{team.location || "Не указано"}</Text>
    </View>
  </View>
</TouchableOpacity>

            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
