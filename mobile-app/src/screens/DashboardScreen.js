import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";
import ScreenContainer from "../components/ScreenContainer";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { colors } from "../constants/theme";

const summaryCards = [
  { key: "totalRooms", label: "Tổng phòng" },
  { key: "availableRooms", label: "Còn trống" },
  { key: "totalBookings", label: "Lịch hẹn" },
  { key: "pendingBookings", label: "Chờ duyệt" }
];

export default function DashboardScreen({ navigation }) {
  const { token, user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== "admin") {
      setLoading(false);
      return;
    }

    const loadDashboard = async () => {
      try {
        const response = await api.getDashboard(token);
        setSummary(response.data);
      } catch (error) {
        Alert.alert("Không tải được dashboard", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [token, user?.role]);

  if (user?.role !== "admin") {
    return (
      <ScreenContainer>
        <Text style={styles.heading}>Không có quyền truy cập</Text>
        <Text style={styles.subtitle}>Chỉ tài khoản admin mới xem được thống kê.</Text>
      </ScreenContainer>
    );
  }

  if (loading || !summary) {
    return (
      <ScreenContainer>
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text style={styles.heading}>Tổng quan hệ thống</Text>
      <Text style={styles.subtitle}>Xin chào {user?.fullName}</Text>
      <View style={styles.grid}>
        {summaryCards.map((item) => (
          <Pressable
            key={item.key}
            style={styles.card}
            onPress={() => {
              if (user?.role === "admin" && item.key === "pendingBookings") {
                navigation.navigate("PendingBookings");
              }
            }}
          >
            <Text style={styles.cardValue}>{summary[item.key]}</Text>
            <Text style={styles.cardLabel}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.secondary
  },
  subtitle: {
    color: colors.muted,
    marginTop: 8,
    marginBottom: 18
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  card: {
    width: "48%",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 18
  },
  cardValue: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 28
  },
  cardLabel: {
    marginTop: 8,
    color: colors.secondary,
    fontWeight: "600"
  }
});
