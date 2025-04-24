import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { BACKEND_URL } from "../../../utils/config";
import { useAuthStore } from "../../../store/authStore";
import { useNavigation } from "@react-navigation/native";

export default function CreateProjectStep1Screen() {
  const token = useAuthStore((state) => state.token);
  const navigation = useNavigation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sourceImages, setSourceImages] = useState([]);
  const [refImages, setRefImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [searchCategory, setSearchCategory] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/work-category/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setCategories)
      .catch((err) => console.error("Ошибка загрузки категорий", err));
  }, []);

  const pickImage = async (setter) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      setter((prev) => [...prev, result.assets[0]]);
    }
  };

  const toggleCategory = (id) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (!title || !description || selectedCategoryIds.length === 0) {
      alert("Заполните все поля и выберите категории");
      return;
    }

    navigation.navigate("CreateProjectStep2", {
      title,
      description,
      sourceImages,
      refImages,
      selectedCategoryIds,
    });
  };

  const filteredCategories = searchCategory.trim()
    ? categories.filter((cat) =>
        cat.action.toLowerCase().includes(searchCategory.toLowerCase())
      )
    : categories.slice(0, 8);

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-16" contentContainerStyle={{ paddingBottom: 100 }}>
      <Text className="text-2xl font-bold mb-6">Новый проект</Text>

      <Text className="text-xs text-gray-400 mb-1">Название проекта</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        className="border border-gray-300 px-3 py-2 rounded-lg mb-4"
        placeholder="Введите название"
      />

      <Text className="text-xs text-gray-400 mb-1">Описание проекта</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        className="border border-gray-300 px-3 py-2 rounded-lg mb-4"
        placeholder="Опишите суть проекта"
        multiline
      />

      <Text className="text-xs text-gray-400 mb-2">Фотографии объекта</Text>
      <ScrollView horizontal className="mb-4">
        {sourceImages.map((img, i) => (
          <Image key={i} source={{ uri: img.uri }} className="w-24 h-24 mr-2 rounded-md" />
        ))}
        <TouchableOpacity onPress={() => pickImage(setSourceImages)} className="w-24 h-24 bg-gray-200 justify-center items-center rounded-md">
          <Ionicons name="add" size={24} color="black" />
        </TouchableOpacity>
      </ScrollView>

      <Text className="text-xs text-gray-400 mb-2">Фото референса</Text>
      <ScrollView horizontal className="mb-4">
        {refImages.map((img, i) => (
          <Image key={i} source={{ uri: img.uri }} className="w-24 h-24 mr-2 rounded-md" />
        ))}
        <TouchableOpacity onPress={() => pickImage(setRefImages)} className="w-24 h-24 bg-gray-200 justify-center items-center rounded-md">
          <Ionicons name="add" size={24} color="black" />
        </TouchableOpacity>
      </ScrollView>

      <Text className="text-xs text-gray-400 mb-2">Выбранные категории</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        {selectedCategoryIds.map((id) => {
          const cat = categories.find((c) => c.id === id);
          return (
            <View key={id} className="bg-black px-3 py-1 rounded-full flex-row items-center mr-2">
              <Text className="text-white text-xs mr-1">{cat?.action}</Text>
              <TouchableOpacity onPress={() => toggleCategory(id)}>
                <Ionicons name="close" size={14} color="white" />
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="border border-black py-2 px-4 rounded-xl mb-4"
      >
        <Text className="text-sm font-medium text-center">Добавить категории работ</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleNext} className="bg-black mt-4 py-3 rounded-xl items-center">
        <Text className="text-white font-semibold text-base">Далее</Text>
      </TouchableOpacity>

      {/* Модалка категорий */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <Pressable
          className="flex-1 bg-black/30 justify-center items-center px-6"
          onPress={() => setModalVisible(false)}
        >
          <View className="bg-white rounded-xl w-full p-4 space-y-4">
            <Text className="text-lg font-semibold">Категории работ</Text>
            <TextInput
              value={searchCategory}
              onChangeText={setSearchCategory}
              placeholder="Поиск категории..."
              placeholderTextColor="#999"
              className="border border-gray-300 rounded-full px-3 py-2 text-base"
            />
            <View className="flex-row flex-wrap">
              {filteredCategories.map((cat) => {
                const selected = selectedCategoryIds.includes(cat.id);
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => toggleCategory(cat.id)}
                    className={`px-3 py-1 rounded-full border mr-2 mt-2 ${
                      selected ? "bg-black" : "bg-white"
                    }`}
                  >
                    <Text className={`text-sm ${selected ? "text-white" : "text-black"}`}>{cat.action}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}