import React, { useCallback, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ScreenContainer from "../components/ScreenContainer";
import AppButton from "../components/AppButton";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { colors } from "../constants/theme";

export default function PendingBookingsScreen() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);

  const loadPendingBookings = async () => {
    try {
      const response = await api.getBookingsByStatus(token, "pending");
      setBookings(response.data);
    } catch (error) {
      Alert.alert("Không tải được danh sách chờ duyệt", error.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPendingBookings();
    }, [token])
  );

  const handleConfirm = async (bookingId) => {
    try {
      await api.updateBookingStatus(token, bookingId, "confirmed");
      await loadPendingBookings();
      Alert.alert("Thành công", "Đã xác nhận lịch hẹn.");
    } catch (error) {
      Alert.alert("Không xác nhận được", error.message);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await api.updateBookingStatus(token, bookingId, "cancelled");
      await loadPendingBookings();
      Alert.alert("Thành công", "Đã từ chối lịch hẹn.");
    } catch (error) {
      Alert.alert("Không cập nhật được", error.message);
    }
  };

  return (
    <ScreenContainer>
      <Text style={styles.heading}>Danh sách chờ duyệt</Text>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.room?.title}</Text>
            <Text style={styles.meta}>Người đặt: {item.user?.fullName}</Text>
            <Text style={styles.meta}>Email: {item.user?.email}</Text>
            <Text style={styles.meta}>Số điện thoại: {item.user?.phone || "Chưa có"}</Text>
            <Text style={styles.meta}>Ngày xem phòng: {item.visitDate}</Text>
            <Text style={styles.note}>{item.note || "Không có ghi chú"}</Text>
            <View style={styles.row}>
              <AppButton
                label="Xác nhận"
                onPress={() => handleConfirm(item._id)}
                style={styles.actionButton}
              />
              <AppButton
                label="Từ chối"
                onPress={() => handleCancel(item._id)}
                variant="secondary"
                style={styles.actionButton}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Không có lịch hẹn nào đang chờ duyệt.</Text>}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.secondary,
    marginBottom: 18
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12
  },
  title: {
    color: colors.secondary,
    fontSize: 18,
    fontWeight: "700"
  },
  meta: {
    color: colors.text,
    marginTop: 6
  },
  note: {
    color: colors.muted,
    marginTop: 8
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14
  },
  actionButton: {
    flex: 1
  },
  empty: {
    color: colors.muted
  }
});
