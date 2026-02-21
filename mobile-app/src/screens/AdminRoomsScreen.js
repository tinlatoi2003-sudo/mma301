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
  title: "",
  address: "",
  price: "",
  area: "",
  status: "available",
  imageUrl: "",
  description: "",
  facilities: "",
  managerName: "",
  managerPhone: ""
};

const defaultRoomImage =
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80";

export default function AdminRoomsScreen() {
  const { token } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const updateForm = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const loadRooms = async () => {
    try {
      const response = await api.getRooms();
      setRooms(response.data);
    } catch (error) {
      Alert.alert("Lỗi", error.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRooms();
    }, [])
  );

  const openCreateModal = () => {
    setEditingRoom(null);
    setForm(emptyForm);
    setVisible(true);
  };

  const openEditModal = (room) => {
    setEditingRoom(room);
    setForm({
      title: room.title,
      address: room.address,
      price: String(room.price),
      area: String(room.area),
      status: room.status,
      imageUrl: room.imageUrl,
      description: room.description,
      facilities: room.facilities.join(", "),
      managerName: room.managerName,
      managerPhone: room.managerPhone
    });
    setVisible(true);
  };

  const handleSubmit = async () => {
    try {
      if (!form.title.trim() || !form.address.trim() || !form.price.trim() || !form.area.trim()) {
        Alert.alert("Thiếu thông tin", "Hãy nhập tên phòng, địa chỉ, giá phòng và diện tích");
        return;
      }

      const payload = {
        ...form,
        price: Number(form.price),
        area: Number(form.area),
        imageUrl: form.imageUrl.trim() || defaultRoomImage,
        facilities: form.facilities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      };

      if (Number.isNaN(payload.price) || Number.isNaN(payload.area)) {
        Alert.alert("Dữ liệu không hợp lệ", "Giá phòng và diện tích phải là số.");
        return;
      }

      if (editingRoom) {
        await api.updateRoom(token, editingRoom._id, payload);
      } else {
        await api.createRoom(token, payload);
      }

      setVisible(false);
      setEditingRoom(null);
      setForm(emptyForm);
      loadRooms();
    } catch (error) {
      Alert.alert("Không lưu được phòng", error.message);
    }
  };

  const handleDelete = (roomId) => {
    Alert.alert("Xóa phòng", "Bạn có chắc muốn xóa phòng này?", [
      { text: "Hủy" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await api.deleteRoom(token, roomId);
            loadRooms();
          } catch (error) {
            Alert.alert("Không xóa được phòng", error.message);
          }
        }
      }
    ]);
  };

  const renderRoom = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.meta}>{item.address}</Text>
      <Text style={styles.meta}>
        {item.price.toLocaleString("vi-VN")} VND - {item.area} m2
      </Text>
      <Text style={styles.meta}>Trạng thái: {item.status}</Text>
      <View style={styles.row}>
        <AppButton label="Sửa" onPress={() => openEditModal(item)} style={styles.actionButton} />
        <AppButton
          label="Xóa"
          onPress={() => handleDelete(item._id)}
          variant="secondary"
          style={styles.actionButton}
        />
      </View>
    </View>
  );

  return (
    <ScreenContainer>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Quản lý phòng</Text>
        <Pressable onPress={openCreateModal}>
          <Text style={styles.link}>Thêm phòng</Text>
        </Pressable>
      </View>
      <FlatList data={rooms} keyExtractor={(item) => item._id} renderItem={renderRoom} />

      <Modal visible={visible} animationType="slide">
        <ScreenContainer>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.heading}>{editingRoom ? "Sửa phòng" : "Thêm phòng"}</Text>
            <AppInput
              label="Tên phòng"
              value={form.title}
              onChangeText={(value) => updateForm("title", value)}
            />
            <AppInput
              label="Địa chỉ"
              value={form.address}
              onChangeText={(value) => updateForm("address", value)}
            />
            <AppInput
              label="Giá phòng"
              value={form.price}
              onChangeText={(value) => updateForm("price", value)}
              keyboardType="numeric"
            />
            <AppInput
              label="Diện tích"
              value={form.area}
              onChangeText={(value) => updateForm("area", value)}
              keyboardType="numeric"
            />
            <AppInput
              label="Trạng thái"
              value={form.status}
              onChangeText={(value) => updateForm("status", value)}
            />
            <AppInput
              label="Image URL"
              value={form.imageUrl}
              onChangeText={(value) => updateForm("imageUrl", value)}
            />
            <AppInput
              label="Mô tả"
              value={form.description}
              onChangeText={(value) => updateForm("description", value)}
            />
            <AppInput
              label="Tiện ích"
              value={form.facilities}
              onChangeText={(value) => updateForm("facilities", value)}
            />
            <AppInput
              label="Người quản lý"
              value={form.managerName}
              onChangeText={(value) => updateForm("managerName", value)}
            />
            <AppInput
              label="SDT quản lý"
              value={form.managerPhone}
              onChangeText={(value) => updateForm("managerPhone", value)}
            />
            <AppButton label="Luu phong" onPress={handleSubmit} />
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
  modalGap: {
    height: 10
  }
});

