import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import NoticeIcon from "../../assets/Notice-icon.svg";
import ProfileIcon from "../../assets/Profile-icon.svg";
import ArrowIcon from "../../assets/Arrow-icon.svg";
import { BACKEND_URL } from "../../utils/config";
import { useAuthStore } from "../../store/authStore";

export default function OrdersScreen() {
  const token = useAuthStore((state) => state.token);
  const navigation = useNavigation();

  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");

  const filteredCategories = categorySearch.trim()
    ? categories.filter((cat) =>
        cat.action.toLowerCase().includes(categorySearch.toLowerCase())
      )
    : categories.slice(0, 8);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat.id)
        ? prev.filter((c) => c !== cat.id)
        : [...prev, cat.id]
    );
  };

  const fetchProjects = async () => {
    let url = `${BACKEND_URL}/api/contractor/project/find`;
    if (selectedCategories.length > 0) {
      const query = selectedCategories.map((id) => `categoryId=${id}`).join("&");
      url += `?${query}`;
    }
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Ошибка загрузки проектов:", err);
    }
  };

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/work-category/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setCategories)
      .catch((err) => console.error("Ошибка загрузки категорий:", err));
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [selectedCategories]);

  return (
    <View className="flex-1 bg-white">
      {/* Хедер */}
      <View className="bg-[#F4F4F9] px-4 pt-20 pb-4 rounded-b-3xl">
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity className="p-1" onPress={() => navigation.goBack()}>
            <ArrowIcon width={36} height={36} />
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
            <TouchableOpacity className="p-1" onPress={() => navigation.navigate("ContractorNotification")}>
              <NoticeIcon width={36} height={36} />
            </TouchableOpacity>
            <TouchableOpacity className="p-1" onPress={() => navigation.navigate("ContractorProfile")}>
              <ProfileIcon width={36} height={36} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Фильтры */}
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
                <TouchableOpacity onPress={() => toggleCategory(cat)}>
                  <View className="w-4 h-4 border ml-1 border-white rounded-full items-center justify-center">
                    <Ionicons name="close" size={10} color="#fff" />
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Модалка выбора фильтров */}
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

      {/* Список проектов */}
      <ScrollView className="flex-1 px-4 pt-2" contentContainerStyle={{ paddingBottom: 60 }}>
        {projects
          .filter((proj) =>
            proj.title.toLowerCase().includes(searchText.toLowerCase())
          )
          .map((project) => {
            const firstImage = project.sourceImg?.find((img) => img.type === "SOURCE")?.imageUrl;
            const imageUrl = firstImage ? `${BACKEND_URL}${firstImage}` : null;
            const tags = project.projectTags || [];

            return (
              <TouchableOpacity
                key={project.id}
                onPress={() => navigation.navigate("ContractorProjectDetail", { projectId: project.id })}
                className="bg-[#F4F4F9] rounded-xl mb-4 p-3"
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

                <View className="flex-row flex-wrap">
                  {tags.map((tag, idx) => (
                    <View key={idx} className="bg-[#7B04DF20] px-2 py-1 rounded-full mr-2 mb-2">
                      <Text className="text-xs text-black">{tag.category?.action}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
}
