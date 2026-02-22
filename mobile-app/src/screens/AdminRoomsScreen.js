import React, { useCallback, useRef, useState } from "react";
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
  // dùng useRef thay vì useState để tránh re-render khi gõ → fix tiếng Việt
  const formRef = useRef({ ...emptyForm });
  const [modalKey, setModalKey] = useState(0); // để force re-mount AppInput khi mở modal mới

  const updateForm = useCallback((key, value) => {
    formRef.current[key] = value;
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
    formRef.current = { ...emptyForm };
    setModalKey((k) => k + 1);
    setVisible(true);
  };

  const openEditModal = (room) => {
    setEditingRoom(room);
    formRef.current = {
      title: room.title,
      address: room.address,
      price: String(room.price),
      area: String(room.area),
      status: room.status,
      imageUrl: room.imageUrl || "",
      description: room.description || "",
      facilities: room.facilities.join(", "),
      managerName: room.managerName || "",
      managerPhone: room.managerPhone || ""
    };
    setModalKey((k) => k + 1);
    setVisible(true);
  };

  const handleSubmit = async () => {
    const f = formRef.current;
    try {
      if (!f.title.trim() || !f.address.trim() || !f.price.trim() || !f.area.trim()) {
        Alert.alert("Thiếu thông tin", "Hãy nhập tên phòng, địa chỉ, giá phòng và diện tích");
        return;
      }

      const payload = {
        ...f,
        price: Number(f.price),
        area: Number(f.area),
        imageUrl: f.imageUrl.trim() || defaultRoomImage,
        facilities: f.facilities
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
      formRef.current = { ...emptyForm };
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
              key={`title-${modalKey}`}
              label="Tên phòng"
              value={formRef.current.title}
              onChangeText={(v) => updateForm("title", v)}
            />
            <AppInput
              key={`address-${modalKey}`}
              label="Địa chỉ"
              value={formRef.current.address}
              onChangeText={(v) => updateForm("address", v)}
            />
            <AppInput
              key={`price-${modalKey}`}
              label="Giá phòng"
              value={formRef.current.price}
              onChangeText={(v) => updateForm("price", v)}
              keyboardType="numeric"
            />
            <AppInput
              key={`area-${modalKey}`}
              label="Diện tích"
              value={formRef.current.area}
              onChangeText={(v) => updateForm("area", v)}
              keyboardType="numeric"
            />
            <AppInput
              key={`status-${modalKey}`}
              label="Trạng thái"
              value={formRef.current.status}
              onChangeText={(v) => updateForm("status", v)}
            />
            <AppInput
              key={`imageUrl-${modalKey}`}
              label="Image URL"
              value={formRef.current.imageUrl}
              onChangeText={(v) => updateForm("imageUrl", v)}
            />
            <AppInput
              key={`description-${modalKey}`}
              label="Mô tả"
              value={formRef.current.description}
              onChangeText={(v) => updateForm("description", v)}
            />
            <AppInput
              key={`facilities-${modalKey}`}
              label="Tiện ích"
              value={formRef.current.facilities}
              onChangeText={(v) => updateForm("facilities", v)}
            />
            <AppInput
              key={`managerName-${modalKey}`}
              label="Người quản lý"
              value={formRef.current.managerName}
              onChangeText={(v) => updateForm("managerName", v)}
            />
            <AppInput
              key={`managerPhone-${modalKey}`}
              label="SDT quản lý"
              value={formRef.current.managerPhone}
              onChangeText={(v) => updateForm("managerPhone", v)}
            />
            <AppButton label="Lưu phòng" onPress={handleSubmit} />
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
  actionButton: {
    flex: 1
  },
  modalGap: {
    height: 10
  }
});

