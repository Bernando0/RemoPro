import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore } from "../store/authStore";

import LoginScreen from "../screens/common/LoginScreen";
import ClientNavigator from "./ClientTabsNavigator";
import ContractorNavigator from "./ContractorTabsNavigator";

import TeamDetailScreen from "../screens/client/TeamDetailScreen";
import UserProfileScreen from "../screens/client/UserProfileScreen";
import NotificationScreen from "../screens/client/NotificationScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const role = useAuthStore((state) => state.role);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Если нет роли — показываем логин */}
      {!role && <Stack.Screen name="Login" component={LoginScreen} />}
      {role === "client" && <Stack.Screen name="Client" component={ClientNavigator} />}
      {role === "contractor" && <Stack.Screen name="Contractor" component={ContractorNavigator} />}

      {/* Общие экраны для обеих ролей */}
      <Stack.Screen name="TeamDetail" component={TeamDetailScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
    </Stack.Navigator>
  );
}
