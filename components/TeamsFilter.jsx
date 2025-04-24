import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import filtersData from "../mock/filtersData.json";
const cities = filtersData.cities;

export default function FilterHeader({ city, setCity, selectedCategories, setSelectedCategories, allCategories }) {
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredCategories = allCategories.filter((cat) =>
    cat.toLowerCase().includes(categorySearch.toLowerCase())
  );

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row px-4 pt-3 pb-1"
        contentContainerStyle={{ gap: 8 }}
      >
        <TouchableOpacity
          onPress={() => setCityModalVisible(true)}
          className="border border-black px-4 py-2 rounded-[8px] flex-row items-center space-x-1"
        >
          <Ionicons name="location-outline" size={14} color="#000" />
          <Text className="text-xs font-medium">{city}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFilterModalVisible(true)}
          className="border border-black px-4 py-2 rounded-[8px] flex-row items-center space-x-1"
        >
          <Text className="text-xs font-medium">Фильтры</Text>
          {selectedCategories.length > 0 && (
            <View className="w-5 h-5 bg-black rounded-full items-center justify-center ml-1">
              <Text className="text-[10px] text-white font-bold">
                {selectedCategories.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {selectedCategories.map((cat) => (
          <View
            key={cat}
            className="bg-black px-3 py-1 rounded-[8px] flex-row items-center space-x-1"
          >
            <Text className="text-xs text-white">{cat}</Text>
            <TouchableOpacity
              onPress={() =>
                setSelectedCategories((prev) => prev.filter((c) => c !== cat))
              }
            >
              <View className="w-4 h-4 border ml-1 border-white rounded-full items-center justify-center">
                <Ionicons name="close" size={10} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Modal
        transparent
        visible={cityModalVisible}
        animationType="fade"
        onRequestClose={() => setCityModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/30 justify-center items-center px-10"
          onPress={() => setCityModalVisible(false)}
        >
          <View className="bg-white rounded-xl w-full p-4">
            <Text className="text-lg font-semibold mb-3">Выберите город</Text>
            {cities.map((c) => (
              <TouchableOpacity
                key={c}
                className="py-2"
                onPress={() => {
                  setCity(c);
                  setCityModalVisible(false);
                }}
              >
                <Text className="text-base text-black">{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      <Modal
        transparent
        visible={filterModalVisible}
        animationType="fade"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/30 justify-center items-center px-6"
          onPress={() => setFilterModalVisible(false)}
        >
          <View className="bg-white rounded-xl w-full p-4 space-y-4">
            <Text className="text-lg font-semibold">Фильтры</Text>

            <View>
              <Text className="text-sm font-medium mt-2 mb-2">Категории работ</Text>
              <TextInput
                value={categorySearch}
                onChangeText={setCategorySearch}
                placeholder="Поиск категории..."
                placeholderTextColor="#999"
                className="border border-gray-300 rounded-full px-3 py-1 mb-1 text-m text-black"
              />
              <View className="flex-row flex-wrap">
                {filteredCategories.map((cat) => {
                  const selected = selectedCategories.includes(cat);
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => toggleCategory(cat)}
                      className={`px-3 py-1 rounded-full border mr-2 mt-2 ${
                        selected ? "bg-black" : "bg-white"
                      }`}
                    >
                      <Text className={`text-xs ${selected ? "text-white" : "text-black"}`}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                {filteredCategories.length === 0 && (
                  <Text className="text-xs text-gray-400 italic mt-2">
                    Ничего не найдено
                  </Text>
                )}
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}