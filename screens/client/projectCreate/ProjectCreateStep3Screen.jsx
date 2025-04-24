import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { BACKEND_URL } from "../../../utils/config";
import { useAuthStore } from "../../../store/authStore";

export default function CreateProjectStep3Screen() {
  const { params } = useRoute();
  const navigation = useNavigation();
    const token = useAuthStore((state) => state.token);

  const {
    title,
    description,
    sourceImages,
    refImages,
    selectedCategoryIds,
    categoryDescriptions,
    categoryMaterials,
    categories = [],
  } = params;

  const handleSubmit = async () => {
    const formData = new FormData();
  
    formData.append("title", title);
    formData.append("description", description);
  
    if (sourceImages[0]) {
        sourceImages.forEach((img, index) => {
            formData.append("sourceImg", {
              uri: img.uri,
              name: img.fileName || `source_${index}.jpg`,
              type: "image/jpeg",
            });
          });
    }
  
    if (refImages[0]) {
        refImages.forEach((img, index) => {
            formData.append("refImg", {
              uri: img.uri,
              name: img.fileName || `ref_${index}.jpg`,
              type: "image/jpeg",
            });
          });
    }
  
    const projectTagsJson = selectedCategoryIds.map((id) => ({
      categoryId: id,
      categoryDescription: categoryDescriptions[id] || "",
      selectedMaterialIds: categoryMaterials[id] || [],
    }));
  
    formData.append("projectTagsJson", JSON.stringify(projectTagsJson));
  
    console.log("👉 Отправляем:", {
      title,
      description,
      sourceImages,
      refImages,
      projectTagsJson,
    });
  
    try {
      const response = await fetch(`${BACKEND_URL}/api/project/create`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, // 🛡️ добавлен JWT
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
  
      const text = await response.text();
      console.log("📩 Ответ:", response.status, text);
  
      if (!response.ok) throw new Error(text || "Произошла ошибка при создании проекта");
  
      Alert.alert("Успешно", "Проект создан!");
      navigation.goBack();
    } catch (err) {
      console.error("❌ Ошибка:", err);
      Alert.alert("Ошибка", err.message);
    }
  };
  
  

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-16" contentContainerStyle={{ paddingBottom: 100 }}>
      <Text className="text-2xl font-bold mb-4">Проверьте проект перед отправкой</Text>

      <Text className="text-sm text-gray-500 mb-1">Название</Text>
      <Text className="text-base font-medium mb-2">{title}</Text>

      <Text className="text-sm text-gray-500 mb-1">Описание</Text>
      <Text className="text-base font-medium mb-4">{description}</Text>

      <Text className="text-sm text-gray-500 mb-1">Фото объекта</Text>
      <ScrollView horizontal className="mb-4">
        {sourceImages.map((img, i) => (
          <Image key={i} source={{ uri: img.uri }} className="w-24 h-24 mr-2 rounded-md" />
        ))}
      </ScrollView>

      <Text className="text-sm text-gray-500 mb-1">Фото референса</Text>
      <ScrollView horizontal className="mb-4">
        {refImages.map((img, i) => (
          <Image key={i} source={{ uri: img.uri }} className="w-24 h-24 mr-2 rounded-md" />
        ))}
      </ScrollView>

      <Text className="text-sm text-gray-500 mb-3">Категории работ</Text>
      {selectedCategoryIds.map((id) => (
        <View key={id} className="mb-4">
          <Text className="text-base font-semibold mb-1">• {categories.find((c) => c.id === id)?.action || `Категория ${id}`}</Text>
          <Text className="text-sm text-gray-600 mb-1">
            {categoryDescriptions[id] || "Без описания"}
          </Text>
          <View className="flex-row flex-wrap">
            {(categoryMaterials[id] || []).map((matId) => (
              <View key={matId} className="bg-yellow-200 px-3 py-1 rounded-full mr-2 mt-2">
                <Text className="text-sm text-gray-800">Материал ID: {matId}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
       
      <TouchableOpacity onPress={handleSubmit} className="bg-black mt-6 py-3 rounded-xl items-center">
        <Text className="text-white font-semibold text-base">Создать проект</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
