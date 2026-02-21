import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ScreenContainer from "../components/ScreenContainer";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { colors } from "../constants/theme";

export default function BookingScreen() {
  const { token, user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      const response =
        user?.role === "admin"
          ? await api.getAllBookings(token)
          : await api.getMyBookings(token);
      setBookings(response.data);
    } catch (error) {
      Alert.alert("Không tải được lịch hẹn", error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBookings();
    }, [token])
  );

  if (loading) {
    return (
      <ScreenContainer>
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text style={styles.heading}>
        {user?.role === "admin" ? "Người đặt phòng" : "Lịch hẹn của tôi"}
      </Text>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.room?.title}</Text>
            {user?.role === "admin" && (
              <>
                <Text style={styles.meta}>Khách hàng: {item.user?.fullName}</Text>
                <Text style={styles.meta}>Email: {item.user?.email}</Text>
                <Text style={styles.meta}>Số điện thoại: {item.user?.phone || "Chưa có"}</Text>
              </>
            )}
            <Text style={styles.meta}>Ngày xem phòng: {item.visitDate}</Text>
            <Text style={styles.meta}>Trạng thái: {item.status}</Text>
            <Text style={styles.note}>{item.note}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {user?.role === "admin"
              ? "Chưa có người đặt phòng nào."
              : "Bạn chưa đặt lịch nào."}
          </Text>
        }
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
  empty: {
    color: colors.muted
  }
});
