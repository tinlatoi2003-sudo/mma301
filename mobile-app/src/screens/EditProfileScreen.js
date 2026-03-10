import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from "react-native";
import ScreenContainer from "../components/ScreenContainer";
import AppButton from "../components/AppButton";
import { useAuth } from "../context/AuthContext";
import { colors } from "../constants/theme";

export default function EditProfileScreen({ navigation }) {
  const { user, updateUser } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [chatEnabled, setChatEnabled] = useState(Boolean(user?.chatEnabled));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");

    if (!fullName.trim()) {
      setError("Họ tên không được để trống.");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    const payload = { fullName: fullName.trim() };
    if (phone.trim()) payload.phone = phone.trim();
    if (newPassword) payload.password = newPassword;
    if (user?.role !== "admin") payload.chatEnabled = chatEnabled;

    try {
      setLoading(true);
      await updateUser(payload);
      Alert.alert("Thành công", "Thông tin đã được cập nhật.", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      setError(err.message || "Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>

            <Text style={styles.label}>Họ tên *</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Nhập họ tên"
              placeholderTextColor={colors.muted}
            />

            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Nhập số điện thoại"
              placeholderTextColor={colors.muted}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Email</Text>
            <View style={styles.readonlyField}>
              <Text style={styles.readonlyText}>{user?.email}</Text>
            </View>

            {user?.role !== "admin" && (
              <View style={styles.switchRow}>
                <View style={styles.switchCopy}>
                  <Text style={styles.switchTitle}>Bat chat voi admin</Text>
                  <Text style={styles.switchHint}>
                    Khi bat, ban se thay kenh chat voi admin.
                  </Text>
                </View>
                <Switch
                  value={chatEnabled}
                  onValueChange={setChatEnabled}
                  trackColor={{ false: "#d6d6d6", true: colors.primary }}
                  thumbColor={colors.white}
                />
              </View>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Đổi mật khẩu</Text>
            <Text style={styles.hint}>Để trống nếu không muốn đổi mật khẩu</Text>

            <Text style={styles.label}>Mật khẩu mới</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Nhập mật khẩu mới"
              placeholderTextColor={colors.muted}
              secureTextEntry
            />

            <Text style={styles.label}>Xác nhận mật khẩu</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Nhập lại mật khẩu mới"
              placeholderTextColor={colors.muted}
              secureTextEntry
            />
          </View>

          {error !== "" && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.gap} />
          <AppButton label="Lưu thay đổi" onPress={handleSave} loading={loading} />
          <View style={styles.gap} />
          <AppButton
            label="Hủy"
            onPress={() => navigation.goBack()}
            variant="secondary"
          />
          <View style={styles.gap} />
        </ScrollView>
      </KeyboardAvoidingView>
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
    marginBottom: 16
  },
  sectionTitle: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12
  },
  hint: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: 8,
    marginTop: -4
  },
  label: {
    color: colors.muted,
    marginTop: 10,
    marginBottom: 4,
    fontSize: 13
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 15
  },
  readonlyField: {
    backgroundColor: colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  readonlyText: {
    color: colors.muted,
    fontSize: 15
  },
  switchRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  switchCopy: {
    flex: 1,
    paddingRight: 10
  },
  switchTitle: {
    color: colors.secondary,
    fontWeight: "700"
  },
  switchHint: {
    color: colors.muted,
    marginTop: 2,
    fontSize: 12
  },
  gap: {
    height: 12
  },
  errorBox: {
    backgroundColor: "#fde8e8",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8
  },
  errorText: {
    color: "#c0392b",
    fontSize: 14,
    textAlign: "center"
  }
});
