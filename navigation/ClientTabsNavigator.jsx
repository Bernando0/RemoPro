import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/client/HomeScreen';
import ProjectsScreen from '../screens/client/ProjectsScreen';
import TeamsScreen from '../screens/client/TeamsScreen';
import ChatScreen from '../screens/client/ChatScreen';
import IconChat from '../assets/Profile.png'
import IconTeam from '../assets/Inbox.png'
import IconProjects from '../assets/Feed.png'
import IconHome from '../assets/Home.png'
import { Image } from 'react-native';
import { Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
    return (
      <View style={styles.tabBarWrapper}>
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
              case 'Teams':
                icon = <Image source={IconTeam} style={{ width: 50, height: 50, tintColor: color }} />;
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
  

export default function ClientTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Projects" component={ProjectsScreen} />
      <Tab.Screen name="Teams" component={TeamsScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
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

  