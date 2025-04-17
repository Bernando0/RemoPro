// screens/client/TeamDetailScreen.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import { useRoute, useNavigation } from "@react-navigation/native";
import { teamDetails } from "../../mock/teamDetailMockData";
import ImageView from "react-native-image-viewing";
import { Image as RNImage } from "react-native";

const { width } = Dimensions.get("window");
const imageHeight = width * 0.75;

export default function TeamDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { teamId } = route.params;
  const team = teamDetails[teamId];

  const [modalVisible, setModalVisible] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [modalImages, setModalImages] = useState([]);

  if (!team) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500">Команда не найдена</Text>
      </View>
    );
  }

  const openModal = (images, index) => {
    const formatted = images.map((img) => ({ uri: RNImage.resolveAssetSource(img).uri }));
    setModalImages(formatted);
    setModalIndex(index);
    setModalVisible(true);
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Header Image Carousel */}
        <View className="relative">
        <Swiper
  showsPagination={true}
  height={220}
  loop={false}
  paginationStyle={{ bottom: 1 }}
  dot={
    <View
      style={{
        backgroundColor: "rgba(255,255,255,0.5)",
        width: 6,
        height: 6,
        borderRadius: 3,
        marginHorizontal: 3,
        marginBottom:4
      }}
    />
  }
  activeDot={
    <View
      style={{
        backgroundColor: "#fff",
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 3,
        marginBottom:4
      }}
    />
  }
>
  {team.images.map((img, index) => (
    <TouchableOpacity
      key={`carousel-${index}`}
      activeOpacity={0.9}
      onPress={() => openModal(team.images, index)}
    >
      <Image source={img} className="w-full h-64" />
    </TouchableOpacity>
  ))}
</Swiper>


          <View className="absolute top-20 left-4 right-4 flex-row justify-between items-center">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={36} color="white" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="heart-outline" size={36} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Card */}
        <View className="px-4 pt-4">
          <View className="flex-row items-center mb-2 space-x-2">
          <Image source={team.logo} className="w-16 h-16 rounded-md" />
          <View>
          <View className="flex-row items-center space-x-2">
            <Text className="font-semibold text-lg flex-shrink">{team.name}</Text>
            <Ionicons name="star" className="ml-2" size={16} color="black" />
            <Text className="text-base">{team.rating}</Text>
            
          </View>
          <Text className="text-s text-gray-400">
              ({team.reviews.length} отзывов)
            </Text>
            </View>
          </View>
          

          <Text className="text-base text-gray-700 mb-2 leading-5">
            {team.description}
          </Text>

          <View className="flex-row flex-wrap gap-2 mb-4">
            {team.tags.map((tag, index) => (
              <View key={index} className="bg-yellow-200 px-3 py-1 rounded-full">
                <Text className="text-sm text-gray-800">{tag}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity className="bg-black py-3 rounded-xl mb-6">
            <Text className="text-white text-center font-semibold text-base">
              Отправить сообщение
            </Text>
          </TouchableOpacity>

          <Text className="text-lg font-semibold mb-3">Отзывы</Text>
          {team.reviews.map((review) => (
            <View key={review.id} className="bg-gray-100 p-4 rounded-xl mb-4">
              <View className="flex-row items-center space-x-2 mb-2">
                <Image source={review.avatar} className="w-16 h-16 rounded-[8px]" />
                <View className="ml-4">
                  <Text className="text-xl font-semibold">
                    {review.name} ★ {review.rating}.0
                  </Text>
                  <Text className="text-l text-gray-500">{review.role}</Text>
                </View>
              </View>
              <Text className="text-m text-gray-800 mb-3 leading-5">
                {review.text}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="space-x-3"
              >
                {review.photos.map((photo, i) => (
                  <TouchableOpacity
                  key={`modal-${i}-${modalImages.length}`}
                    onPress={() => openModal(review.photos, i)}
                    style={{ marginRight: 10 }}
                  >
                    <Image
                      source={photo}
                      className="w-24 h-24 rounded-md"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modal for Images */}
      <ImageView
        images={modalImages}
        imageIndex={modalIndex}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
      />
    </View>
  );
}