import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";
import ScreenContainer from "../components/ScreenContainer";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { colors } from "../constants/theme";

const summaryCards = [
  { key: "totalRooms", label: "Tong phong", type: "number" },
  { key: "availableRooms", label: "Con trong", type: "number" },
  { key: "totalBookings", label: "Lich hen", type: "number" },
  { key: "pendingBookings", label: "Cho duyet", type: "number" },
  { key: "totalRevenue", label: "Doanh thu", type: "currency", fullWidth: true }
];

function formatCardValue(value, type) {
  if (type === "currency") {
    return `${(value || 0).toLocaleString("vi-VN")} VND`;
  }

  return String(value || 0);
}

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
        Alert.alert("Khong tai duoc dashboard", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [token, user?.role]);

  if (user?.role !== "admin") {
    return (
      <ScreenContainer>
        <Text style={styles.heading}>Khong co quyen truy cap</Text>
        <Text style={styles.subtitle}>Chi tai khoan admin moi xem duoc thong ke.</Text>
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
      <Text style={styles.heading}>Tong quan he thong</Text>
      <Text style={styles.subtitle}>Xin chao {user?.fullName}</Text>
      <View style={styles.grid}>
        {summaryCards.map((item) => (
          <Pressable
            key={item.key}
            style={[styles.card, item.fullWidth && styles.cardFullWidth]}
            onPress={() => {
              if (item.key === "pendingBookings") {
                navigation.navigate("PendingBookings");
              }
            }}
          >
            <Text
              style={[
                styles.cardValue,
                item.type === "currency" && styles.cardValueCurrency
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {formatCardValue(summary[item.key], item.type)}
            </Text>
            <Text style={styles.cardLabel}>{item.label}</Text>
            {item.key === "totalRevenue" ? (
              <Text style={styles.cardSubLabel}>
                30 ngay: {formatCardValue(summary.revenue30Days, "currency")}
              </Text>
            ) : null}
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
  cardFullWidth: {
    width: "100%"
  },
  cardValue: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 28
  },
  cardValueCurrency: {
    fontSize: 24
  },
  cardLabel: {
    marginTop: 8,
    color: colors.secondary,
    fontWeight: "600"
  },
  cardSubLabel: {
    marginTop: 6,
    color: colors.text,
    fontWeight: "600"
  }
});
