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
import { useAuthStore } from "../../store/authStore";

export default function ProjectDetailScreen() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const token = useAuthStore((state) => state.token);
  const { projectId } = params;

  const [project, setProject] = useState(null);
  const [myActions, setMyActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [pendingTagId, setPendingTagId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, actionsRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/project/${projectId}`),
          fetch(`${BACKEND_URL}/api/project-contractor/get/my/action?pId=${projectId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const projectData = await projRes.json();
        const actionsData = await actionsRes.json();
        console.log("Fetched actions data:", actionsData);

        setProject(projectData);
        setMyActions(actionsData);
      } catch (err) {
        console.error("Ошибка загрузки проекта:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [projectId]);

  const getActionForCategory = (catId) => {
    return myActions.find((action) => action.projectTag.category.id === catId);
  };

  const sendRequest = async (projectTagId) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/project-contractor/bid?projectTagId=${projectTagId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        Alert.alert("Успешно", "Заявка отправлена!");

        const updatedActionsRes = await fetch(`${BACKEND_URL}/api/project-contractor/get/my/action?pId=${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updatedActions = await updatedActionsRes.json();
        setMyActions(updatedActions);
      } else {
        Alert.alert("Ошибка", "Не удалось отправить заявку.");
      }
    } catch (err) {
      console.error("Ошибка отправки заявки:", err);
      Alert.alert("Ошибка сети", "Не удалось отправить заявку.");
    } finally {
      setConfirmModal(false);
    }
  };

  if (loading || !project) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Шапка */}
      <View className="bg-yellow-300 rounded-b-3xl px-4 pt-20 pb-4 absolute top-0 left-0 right-0 z-10">
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity className="p-1" onPress={() => navigation.goBack()}>
            <ArrowIcon size={36} />
          </TouchableOpacity>
          <View className="absolute left-0 right-0 items-center z-0">
            <Logo width={130} height={20} />
          </View>
          <View className="flex-row space-x-2">
            <TouchableOpacity className="p-1">
              <NoticeIcon size={36} />
            </TouchableOpacity>
            <TouchableOpacity className="p-1">
              <ProfileIcon size={36} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 pt-40 pb-24">
        <View className="px-4">
          <View className="flex-row items-center mb-6">
            <Image
              source={{ uri: `${BACKEND_URL}${project.client_img}` }}
              className="w-12 h-12 rounded-full mr-3"
            />
            <View>
              <Text className="text-sm font-semibold text-black">{project.client.accountName}</Text>
              <Text className="text-xs text-gray-500">Владелец проекта</Text>
            </View>
          </View>

          <Text className="text-sm text-gray-500 mb-1">Название работы</Text>
          <Text className="text-lg font-semibold mb-4">{project.title}</Text>

          <Text className="text-sm text-gray-500 mb-1">Описание работы</Text>
          <Text className="text-base text-gray-700 mb-4">{project.description}</Text>

          <Text className="text-sm text-gray-500 mb-2">Объект ремонта сейчас</Text>
          <ScrollView horizontal className="mb-4">
            {project.sourceImg.map((img, i) => (
              <Image
                key={i}
                source={{ uri: `${BACKEND_URL}${img}` }}
                className="w-24 h-24 mr-2 rounded-md"
              />
            ))}
          </ScrollView>

          <Text className="text-sm text-gray-500 mb-2">Примеры желаемого объекта</Text>
          <ScrollView horizontal className="mb-4">
            {project.refImg.map((img, i) => (
              <Image
                key={i}
                source={{ uri: `${BACKEND_URL}${img}` }}
                className="w-24 h-24 mr-2 rounded-md"
              />
            ))}
          </ScrollView>

          <Text className="text-sm text-gray-500 mb-2">Категории работ</Text>
          {project.tags.map((tag, idx) => {
            const action = getActionForCategory(tag.category.categoryId);
            let buttonText = "Отправить заявку";
            let disabled = false;
            let buttonStyle = "bg-black";

            if (action) {
              if (action.status === "INVITE") {
                buttonText = "Ответить на запрос";
              } else if (action.status === "WAITING_USER") {
                buttonText = "Отправлена заявка";
                buttonStyle = "bg-gray-300";
                disabled = true;
              }
            }

            return (
              <View key={idx} className="p-4 bg-white rounded-xl border border-gray-200 mb-4">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-base font-semibold text-black">
                    {tag.category.action}
                  </Text>
                  <View className="flex-row space-x-2">
                    <TouchableOpacity
                      className="py-2 px-4 border border-gray-300 rounded-full"
                      onPress={() => setActiveTag(tag)}
                    >
                      <Text className="text-sm text-black">Описание</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={disabled}
                      className={`py-2 px-4 rounded-full ${buttonStyle}`}
                      onPress={() => {
                        if (!disabled) {
                          setPendingTagId(tag.projectTagId);
                          setConfirmModal(true);
                        }
                      }}
                    >
                      <Text className="text-sm text-white">{buttonText}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Модалка подтверждения отправки заявки */}
      <Modal visible={confirmModal} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center px-8">
          <View className="bg-white rounded-xl p-6 w-full">
            <Text className="text-lg font-semibold text-center mb-6">Подтвердите отправку заявки</Text>
            <View className="flex-row space-x-4">
              <TouchableOpacity
                className="flex-1 py-3 bg-gray-300 rounded-xl items-center"
                onPress={() => setConfirmModal(false)}
              >
                <Text className="text-black">Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 py-3 bg-black rounded-xl items-center"
                onPress={() => sendRequest(pendingTagId)}
              >
                <Text className="text-white">Отправить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Модалка описания категории */}
      <Modal visible={!!activeTag} transparent >
        <View className="flex-1 bg-black/30 justify-center items-center px-4">
          <View className="bg-white rounded-2xl w-full max-h-[80%] p-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold">{activeTag?.category.action}</Text>
              <TouchableOpacity onPress={() => setActiveTag(null)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <ScrollView>
            <Text className="text-sm text-gray-500 mb-1">Описание</Text>
<Text className="text-base mb-4">
  {activeTag?.category_description || "Описание отсутствует"}
</Text>

<Text className="text-sm text-gray-500 mb-1">Материалы</Text>
<View className="flex-row flex-wrap">
  {(activeTag?.materials || []).map((mat, i) => (
    <View key={i} className="bg-yellow-200 px-3 py-1 rounded-full mr-2 mb-2">
      <Text className="text-sm text-black">{mat}</Text>
    </View>
  ))}
</View>

            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}