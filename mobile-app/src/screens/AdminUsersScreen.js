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

const roles = ["user", "admin"];

export default function AdminUsersScreen() {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const updateForm = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.getUsers(token);
      setUsers(response.data);
    } catch (error) {
      Alert.alert("Khong tai duoc user", error.message);
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
      setEditingUser(null);
      setForm(emptyForm);
      loadUsers();
    } catch (error) {
      Alert.alert("Khong luu duoc user", error.message);
    }
  };

  const handleDelete = (userId) => {
    Alert.alert("Xoa user", "Ban co chac muon xoa user nay?", [
      { text: "Huy" },
      {
        text: "Xoa",
        style: "destructive",
        onPress: async () => {
          try {
            await api.deleteUserByAdmin(token, userId);
            loadUsers();
          } catch (error) {
            Alert.alert("Khong xoa duoc user", error.message);
          }
        }
      }
    ]);
  };

  const renderUser = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.fullName}</Text>
      <Text style={styles.meta}>{item.email}</Text>
      <Text style={styles.meta}>Vai tro: {item.role}</Text>
      <Text style={styles.meta}>So dien thoai: {item.phone || "Chua co"}</Text>
      <View style={styles.row}>
        <AppButton label="Sua" onPress={() => openEditModal(item)} style={styles.actionButton} />
        {item._id !== currentUser?.id && (
          <AppButton
            label="Xoa"
            onPress={() => handleDelete(item._id)}
            variant="secondary"
            style={styles.actionButton}
          />
        )}
      </View>
    </View>
  );

  return (
    <ScreenContainer>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Quan ly tai khoan</Text>
        <Pressable onPress={openCreateModal}>
          <Text style={styles.link}>Them user</Text>
        </Pressable>
      </View>
      <FlatList data={users} keyExtractor={(item) => item._id} renderItem={renderUser} />

      <Modal visible={visible} animationType="slide">
        <ScreenContainer>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.heading}>{editingUser ? "Sua user" : "Them user"}</Text>
            <AppInput
              label="Ho ten"
              value={form.fullName}
              onChangeText={(value) => updateForm("fullName", value)}
            />
            <AppInput
              label="Email"
              value={form.email}
              onChangeText={(value) => updateForm("email", value)}
              autoCapitalize="none"
              editable={!editingUser}
            />
            <AppInput
              label="So dien thoai"
              value={form.phone}
              onChangeText={(value) => updateForm("phone", value)}
            />
            <AppInput
              label="Mat khau"
              value={form.password}
              onChangeText={(value) => updateForm("password", value)}
              secureTextEntry
            />

            <Text style={styles.roleLabel}>Vai tro</Text>
            <View style={styles.roleRow}>
              {roles.map((role) => {
                const active = form.role === role;

                return (
                  <Pressable
                    key={role}
                    onPress={() => updateForm("role", role)}
                    style={[styles.roleOption, active && styles.roleOptionActive]}
                  >
                    <Text style={[styles.roleText, active && styles.roleTextActive]}>{role}</Text>
                  </Pressable>
                );
              })}
            </View>

            <AppButton label="Luu user" onPress={handleSubmit} />
            <View style={styles.modalGap} />
            <AppButton label="Dong" onPress={() => setVisible(false)} variant="secondary" />
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
  actionButton: {
    flex: 1
  },
  roleLabel: {
    color: colors.secondary,
    marginBottom: 8,
    fontWeight: "600"
  },
  roleRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18
  },
  roleOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center"
  },
  roleOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  roleText: {
    color: colors.secondary,
    fontWeight: "700",
    textTransform: "capitalize"
  },
  roleTextActive: {
    color: colors.white
  },
  modalGap: {
    height: 10
  }
});
