// navigation/ContractorTabsNavigator.jsx


import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';
import ContractorHomeScreen from '../screens/contractor/HomeScreen';
import ContractorProjectsScreen from '../screens/contractor/ProjectsScreen';
import ContractorOrdersScreen from '../screens/contractor/OrdersScreen';
import ContractorChatScreen from '../screens/contractor/ChatScreen';
import IconChat from '../assets/Profile.png'
import IconOrders from '../assets/Orders.png'
import IconProjects from '../assets/Feed.png'
import IconHome from '../assets/Home.png'

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, navigation }) => {
  return (
    <View testID="contractor-tabs" style={styles.tabBarWrapper}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const onPress = () => {
            if (!isFocused) navigation.navigate(route.name);
          };

          let icon;
          const color = isFocused ? '#fff' : '#000';

          switch (route.name) {
            case 'Home':
              icon = <Image source={IconHome} style={{ width: 50, height: 50, tintColor: color }} />;
              break;
            case 'Projects':
              icon = <Image source={IconProjects} style={{ width: 50, height: 50, tintColor: color }} />;
              break;
            case 'Orders':
              icon = <Image source={IconOrders} style={{ width: 50, height: 50, tintColor: color }} />;
              break;
            case 'Chat':
              icon = <Image source={IconChat} style={{ width: 50, height: 50, tintColor: color }} />;
              break;
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[styles.tabItem, isFocused && styles.activeTab]}
            >
              {icon}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default function ContractorTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={ContractorHomeScreen} />
      <Tab.Screen name="Projects" component={ContractorProjectsScreen} />
      <Tab.Screen name="Orders" component={ContractorOrdersScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#ececec',
    gap: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 10,
    
  },
  tabItem: {
    padding: 5,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  activeTab: {
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: '#000',
  },
  
});
