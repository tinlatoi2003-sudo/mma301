import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ScreenContainer from "../components/ScreenContainer";
import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { colors } from "../constants/theme";

const emptyForm = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  role: "user"
};

export default function AdminUsersScreen() {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const loadUsers = async () => {
    try {
      const response = await api.getUsers(token);
      setUsers(response.data);
    } catch (error) {
      Alert.alert("Không tải được user", error.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [token])
  );

  const openCreateModal = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setVisible(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || "",
      password: "",
      role: user.role
    });
    setVisible(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        await api.updateUserByAdmin(token, editingUser._id, {
          fullName: form.fullName,
          phone: form.phone,
          password: form.password || undefined,
          role: form.role
        });
      } else {
        await api.createUserByAdmin(token, form);
      }

      setVisible(false);
      setForm(emptyForm);
      loadUsers();
    } catch (error) {
      Alert.alert("Không lưu được user", error.message);
    }
  };

  const handleDelete = (userId) => {
    Alert.alert("Xóa user", "Bạn có chắc muốn xóa user này?", [
      { text: "Hủy" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await api.deleteUserByAdmin(token, userId);
            loadUsers();
          } catch (error) {
            Alert.alert("Không xóa được user", error.message);
          }
        }
      }
    ]);
  };

  const renderUser = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.fullName}</Text>
      <Text style={styles.meta}>{item.email}</Text>
      <Text style={styles.meta}>Vai trò: {item.role}</Text>
      <Text style={styles.meta}>Số điện thoại: {item.phone || "Chưa có"}</Text>
      <View style={styles.row}>
        <AppButton label="Sửa" onPress={() => openEditModal(item)} />
        {item._id !== currentUser?.id && (
          <AppButton label="Xóa" onPress={() => handleDelete(item._id)} variant="secondary" />
        )}
      </View>
    </View>
  );

  return (
    <ScreenContainer>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Quản lý tài khoản</Text>
        <Pressable onPress={openCreateModal}>
          <Text style={styles.link}>Thêm user</Text>
        </Pressable>
      </View>
      <FlatList data={users} keyExtractor={(item) => item._id} renderItem={renderUser} />

      <Modal visible={visible} animationType="slide">
        <ScreenContainer>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.heading}>{editingUser ? "Sửa user" : "Thêm user"}</Text>
            <AppInput label="Họ tên" value={form.fullName} onChangeText={(value) => setForm({ ...form, fullName: value })} />
            <AppInput label="Email" value={form.email} onChangeText={(value) => setForm({ ...form, email: value })} autoCapitalize="none" editable={!editingUser} />
            <AppInput label="Số điện thoại" value={form.phone} onChangeText={(value) => setForm({ ...form, phone: value })} />
            <AppInput label="Mật khẩu" value={form.password} onChangeText={(value) => setForm({ ...form, password: value })} secureTextEntry />
            <AppInput label="Vai trò" value={form.role} onChangeText={(value) => setForm({ ...form, role: value })} />
            <AppButton label="Lưu user" onPress={handleSubmit} />
            <View style={styles.modalGap} />
            <AppButton label="Đóng" onPress={() => setVisible(false)} variant="secondary" />
          </ScrollView>
        </ScreenContainer>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.secondary
  },
  link: {
    color: colors.primary,
    fontWeight: "700"
  },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14
  },
  title: {
    color: colors.secondary,
    fontWeight: "800",
    fontSize: 18
  },
  meta: {
    color: colors.muted,
    marginTop: 6
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14
  },
  modalGap: {
    height: 10
  }
});
