import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../../store/authStore";
import { BACKEND_URL } from "../../utils/config";

export default function EditContractorProfileScreen() {
  const navigation = useNavigation();
  const token = useAuthStore((state) => state.token);

  const [accountName, setAccountName] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [gallery, setGallery] = useState([]);
  const [logo, setLogo] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [allServerCategories, setAllServerCategories] = useState([]);


  const filteredCategories = searchText
  ? allServerCategories.filter((cat) =>
      cat.action.toLowerCase().includes(searchText.toLowerCase())
    )
  : allServerCategories.slice(0, 6);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, infoRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/work-category/all`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BACKEND_URL}/api/contractor/get-info`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
  
        const [categoriesData, infoData] = await Promise.all([
          categoriesRes.json(),
          infoRes.json(),
        ]);
  
        setAllServerCategories(categoriesData);
  
        setAccountName(infoData.user_data.accountName || "");
        setShortDesc(infoData.shortDescription || "");
        setFullDesc(infoData.fullDescription || "");
  
        setCategories(infoData.tags || []);

  
        const galleryImages = infoData.gallery?.map((img) => ({
          id: img.id,
          uri: `${BACKEND_URL}${img.img}`,
          isNew: false,
        })) || [];
        setGallery(galleryImages);
  
        if (infoData.profileImg) {
          setLogo({ uri: `${BACKEND_URL}${infoData.profileImg}` });
        }
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err);
        Alert.alert("Ошибка", "Не удалось загрузить данные подрядчика или категории");
      }
    };
  
    fetchData();
  }, []);
  
  

  const pickImage = async (callback) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const image = result.assets[0];
      callback(image);
    }
  };

  const deleteImage = async (imgUri, index, id) => {
    try {
      if (id) {
        await fetch(`${BACKEND_URL}/api/contractor/gallery/delete/${id}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setGallery((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Ошибка при удалении изображения:", err);
      Alert.alert("Ошибка", "Не удалось удалить фотографию");
    }
  };

  const getCategoryIdByName = (name) => {
    const map = {
      Электрика: 1,
      Сантехника: 2,
      Отделка: 3,
      Демонтаж: 4,
      Плитка: 5,
      Покраска: 6,
      "Стяжка пола": 7,
      Гипсокартон: 8,
      "Двери и окна": 9,
      Обои: 10,
    };
    return map[name] || null;
  };

  const [logoModalVisible, setLogoModalVisible] = useState(false);

const handleLogoPick = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
  });

  if (!result.canceled) {
    const image = result.assets[0];
    setLogo(image);
    setLogoModalVisible(false);
  }
};

const removeLogo = () => {
  setLogo(null);
  setLogoModalVisible(false);
};

  const handleSave = async () => {
    try {
      if (logo) {
        const logoForm = new FormData();
        logoForm.append("file", {
          uri: logo.uri,
          name: logo.fileName || "logo.jpg",
          type: "image/jpeg",
        });

        await fetch(`${BACKEND_URL}/api/profile/upload-img`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: logoForm,
        });
      }

      const newGallery = gallery.filter((img) => img.isNew);
      if (newGallery.length > 0) {
        const galleryForm = new FormData();
        newGallery.forEach((img, index) => {
          galleryForm.append("files", {
            uri: img.uri,
            name: img.fileName || `gallery_${index}.jpg`,
            type: "image/jpeg",
          });
        });

        await fetch(`${BACKEND_URL}/api/contractor/gallery/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: galleryForm,
        });
      }

      const tags = categories.map((cat) => ({
        workCategory: { id: cat.id }
      }));
      
      const res = await fetch(`${BACKEND_URL}/api/contractor/update-info`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          accountName,
          shortDescription: shortDesc,
          fullDescription: fullDesc,
          locationId: null,
          tags,
        }),
      });
      

      if (!res.ok) throw new Error("Ошибка обновления");

      Alert.alert("Успешно", "Профиль подрядчика обновлён");
      navigation.goBack();
    } catch (err) {
      console.error("Ошибка:", err);
      Alert.alert("Ошибка", "Не удалось сохранить изменения");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-16" contentContainerStyle={{ paddingBottom: 100 }}>
      <Text className="text-2xl font-bold mb-6">Редактирование профиля</Text>

      {/* Логотип */}
      <TouchableOpacity
  onPress={() => setLogoModalVisible(true)}
  className="w-20 h-20 bg-gray-200 rounded-[12px] justify-center items-center relative mb-6"
>
  {logo ? (
    <Image source={{ uri: logo.uri }} className="w-20 h-20 rounded-[12px]" />
  ) : (
    <Ionicons name="person-outline" size={32} color="#999" />
  )}
  <View className="absolute bottom-0 right-0 bg-white rounded-full p-1">
    <Ionicons name="create-outline" size={14} color="black" />
  </View>
</TouchableOpacity>

<Modal visible={logoModalVisible} transparent animationType="fade">
  <TouchableOpacity
    className="flex-1 bg-black/50 justify-center items-center"
    activeOpacity={1}
    onPressOut={() => setLogoModalVisible(false)}
  >
    <View className="bg-white w-[80%] rounded-xl p-6 space-y-4">
      <Text className="text-lg font-semibold text-center">Выберите действие</Text>
      <TouchableOpacity
        onPress={handleLogoPick}
        className="bg-black rounded-xl py-3 items-center"
      >
        <Text className="text-white font-medium">Выбрать из галереи</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={removeLogo}
        className="bg-gray-200 rounded-xl py-3 items-center"
      >
        <Text className="text-black font-medium">Удалить фото</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setLogoModalVisible(false)}
        className="py-2 items-center"
      >
        <Text className="text-gray-500">Отмена</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
