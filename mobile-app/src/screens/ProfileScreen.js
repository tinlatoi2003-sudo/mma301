import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ScreenContainer from "../components/ScreenContainer";
import AppButton from "../components/AppButton";
import { useAuth } from "../context/AuthContext";
import { colors } from "../constants/theme";

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  return (
    <ScreenContainer>
      <View style={styles.card}>
        <Text style={styles.label}>Họ tên</Text>
        <Text style={styles.value}>{user?.fullName}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email}</Text>
        <Text style={styles.label}>Số điện thoại</Text>
        <Text style={styles.value}>{user?.phone || "Chưa cập nhật"}</Text>
        <Text style={styles.label}>Vai trò</Text>
        <Text style={styles.value}>{user?.role}</Text>
      </View>
      {user?.role === "admin" && (
        <>
          <AppButton label="Quản lý phòng" onPress={() => navigation.navigate("AdminRooms")} />
          <View style={styles.gap} />
          <AppButton label="Quản lý tài khoản" onPress={() => navigation.navigate("AdminUsers")} />
          <View style={styles.gap} />
        </>
      )}
      <View style={styles.gap} />
      <AppButton
        label="Chỉnh sửa thông tin"
        onPress={() => navigation.navigate("EditProfile")}
        variant="secondary"
      />
      <View style={styles.gap} />
      <AppButton label="Đăng xuất" onPress={logout} variant="secondary" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 18
  },
  gap: {
    height: 12
  },
  label: {
    color: colors.muted,
    marginTop: 12
  },
  value: {
    color: colors.secondary,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4
  }
});
