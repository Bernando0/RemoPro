import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Pressable,
} from "react-native";
import Logo from "../../assets/logo.svg";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterRoleScreen() {
  const navigation = useNavigation();
  const [selectedRole, setSelectedRole] = useState(null);
  const [animation] = useState(new Animated.Value(1));

  const toggleRole = (role) => {
    if (selectedRole === role) {
      setSelectedRole(null);
    } else {
      setSelectedRole(role);
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1.1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const roles = [
    { label: "Стать клиентом", value: "client" },
    { label: "Стать подрядчиком", value: "contractor" },
  ];

  return (
    <View className="flex-1 bg-white px-6 pt-20">
      <View className="items-center mb-10">
        <Logo width={150} height={30} />
      </View>

      {roles.map((role) => {
        const isSelected = selectedRole === role.value;
        return (
          <Pressable
            key={role.value}
            onPress={() => toggleRole(role.value)}
            className={`rounded-xl px-4 py-5 mb-4 flex-row justify-between items-start ${
              isSelected ? "bg-black" : "border border-gray-300"
            }`}
          >
            <Text
              className={`text-base font-medium mb-10 ${
                isSelected ? "text-white" : "text-black"
              }`}
            >
              {role.label}
            </Text>
            <Animated.View style={{ transform: [{ scale: animation }] }}>
              <Ionicons
                name={isSelected ? "checkbox" : "square-outline"}
                size={24}
                color={isSelected ? "white" : "black"}
              />
            </Animated.View>
          </Pressable>
        );
      })}

      <TouchableOpacity
        disabled={!selectedRole}
        className={`py-3 rounded-xl items-center ${
          selectedRole ? "bg-black" : "bg-gray-200"
        }`}
        onPress={() => {
          if (selectedRole === "client") {
            navigation.navigate("RegisterClient");
          } else if (selectedRole === "contractor") {
            navigation.navigate("RegisterContractor");
          }
        }}
      >
        <Text
          className={`text-base font-semibold ${
            selectedRole ? "text-white" : "text-gray-400"
          }`}
        >
          Создать аккаунт
        </Text>
      </TouchableOpacity>

      <View className="mt-6 items-center">
        <Text className="text-gray-400 text-sm">
          Уже есть аккаунт?{" "}
          <Text
            className="text-black font-semibold"
            onPress={() => navigation.navigate("Login")}
          >
            Войти
          </Text>
        </Text>
      </View>
    </View>
  );
}
