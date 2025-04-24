import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore } from "../store/authStore";

import LoginScreen from "../screens/common/LoginScreen";
import RegisterClientScreen from "../screens/common/RegisterClientScreen";
import RegisterContractorScreen from "../screens/common/RegisterContractorScreen";
import RegisterRoleScreen from "../screens/common/RegisterRoleScreen";
import ClientNavigator from "./ClientTabsNavigator";
import ContractorNavigator from "./ContractorTabsNavigator";

import TeamDetailScreen from "../screens/client/TeamDetailScreen";
import UserProfileScreen from "../screens/client/UserProfileScreen";
import ContractorProfileScreen from "../screens/contractor/ContractorProfileScreen";
import EditContractorProfileScreen from "../screens/contractor/EditContractorProfileScreen";
import ClientNotificationScreen from "../screens/client/NotificationScreen";
import ProjectCreateStep1Screen from "../screens/client/projectCreate/ProjectCreateStep1Screen";
import ProjectCreateStep2Screen from "../screens/client/projectCreate/ProjectCreateStep2Screen";
import ProjectCreateStep3Screen from "../screens/client/projectCreate/ProjectCreateStep3Screen";
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
          <Stack.Screen name="RegisterClient" component={RegisterClientScreen} />
          <Stack.Screen name="RegisterContractor" component={RegisterContractorScreen} />
          <Stack.Screen name="RegisterRole" component={RegisterRoleScreen} />
        </>
      )}

      {/* Навигация для клиента */}
      {role === "ROLE_CLIENT" && (
        <>
          <Stack.Screen name="Client" component={ClientNavigator} />
          <Stack.Screen name="UserProfile" component={UserProfileScreen} />
          <Stack.Screen name="ClientNotification" component={ClientNotificationScreen} />
          <Stack.Screen name="CreateProjectStep1" component={ProjectCreateStep1Screen} />
          <Stack.Screen name="CreateProjectStep2" component={ProjectCreateStep2Screen} />
          <Stack.Screen name="CreateProjectStep3" component={ProjectCreateStep3Screen} />
        </>
      )}

      {/* Навигация для исполнителя */}
      {role === "ROLE_CONTRACTOR" && (
        <>
          <Stack.Screen name="Contractor" component={ContractorNavigator} />
          <Stack.Screen name="ContractorProfile" component={ContractorProfileScreen} />
          <Stack.Screen name="EditContractorProfile" component={EditContractorProfileScreen} />
          <Stack.Screen name="ContractorNotification" component={ContractorNotificationScreen} />
        </>
      )}

      {/* Общие экраны */}
      <Stack.Screen name="TeamDetail" component={TeamDetailScreen} />
    </Stack.Navigator>
  );
}