</Modal>

      {/* Основная информация */}
      <Text className="text-xs text-gray-400 mb-1">Имя аккаунта</Text>
      <TextInput
        value={accountName}
        onChangeText={setAccountName}
        className="border border-gray-300 px-3 py-2 rounded-lg mb-4"
      />

      <Text className="text-xs text-gray-400 mb-1">Краткое описание</Text>
      <TextInput
        value={shortDesc}
        onChangeText={setShortDesc}
        className="border border-gray-300 px-3 py-2 rounded-lg mb-4"
      />

      <Text className="text-xs text-gray-400 mb-1">Полное описание</Text>
      <TextInput
        value={fullDesc}
        onChangeText={setFullDesc}
        className="border border-gray-300 px-3 py-2 rounded-lg mb-6"
        multiline
      />

      {/* Галерея */}
      <Text className="text-xs text-gray-400 mb-2">Галерея фотографий</Text>
      <View className="flex-row flex-wrap mb-4">
        {gallery.map((img, idx) => (
          <View key={idx} className="relative mr-3 mb-3">
            <Image source={{ uri: img.uri }} className="w-24 h-24 rounded-md" />
            <TouchableOpacity
              onPress={() => deleteImage(img.uri, idx, img.id)}
              className="absolute -top-2 -right-2 bg-white rounded-full p-1"
            >
              <Ionicons name="close" size={16} color="black" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          onPress={() => pickImage((img) => setGallery([...gallery, { ...img, isNew: true }]))}
          className="w-24 h-24 border border-dashed border-black rounded-md justify-center items-center"
        >
          <Ionicons name="add" size={24} color="black" />
          <Text className="text-xs text-black mt-1">Добавить фото</Text>
        </TouchableOpacity>
      </View>

      {/* Категории */}
      <Text className="text-xs text-gray-400 mb-2">Категории работ</Text>
      <View className="flex-row flex-wrap mb-4">
      {categories.map((cat, idx) => (
  <View
    key={cat.id || idx}
    className="bg-black px-3 py-1 rounded-full mr-2 mb-2 flex-row items-center"
  >
    <Text className="text-white text-sm mr-2">{cat.action}</Text>
    <TouchableOpacity
      onPress={() => setCategories(categories.filter((_, i) => i !== idx))}
    >
      <Ionicons name="close" size={14} color="white" />
    </TouchableOpacity>
  </View>
))}

      </View>
      <TouchableOpacity
        onPress={() => setCategoryModalVisible(true)}
        className="flex-row items-center bg-black px-4 py-2 rounded-lg w-fit self-start"
      >
        <Ionicons name="add" size={16} color="white" />
        <Text className="text-white ml-2 font-medium">Добавить категорию</Text>
      </TouchableOpacity>

      {/* Сохранить */}
      <TouchableOpacity
        onPress={handleSave}
        className="bg-black mt-8 py-4 rounded-xl items-center"
      >
        <Text className="text-white text-base font-semibold">Сохранить изменения</Text>
      </TouchableOpacity>

      {/* Модалка выбора категории */}
      <Modal visible={categoryModalVisible} transparent animationType="fade">
        <TouchableOpacity
          activeOpacity={1}
          onPressOut={() => setCategoryModalVisible(false)}
          className="flex-1 bg-black/50 justify-center items-center px-6"
        >
          <View className="bg-white w-full max-w-[360px] rounded-2xl p-6 space-y-4">
            <Text className="text-xl font-semibold text-center">Выберите категорию</Text>

            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Поиск..."
              placeholderTextColor="#999"
              className="border border-gray-300 rounded-xl px-4 py-2"
            />

            <ScrollView className="max-h-[200px] mt-2">
              <View className="flex-row flex-wrap">
              {filteredCategories.map((cat) => (
  <TouchableOpacity
    key={cat.id}
    onPress={() => {
      if (!categories.some((c) => c.id === cat.id)) {
        setCategories([...categories, cat]);
      }
    }}
    className="bg-black px-3 py-1 rounded-full mr-2 mb-2"
  >
    <Text className="text-white text-sm">{cat.action}</Text>
  </TouchableOpacity>
))}


              </View>
            </ScrollView>

            <TouchableOpacity
              onPress={() => setCategoryModalVisible(false)}
              className="bg-gray-200 py-2 rounded-xl items-center"
            >
              <Text className="text-black font-medium">Закрыть</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}


  