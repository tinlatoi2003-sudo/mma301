import React from "react";
import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import RoomDetailScreen from "../screens/RoomDetailScreen";
import BookingScreen from "../screens/BookingScreen";
import DashboardScreen from "../screens/DashboardScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AdminRoomsScreen from "../screens/AdminRoomsScreen";
import AdminUsersScreen from "../screens/AdminUsersScreen";
import PendingBookingsScreen from "../screens/PendingBookingsScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import ChatListScreen from "../screens/ChatListScreen";
import ChatDetailScreen from "../screens/ChatDetailScreen";
import { colors } from "../constants/theme";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs({ user }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border
        }
      }}
    >
      <Tab.Screen
        name="TrangChu"
        component={HomeScreen}
        options={{
          title: "Phong",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="LichHen"
        component={BookingScreen}
        options={{
          title: "Lich hen",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatListScreen}
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="chat-processing"
              size={size}
              color={color}
            />
          )
        }}
      />
      {user?.role === "admin" && (
        <Tab.Screen
          name="ThongKe"
          component={DashboardScreen}
          options={{
            title: "Thong ke",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="chart-bar" size={size} color={color} />
            )
          }}
        />
      )}
      <Tab.Screen
        name="TaiKhoan"
        component={ProfileScreen}
        options={{
          title: "Tai khoan",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { token, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background
        },
        headerShadowVisible: false,
        headerTintColor: colors.secondary
      }}
    >
      {token ? (
        <>
          <Stack.Screen
            name="MainTabs"
            children={() => <MainTabs user={user} />}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RoomDetail"
            component={RoomDetailScreen}
            options={{ title: "Chi tiet phong" }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ title: "Chinh sua thong tin" }}
          />
          <Stack.Screen
            name="ChatDetail"
            component={ChatDetailScreen}
            options={{ title: "Tro chuyen" }}
          />
          {user?.role === "admin" && (
            <>
              <Stack.Screen
                name="AdminRooms"
                component={AdminRoomsScreen}
                options={{ title: "Quan ly phong" }}
              />
              <Stack.Screen
                name="AdminUsers"
                component={AdminUsersScreen}
                options={{ title: "Quan ly user" }}
              />
              <Stack.Screen
                name="PendingBookings"
                component={PendingBookingsScreen}
                options={{ title: "Cho duyet" }}
              />
            </>
          )}
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "Dang nhap" }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: "Dang ky" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
