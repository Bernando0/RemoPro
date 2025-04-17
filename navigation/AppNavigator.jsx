import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ClientTabsNavigator from "./ClientTabsNavigator";
import TeamDetailScreen from "../screens/client/TeamDetailScreen";
import UserProfileScreen from "../screens/client/UserProfileScreen";
import NotificationScreen from "../screens/client/NotificationScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={ClientTabsNavigator} />
      <Stack.Screen name="TeamDetail" component={TeamDetailScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
    </Stack.Navigator>
  );
}
