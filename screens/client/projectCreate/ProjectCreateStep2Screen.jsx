import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { BACKEND_URL } from "../../../utils/config";
import { useAuthStore } from "../../../store/authStore";
import { Ionicons } from "@expo/vector-icons";

export default function CreateProjectStep2Screen() {
  const token = useAuthStore((state) => state.token);
  const navigation = useNavigation();
  const route = useRoute();
  const {
    title,
    description,
    sourceImages,
    refImages,
    selectedCategoryIds,
  } = route.params;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [categoryData, setCategoryData] = useState(null);
  const [categoryDescriptions, setCategoryDescriptions] = useState({});
  const [categoryMaterials, setCategoryMaterials] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [materialSearch, setMaterialSearch] = useState("");

  const currentCategoryId = selectedCategoryIds[currentIndex];

  useEffect(() => {
    if (!currentCategoryId) return;
    setLoading(true);
    fetch(`${BACKEND_URL}/api/work-category/${currentCategoryId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setCategoryData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки категории:", err);
        setLoading(false);
      });
  }, [currentCategoryId]);

  const handleMaterialToggle = (materialId) => {
    setCategoryMaterials((prev) => {
      const current = prev[currentCategoryId] || [];
      return {
        ...prev,
        [currentCategoryId]: current.includes(materialId)
          ? current.filter((id) => id !== materialId)
          : [...current, materialId],
      };
    });
  };

  const handleNext = () => {
    if (currentIndex < selectedCategoryIds.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      navigation.navigate("CreateProjectStep3", {
        title,
        description,
        sourceImages,
        refImages,
        selectedCategoryIds,
        categoryDescriptions,
        categoryMaterials,
      });
    }
  };

  if (loading || !categoryData) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  const filteredMaterials = materialSearch.trim()
    ? categoryData.materials.filter((mat) =>
        mat.material.toLowerCase().includes(materialSearch.toLowerCase())
      )
    : categoryData.materials.slice(0, 8);

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-16" contentContainerStyle={{ paddingBottom: 100 }}>
      <Text className="text-2xl font-bold mb-4">
        Этап {currentIndex + 1} из {selectedCategoryIds.length}
      </Text>
      <Text className="text-base font-semibold mb-2">{categoryData.action}</Text>

      <Text className="text-xs text-gray-400 mb-1">Описание работ</Text>
      <TextInput
        value={categoryDescriptions[currentCategoryId] || ""}
        onChangeText={(text) =>
          setCategoryDescriptions((prev) => ({ ...prev, [currentCategoryId]: text }))
        }
        placeholder="Опишите, что нужно сделать"
        className="border border-gray-300 px-3 py-2 rounded-lg mb-4"
        multiline
      />

      {categoryData.has_material && (
        <>
          <Text className="text-xs text-gray-400 mb-2">Выбранные материалы</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            {(categoryMaterials[currentCategoryId] || []).map((matId) => {
              const mat = categoryData.materials.find((m) => m.id === matId);
              return (
                <View key={matId} className="bg-black px-3 py-1 rounded-full flex-row items-center mr-2">
                  <Text className="text-white text-xs mr-1">{mat?.material}</Text>
                  <TouchableOpacity onPress={() => handleMaterialToggle(matId)}>
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
            <Text className="text-sm font-medium text-center">Добавить материалы</Text>
          </TouchableOpacity>

          <Modal visible={modalVisible} transparent animationType="fade">
            <Pressable
              className="flex-1 bg-black/30 justify-center items-center px-6"
              onPress={() => setModalVisible(false)}
            >
              <View className="bg-white rounded-xl w-full p-4 space-y-4">
                <Text className="text-lg font-semibold">Материалы</Text>
                <TextInput
                  value={materialSearch}
                  onChangeText={setMaterialSearch}
                  placeholder="Поиск материала..."
                  placeholderTextColor="#999"
                  className="border border-gray-300 rounded-full px-3 py-2 text-base"
                />
                <View className="flex-row flex-wrap">
                  {filteredMaterials.map((mat) => {
                    const selected = categoryMaterials[currentCategoryId]?.includes(mat.id);
                    return (
                      <TouchableOpacity
                        key={mat.id}
                        onPress={() => handleMaterialToggle(mat.id)}
                        className={`px-3 py-1 rounded-full border mr-2 mt-2 ${
                          selected ? "bg-black" : "bg-white"
                        }`}
                      >
                        <Text className={`text-sm ${selected ? "text-white" : "text-black"}`}>{mat.material}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </Pressable>
          </Modal>
        </>
      )}

      <TouchableOpacity onPress={handleNext} className="bg-black mt-8 py-3 rounded-xl items-center">
        <Text className="text-white font-semibold text-base">
          {currentIndex === selectedCategoryIds.length - 1 ? "Продолжить" : "Следующий этап"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}