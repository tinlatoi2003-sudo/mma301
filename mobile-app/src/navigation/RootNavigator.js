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
import { colors } from "../constants/theme";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs({ userRole }) {
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
          title: "Phòng",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          )
        }} 
      />
      <Tab.Screen 
        name="LichHen" 
        component={BookingScreen} 
        options={{ 
          title: "Đặt lịch",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar" size={size} color={color} />
          )
        }} 
      />
      {userRole === "admin" && (
        <Tab.Screen 
          name="ThongKe" 
          component={DashboardScreen} 
          options={{ 
            title: "Thống kê",
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
          title: "Tài khoản",
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
            children={() => <MainTabs userRole={user?.role} />}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RoomDetail"
            component={RoomDetailScreen}
            options={{ title: "Chi tiết phòng" }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ title: "Chỉnh sửa thông tin" }}
          />
          {user?.role === "admin" && (
            <>
              <Stack.Screen
                name="AdminRooms"
                component={AdminRoomsScreen}
                options={{ title: "Quản lý phòng" }}
              />
              <Stack.Screen
                name="AdminUsers"
                component={AdminUsersScreen}
                options={{ title: "Quản lý user" }}
              />
              <Stack.Screen
                name="PendingBookings"
                component={PendingBookingsScreen}
                options={{ title: "Chờ duyệt" }}
              />
            </>
          )}
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "Đăng nhập" }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: "Đăng ký" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
