// components/TeamCard.jsx
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function TeamCard({ team }) {
  const navigation = useNavigation();
  const visibleTags = team.tags.slice(0, 2);
  const hiddenTagsCount = team.tags.length - 2;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("TeamDetail", { teamId: team.id })}
      className="w-[48%] bg-yellow-50 rounded-xl mb-4 overflow-hidden"
    >
      <View className="relative w-full h-28">
        <Image source={team.image} className="w-full h-28" />
        <TouchableOpacity
          onPress={() => {
            team.liked = !team.liked; // временно
          }}
          className="absolute top-1 right-1 p-1.5 rounded-full"
        >
          <Ionicons
            name={team.liked ? "heart" : "heart-outline"}
            size={36}
            color={team.liked ? "#facc15" : "white"}
          />
        </TouchableOpacity>
      </View>

      <View className="p-3 space-y-1">
        <View className="flex-row items-center space-x-1">
          <Ionicons name="star" size={12} color="black" />
          <Text className="text-xs text-gray-600">
            {team.rating} ({team.reviews} отзывов)
          </Text>
        </View>

        <Text className="font-semibold text-sm" numberOfLines={2}>
          {team.title}
        </Text>

        <View className="flex-row flex-wrap items-center">
          {visibleTags.map((tag, i) => (
            <View
              key={i}
              className="bg-yellow-200 px-2 py-0.5 rounded-full mr-2 mt-2"
            >
              <Text className="text-xs text-gray-800">{tag}</Text>
            </View>
          ))}
          {hiddenTagsCount > 0 && (
            <View className="bg-yellow-200 px-2 py-0.5 rounded-full mr-2 mt-2">
              <Text className="text-xs text-gray-800">+{hiddenTagsCount}</Text>
            </View>
          )}
        </View>

        <View className="flex-row items-center mt-1">
          <Ionicons name="location-outline" size={14} color="#999" />
          <Text className="text-xs text-gray-600 ml-1">{team.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
