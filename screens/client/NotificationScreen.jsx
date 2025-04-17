import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Logo from "../../assets/logo.svg";
import { notifications } from "../../mock/notificationsMock";

export default function NotificationScreen() {
  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-yellow-300 px-4 pt-20 pb-4 rounded-b-3xl">
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity className="p-1">
            <Ionicons name="arrow-back" size={36} />
          </TouchableOpacity>
          <View className="absolute left-0 right-0 items-center z-0">
            <Logo width={130} height={20} />
          </View>
          <TouchableOpacity className="p-1">
            <Ionicons name="person-circle-outline" size={36} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 60 }}>
        {notifications.length === 0 ? (
          <View className="items-center mt-10">
            <Ionicons name="notifications-off-circle-outline" size={64} color="#ccc" />
            <Text className="mt-4 text-base font-semibold text-gray-600">Пока что уведомлений нет</Text>
            <Text className="text-m text-gray-400 text-center mt-1 px-6">
              Мы сообщим вам, как только появится что-то важное по вашему проекту.
            </Text>
          </View>
        ) : (
          notifications.map((item) => {
            if (item.type === "info") {
                return (
                  <View
                    key={item.id}
                    className="bg-gray-100 rounded-xl p-3 mb-3 flex-row items-start"
                  >
                    {/* Жёлтая рамка с иконкой */}
                    <View className="w-20 h-20 rounded-md bg-yellow-200 justify-center items-center mr-3">
                      <Ionicons name={item.icon} size={26} color="black" />
                    </View>
              
                    <View className="flex-1">
                      <View className="flex-row justify-between items-start">
                        <Text className="font-semibold text-m">{item.title}</Text>
                        <Text className="text-[14px] text-gray-400 ml-2">{item.time}</Text>
                      </View>
                      <Text className="text-m text-gray-600 mt-1">{item.text}</Text>
                    </View>
                  </View>
                );
              }
              

            if (item.type === "chat") {
              return (
                <View key={item.id} className="bg-gray-100 rounded-xl p-3 mb-3 flex-row items-start">
                  <Image source={item.avatar} className="w-20 h-20 rounded-[8px] mr-3" />
                  <View className="flex-1">
                    <Text className="font-semibold text-l">{item.title}</Text>
                    <Text className="text-m text-gray-500 mt-0.5">{item.text}</Text>
                  </View>
                  <Text className="text-[14px] text-gray-400 ml-2">{item.time}</Text>
                </View>
              );
            }

            if (item.type === "request") {
                return (
                  <View key={item.id} className="bg-gray-100 rounded-xl p-4 mb-4">
                    {/* Верх: лого + название команды */}
                    <View className="flex-row items-start space-x-3 mb-2">
                      <Image source={item.team.logo} className="w-20 h-20 rounded-md" />
                      <View className="flex-1 pl-2">
                        <Text className="font-semibold text-base">{item.team.name}</Text>
                        <Text className="text-m text-gray-700 mt-1">
                          откликнулась на ваш проект
                        </Text>
                      </View>
                    </View>
              
                    {/* Сепаратор */}
                    <View className="h-[1px] bg-gray-300 my-2" />
              
                    {/* Проект */}
                    <View className="flex-row items-start space-x-3 mb-3">
                      <Image source={item.team.projectImage} className="w-20 h-20 rounded-md" />
                      <Text className="text-sm pl-2 text-gray-700 flex-1" numberOfLines={3}>
                        {item.team.project}
                      </Text>
                    </View>
              
                    {/* Кнопки */}
                    <View className="flex-row space-x-2">
                      <TouchableOpacity className="flex-1 bg-black py-2 m-1 rounded-lg">
                        <Text className="text-white text-center  text-sm font-semibold">
                          Подтвердить
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity className="flex-1 border border-black py-2 m-1 rounded-lg">
                        <Text className="text-black text-center  text-sm font-semibold">
                          Отказаться
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              
              
            }

            return null;
          })
        )}
      </ScrollView>
    </View>
  );
}
