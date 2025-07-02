import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { BACKEND_URL } from "../../utils/config";
import Logo from "../../assets/logo.svg";
import NoticeIcon from "../../assets/Notice-icon.svg";
import ProfileIcon from "../../assets/Profile-icon.svg";
import ArrowIcon from "../../assets/Arrow-icon.svg";
import IconTeam from "../../assets/Inbox.png";
import { useAuthStore } from "../../store/authStore";
import ImageView from "react-native-image-viewing";

export default function ProjectDetailScreen() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const token = useAuthStore((state) => state.token);
  const { projectId } = params;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState(null);
  const [tab, setTab] = useState("description");
  const [contractors, setContractors] = useState([]);
  const [contractorLoading, setContractorLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [visibleImage, setVisibleImage] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [modalImages, setModalImages] = useState([]);

  const [confirmModal, setConfirmModal] = useState(false);

  // Универсальный геттер ссылки на изображение
const getImageUri = (img) => {
  if (!img) return "";
  let candidate =
    typeof img === "string"
      ? img
      : img.url || img.imageUrl || img.path;

  if (!candidate) return "";

  if (candidate.startsWith("http")) {
    return candidate; // уже полный URL
  }

  return `${BACKEND_URL}${candidate}`;
};




  // Получение проекта
  const fetchProject = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/project/${projectId}`);

      const data = await res.json();
console.log("📷 project.sourceImg:", data.sourceImg);
console.log("📷 project.refImg:", data.refImg);
setProject(data);

      setProject(data);
      setLoading(false);
    } catch (err) {
      console.error("Ошибка загрузки проекта:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);


  const approveContractor = async () => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/project-contractor/approve-contractor?ptcId=${activeTag?.contractor?.id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.ok) {
      Alert.alert("Успешно", "Подрядчик утвержден!");
      setActiveTag(null);
      fetchRequests(); // Перезагрузить заявки
    } else {
      Alert.alert("Ошибка", "Не удалось подтвердить подрядчика.");
    }
  } catch (error) {
    console.error("Ошибка утверждения подрядчика:", error);
    Alert.alert("Ошибка", "Произошла ошибка при утверждении.");
  }
};


  // Получение подрядчиков
  useEffect(() => {
    const fetchContractors = async () => {
      if (activeTag && activeTag.mode === "contractors" && tab === "search") {
        setContractorLoading(true);
        try {
          const res = await fetch(
            `${BACKEND_URL}/api/contractor/filter?projectTagIds=${activeTag.projectTagId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const data = await res.json();
          setContractors(data);
        } catch (err) {
          console.error("Ошибка загрузки подрядчиков:", err);
        } finally {
          setContractorLoading(false);
        }
      }
    };
    fetchContractors();
  }, [activeTag, tab]);

  // Получение заявок
  const fetchRequests = async () => {
    if (activeTag && activeTag.mode === "contractors" && tab === "requests") {
      setRequestsLoading(true);
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/project-contractor/get/action?ptId=${activeTag.projectTagId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setRequests(data);
      } catch (error) {
        console.error("Ошибка загрузки заявок:", error);
      } finally {
        setRequestsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [activeTag, tab]);

  const statusName = (status) => {
    switch (status) {
      case "PENDING":
        return "На рассмотрении";
      case "APPROVED":
        return "Одобрено";
      case "REJECTED":
        return "Отклонено";
      case "WAITING_USER":
        return "Ожидает подтверждения";
      case "INVITE":
        return "Приглашено";
      default:
        return status;
    }
  };

 const openImageView = (images, index) => {
  const formatted = images.map((img) => ({ uri: getImageUri(img) }));
  setModalImages(formatted);
  setImageIndex(index);
  setVisibleImage(true);
};


  const closeImageView = () => setVisibleImage(false);

  if (loading || !project) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-[#F4F4F9] rounded-b-3xl px-4 pt-20 pb-4 absolute top-0 left-0 right-0 z-10">
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity className="p-1" onPress={() => navigation.goBack()}>
            <ArrowIcon size={36} />
          </TouchableOpacity>
          <View className="absolute left-0 right-0 items-center z-0">
            <Logo width={130} height={20} />
          </View>
          <View className="flex-row space-x-2">
            <TouchableOpacity onPress={() => navigation.navigate("ClientNotification")} className="p-1">
              <NoticeIcon size={36} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("UserProfile")} className="p-1">
              <ProfileIcon size={36} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 pt-40 pb-24">
        <View className="px-4">
          <Text className="text-sm text-gray-500 mb-1">Название работы</Text>
          <Text className="text-lg font-semibold mb-4">{project.title}</Text>

          <Text className="text-sm text-gray-500 mb-1">Описание работы</Text>
          <Text className="text-base text-gray-700 mb-4">{project.description}</Text>

          {/* Photos */}
          <Text className="text-sm text-gray-500 mb-2">Объект ремонта сейчас</Text>
          <ScrollView horizontal className="mb-4">
  {project.sourceImg?.map((img, i) => (
    <TouchableOpacity key={i} onPress={() => openImageView(project.sourceImg, i)}>
      <Image
        source={{ uri: getImageUri(img) }}
        className="w-24 h-24 mr-2 rounded-md"
      />
    </TouchableOpacity>
  ))}
</ScrollView>

          <Text className="text-sm text-gray-500 mb-2">Примеры желаемого объекта</Text>
          <ScrollView horizontal className="mb-4">
  {project.refImg?.map((img, i) => (
    <TouchableOpacity key={i} onPress={() => openImageView(project.refImg, i)}>
      <Image
        source={{ uri: getImageUri(img) }}
        className="w-24 h-24 mr-2 rounded-md"
      />
    </TouchableOpacity>
  ))}
</ScrollView>

          <ImageView
            images={modalImages}
            imageIndex={imageIndex}
            isVisible={visibleImage}
            onClose={closeImageView}
          />

          {/* Categories */}
          <Text className="text-sm text-gray-500 mb-2">Категории работ</Text>
          {project.tags.map((tag, index) => (
            <View key={index} className="p-4 bg-white rounded-xl border border-gray-200 mb-3">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-base font-semibold">{tag.category.action}</Text>
                {tag.hasContractor && (
                  <View className="bg-green-500 px-2 py-1 rounded-full">
                    <Text className="text-white text-xs">Назначен</Text>
                  </View>
                )}
              </View>
              <View className="flex-row space-x-2">
                <TouchableOpacity
                  onPress={() => {
                    setActiveTag({ ...tag, mode: "description" });
                    setTab("description");
                  }}
                  className="flex-1 py-2 border border-gray-300 rounded-full items-center"
                >
                  <Text className="text-sm">Подробнее</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setActiveTag({ ...tag, mode: "contractors" });
                    setTab("search");
                  }}
                  className="flex-1 py-2 bg-[#7B04DF20] rounded-full items-center"
                >
                  <Text className="text-sm font-semibold">Исполнители</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {activeTag?.hasContractor ? (
        <Modal visible={!!activeTag} transparent animationType="fade">
          <View className="flex-1 bg-black/30 justify-center items-center px-4">
            <View className="bg-white rounded-2xl w-full max-h-[80%] p-6">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-semibold">
                  Подрядчик: {activeTag.contractor.accountName}
                </Text>
                <TouchableOpacity onPress={() => setActiveTag(null)}>
                  <Ionicons name="close" size={22} color="black" />
                </TouchableOpacity>
              </View>

              <View className="flex-row mb-4">
                <Image
                  source={
    activeTag.contractor.profileImg
      ? { uri: getImageUri(activeTag.contractor.profileImg) }
      : IconTeam
  }
                  className="w-28 h-28 rounded-md mr-4"
                />
                <View>
                  <Text className="text-sm text-gray-500 mb-2">Описание</Text>
                  <Text className="text-base text-black mb-4">
                    {activeTag.contractor.fullDescription || "Нет описания"}
                  </Text>

                  <Text className="text-sm text-gray-500 mb-2">Контакт</Text>
                  <Text className="text-base text-black">
                    {activeTag.contractor.phone}
                  </Text>
                </View>
              </View>

              {/* <TouchableOpacity
                onPress={() => {
                  navigation.navigate("TeamDetail", {
                    teamId: activeTag.contractor.id,
                  });
                }}
                className="mt-4 py-3 bg-gray-200 rounded-full items-center"
              >
                <Text className="text-black text-sm font-semibold">
                  Перейти к подробной информации
                </Text>
              </TouchableOpacity> */}

              <TouchableOpacity
                onPress={() => {
                  // Здесь добавьте логику для отправки сообщения
                  console.log("Сообщение отправлено!");
                }}
                className="mt-4 py-3 bg-black rounded-full items-center"
              >
                <Text className="text-white text-sm font-semibold">
                  Отправить сообщение
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      ) : (
        <Modal visible={!!activeTag} transparent>
          <View className="flex-1 bg-black/30 justify-center items-center px-4">
            <View className="bg-white rounded-2xl w-full max-h-[80%] p-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-semibold">
                  {activeTag?.category?.action}
                </Text>
                <TouchableOpacity onPress={() => setActiveTag(null)}>
                  <Ionicons name="close" size={22} color="black" />
                </TouchableOpacity>
              </View>

              {activeTag?.mode === "description" ? (
                <ScrollView>
                  <Text className="text-sm text-gray-500 mb-2">Описание</Text>
                  <Text className="text-base text-black mb-4">
                    {activeTag?.category_description || "Нет описания"}
                  </Text>

                  <Text className="text-sm text-gray-500 mb-2">Материалы</Text>
                  <View className="flex-row flex-wrap">
                    {(activeTag?.materials || []).map((mat, i) => (
                      <View
                        key={i}
                        className="bg-yellow-200 px-3 py-1 rounded-full mr-2 mt-2"
                      >
                        <Text className="text-sm text-black">{mat}</Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              ) : (
                <>
                  <View className="flex-row mb-4 rounded-xl overflow-hidden border">
                    <TouchableOpacity
                      onPress={() => setTab("search")}
                      className={`flex-1 py-2 items-center ${
                        tab === "search" ? "bg-black" : "bg-white"
                      }`}
                    >
                      <Text
                        className={`${
                          tab === "search"
                            ? "text-white font-semibold"
                            : "text-black"
                        }`}
                      >
                        Поиск
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setTab("requests")}
                      className={`flex-1 py-2 items-center ${
                        tab === "requests" ? "bg-black" : "bg-white"
                      }`}
                    >
                      <Text
                        className={`${
                          tab === "requests"
                            ? "text-white font-semibold"
                            : "text-black"
                        }`}
                      >
                        Заявки
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {tab === "search" && (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      {contractorLoading ? (
                        <ActivityIndicator
                          className="mt-4 ml-2"
                          size="small"
                          color="black"
                        />
                      ) : (
                        contractors.map((team) => {
                          const hasImage = Boolean(team.previewImage);
                          const imageUri = getImageUri(team.previewImage);

                          return (
                            <View
                              key={team.id}
                              className="w-48 bg-[#F4F4F9] rounded-xl mr-4 p-3"
                            >
                              <TouchableOpacity
                                className="relative w-full h-28 justify-center items-center"
                                onPress={() => {
                                  setActiveTag(null);
                                  navigation.navigate("TeamDetail", {
                                    teamId: team.id,
                                  });
                                }}
                              >
                                {hasImage ? (
                                  <Image
                                    source={{ uri: imageUri }}
                                    className="w-full h-28 rounded-md"
                                  />
                                ) : (
                                  <View className="w-full h-28 bg-gray-200 justify-center items-center rounded-md">
                                    <Image
                                      source={IconTeam}
                                      className="w-12 h-12 opacity-50"
                                    />
                                  </View>
                                )}
                              </TouchableOpacity>

                              <View className="pt-2">
                                <Text
                                  className="font-semibold text-sm"
                                  numberOfLines={2}
                                >
                                  {team.fullName || team.account_name}
                                </Text>
                                <Text
                                  className="text-xs text-gray-500 mb-2"
                                  numberOfLines={2}
                                >
                                  {team.shortDescription ||
                                    "Описание отсутствует"}
                                </Text>
                              </View>

                              <TouchableOpacity
                                onPress={async () => {
                                  try {
                                    console.log(activeTag.projectTagId);
                                    console.log(team.id);

                                    const res = await fetch(
                                      `${BACKEND_URL}/api/project-contractor/invite?projectId=${activeTag.projectTagId}&contractorId=${team.id}`,
                                      {
                                        method: "POST",
                                        headers: {
                                          Authorization: `Bearer ${token}`,
                                        },
                                      }
                                    );
                                    const resData = await res.json();
                                    console.log(
                                      "Response from invite request:",
                                      resData
                                    );
                                   if (res.ok) {
  alert("Заявка успешно отправлена!");
  setActiveTag(null);
  await fetchProject();
} else {
  alert("Ошибка при отправке заявки.");
}

                                  } catch (error) {
                                    console.error(
                                      "Ошибка отправки заявки:",
                                      error
                                    );
                                    alert("Ошибка сети при отправке заявки.");
                                  }
                                }}
                                className="mt-2 py-2 bg-black rounded-full items-center"
                              >
                                <Text className="text-white text-sm font-semibold">
                                  Отправить заявку
                                </Text>
                              </TouchableOpacity>
                            </View>
                          );
                        })
                      )}
                    </ScrollView>
                  )}

                  {tab === "requests" && (
                    <ScrollView className="space-y-6">
                      {requestsLoading ? (
                        <ActivityIndicator
                          className="mt-4"
                          size="small"
                          color="black"
                        />
                      ) : requests.length === 0 ? (
                        <View className="flex-1 justify-center items-center mt-8">
                          <Text className="text-gray-400">Нет заявок</Text>
                        </View>
                      ) : (
                        Object.entries(
                          requests.reduce((acc, req) => {
                            // Группируем заявки по статусам
                            if (!acc[req.status]) acc[req.status] = [];
                            acc[req.status].push(req);
                            return acc;
                          }, {})
                        ).map(([status, items]) => (
                          <View key={status}>
                            <Text className="text-base font-bold text-black mb-2">
                              {statusName(status)} {/* Подписываем статус */}
                            </Text>
                            <ScrollView
                              horizontal
                              showsHorizontalScrollIndicator={false}
                            >
                              {items.map((req) => {
                                const hasImage =
                                  req.contractor?.profileImg ||
                                  req.contractor?.firstImage;
                               const imageUri = getImageUri(
  req.contractor?.profileImg || req.contractor?.firstImage
);


                                return (
                                  <View
                                    key={req.id}
                                    className="w-48 bg-[#F4F4F9]rounded-xl mr-4 p-3"
                                  >
                                    <TouchableOpacity
                                      className="relative w-full h-28 justify-center items-center"
                                      onPress={() => {
                                        setActiveTag(null);
                                        navigation.navigate("TeamDetail", {
                                          teamId: req.contractor.id,
                                        });
                                      }}
                                    >
                                      {imageUri ? (
                                        <Image
                                          source={{ uri: imageUri }}
                                          className="w-full h-28 rounded-md"
                                        />
                                      ) : (
                                        <View className="w-full h-28 bg-gray-200 justify-center items-center rounded-md">
                                          <Image
                                            source={IconTeam}
                                            className="w-12 h-12 opacity-50"
                                          />
                                        </View>
                                      )}
                                    </TouchableOpacity>

                                    <View className="pt-2">
                                      <Text
                                        className="font-semibold text-sm"
                                        numberOfLines={2}
                                      >
                                        {req.contractor.userId.accountName ||
                                          "Без имени"}
                                      </Text>
                                      <Text
                                        className="text-xs text-gray-400 mt-1"
                                        numberOfLines={1}
                                      >
                                        {req.contractor.shortDescription ||
                                          "Без описания"}
                                      </Text>
                                    </View>

                                    {req.status === "WAITING_USER" && (
                                      <TouchableOpacity
                                        onPress={async () => {
                                          try {
                                            const res = await fetch(
                                              `${BACKEND_URL}/api/project-contractor/approve-contractor?ptcId=${req.id}`,
                                              {
                                                method: "POST",
                                                headers: {
                                                  Authorization: `Bearer ${token}`,
                                                },
                                              }
                                            );
                                            if (res.ok) {
  alert("Заявка успешно подтверждена!");
  // Обновление состояния или перезагрузка данных
  setRequestsLoading(true);
  fetchRequests(); // Обновление данных заявок
} else {
  alert("Ошибка при подтверждении заявки.");
}
                                          } catch (error) {
                                            console.error(
                                              "Ошибка при подтверждении заявки:",
                                              error
                                            );
                                            alert(
                                              "Ошибка сети при подтверждении заявки."
                                            );
                                          }
                                        }}
                                        className="mt-2 py-2 bg-green-500 rounded-full items-center"
                                      >
                                        <Text className="text-white text-sm font-semibold">
                                          Подтвердить
                                        </Text>
                                      </TouchableOpacity>
                                    )}
                                  </View>
                                );
                              })}
                            </ScrollView>
                          </View>
                        ))
                      )}
                    </ScrollView>
                  )}
                </>
              )}
            </View>
          </View>
        </Modal>
      )}

      <Modal visible={confirmModal} transparent animationType="fade">
        <View className="flex-1 bg-black/30 justify-center items-center px-8">
          <View className="bg-white rounded-xl p-6 w-full">
            <Text className="text-lg font-semibold text-center mb-6">
              Подтвердите подрядчика
            </Text>
            <Text className="text-center mb-6">
              Вы хотите подтвердить подрядчика {activeTag?.category?.action}?
            </Text>
            <View className="flex-row space-x-4">
              <TouchableOpacity
                className="flex-1 py-3 bg-gray-300 rounded-xl items-center"
                onPress={() => setConfirmModal(false)}
              >
                <Text className="text-black">Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 py-3 bg-black rounded-xl items-center"
                onPress={approveContractor}
              >
                <Text className="text-white">Подтвердить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
    
  );
}
