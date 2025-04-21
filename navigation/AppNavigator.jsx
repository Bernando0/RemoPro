import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore } from "../store/authStore";

import LoginScreen from "../screens/common/LoginScreen";
import RegisterScreen from "../screens/common/RegisterScreen";
import ClientNavigator from "./ClientTabsNavigator";
import ContractorNavigator from "./ContractorTabsNavigator";

import TeamDetailScreen from "../screens/client/TeamDetailScreen";
import UserProfileScreen from "../screens/client/UserProfileScreen";
import ContractorProfileScreen from "../screens/contractor/ContractorProfileScreen";
import ClientNotificationScreen from "../screens/client/NotificationScreen";
import ContractorNotificationScreen from "../screens/contractor/NotificationScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const role = useAuthStore((state) => state.role);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Показываем Login, если роли нет */}
      {!role && (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}

      {/* Навигация для клиента */}
      {role === "ROLE_CLIENT" && (
        <>
          <Stack.Screen name="Client" component={ClientNavigator} />
          <Stack.Screen name="UserProfile" component={UserProfileScreen} />
          <Stack.Screen name="ClientNotification" component={ClientNotificationScreen} />
        </>
      )}

      {/* Навигация для исполнителя */}
      {role === "ROLE_CONTRACTOR" && (
        <>
          <Stack.Screen name="Contractor" component={ContractorNavigator} />
          <Stack.Screen name="ContractorProfile" component={ContractorProfileScreen} />
          <Stack.Screen name="ContractorNotification" component={ContractorNotificationScreen} />
        </>
      )}

      {/* Общие экраны */}
      <Stack.Screen name="TeamDetail" component={TeamDetailScreen} />
    </Stack.Navigator>
  );
}
