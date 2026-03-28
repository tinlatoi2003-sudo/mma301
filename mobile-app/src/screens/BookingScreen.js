import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ScreenContainer from "../components/ScreenContainer";
import AppButton from "../components/AppButton";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { colors } from "../constants/theme";

export default function BookingScreen() {
  const { token, user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingBookingId, setPayingBookingId] = useState(null);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [targetBookingId, setTargetBookingId] = useState(null);
  const [payerName, setPayerName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const loadBookings = async () => {
    try {
      const response =
        user?.role === "admin"
          ? await api.getAllBookings(token)
          : await api.getMyBookings(token);
      setBookings(response.data);
    } catch (error) {
      Alert.alert("Khong tai duoc lich hen", error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBookings();
    }, [token])
  );

  const openPaymentModal = (bookingId) => {
    setTargetBookingId(bookingId);
    setPayerName("");
    setAccountNumber("");
    setPaymentModalVisible(true);
  };

  const closePaymentModal = () => {
    setPaymentModalVisible(false);
    setTargetBookingId(null);
    setPayerName("");
    setAccountNumber("");
  };

  const handleSandboxPayment = async () => {
    try {
      if (!targetBookingId) {
        return;
      }

      if (!payerName.trim() || !accountNumber.trim()) {
        Alert.alert("Thieu thong tin", "Vui long nhap ten nguoi thanh toan va so tai khoan.");
        return;
      }

      setPayingBookingId(targetBookingId);
      const response = await api.payBookingSandbox(token, targetBookingId, {
        payerName: payerName.trim(),
        accountNumber: accountNumber.trim()
      });
      const transactionId = response?.data?.paymentTransactionId || "SBX";
      closePaymentModal();
      Alert.alert("Thanh cong", `Thanh toan sandbox thanh cong.\nMa GD: ${transactionId}`);
      await loadBookings();
    } catch (error) {
      Alert.alert("Thanh toan that bai", error.message);
    } finally {
      setPayingBookingId(null);
    }
  };

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
        {user?.role === "admin" ? "Nguoi dat phong" : "Lich hen cua toi"}
      </Text>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.room?.title}</Text>
            {user?.role === "admin" && (
              <>
                <Text style={styles.meta}>Khach hang: {item.user?.fullName}</Text>
                <Text style={styles.meta}>Email: {item.user?.email}</Text>
                <Text style={styles.meta}>So dien thoai: {item.user?.phone || "Chua co"}</Text>
              </>
            )}
            <Text style={styles.meta}>Ngay xem phong: {item.visitDate}</Text>
            <Text style={styles.meta}>Trang thai: {item.status}</Text>
            <Text style={styles.meta}>
              Thanh toan: {item.paymentStatus || "unpaid"} ({item.paymentMethod || "sandbox"})
            </Text>
            {item.paymentTransactionId ? <Text style={styles.meta}>Ma GD: {item.paymentTransactionId}</Text> : null}
            {item.sandboxPayerName ? <Text style={styles.meta}>Nguoi thanh toan: {item.sandboxPayerName}</Text> : null}
            {item.sandboxAccountMasked ? <Text style={styles.meta}>Tai khoan: {item.sandboxAccountMasked}</Text> : null}
            <Text style={styles.note}>{item.note}</Text>
            {user?.role !== "admin" && item.paymentStatus !== "paid" ? (
              <View style={styles.payButtonWrap}>
                <AppButton
                  label={payingBookingId === item._id ? "Dang thanh toan..." : "Thanh toan sandbox"}
                  onPress={() => openPaymentModal(item._id)}
                  loading={payingBookingId === item._id}
                />
              </View>
            ) : null}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {user?.role === "admin"
              ? "Chua co nguoi dat phong nao."
              : "Ban chua dat lich nao."}
          </Text>
        }
      />

      <Modal
        visible={paymentModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closePaymentModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nhap thong tin thanh toan sandbox</Text>
            <TextInput
              style={styles.input}
              value={payerName}
              onChangeText={setPayerName}
              placeholder="Ten nguoi thanh toan"
              placeholderTextColor={colors.muted}
            />
            <TextInput
              style={styles.input}
              value={accountNumber}
              onChangeText={setAccountNumber}
              placeholder="So tai khoan"
              placeholderTextColor={colors.muted}
              keyboardType="number-pad"
            />
            <View style={styles.modalButtons}>
              <AppButton
                label="Huy"
                onPress={closePaymentModal}
                variant="secondary"
                style={styles.modalButton}
              />
              <AppButton
                label={payingBookingId ? "Dang xu ly..." : "Xac nhan thanh toan"}
                onPress={handleSandboxPayment}
                loading={Boolean(payingBookingId)}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  payButtonWrap: {
    marginTop: 12
  },
  empty: {
    color: colors.muted
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 18
  },
  modalCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.secondary,
    marginBottom: 12
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    color: colors.text
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6
  },
  modalButton: {
    flex: 1
  }
});
