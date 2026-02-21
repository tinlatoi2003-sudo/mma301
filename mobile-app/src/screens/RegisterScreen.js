import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import ScreenContainer from "../components/ScreenContainer";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import { useAuth } from "../context/AuthContext";
import { colors } from "../constants/theme";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      await register({ fullName, phone, email, password });
    } catch (error) {
      Alert.alert("Đăng ký thất bại", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Tạo tài khoản mới</Text>
        <Text style={styles.description}>
          Tài khoản sinh viên có thể đăng ký để xem phòng và đặt lịch hẹn với chủ trọ.
        </Text>
        <AppInput label="Họ và tên" value={fullName} onChangeText={setFullName} />
        <AppInput label="Số điện thoại" value={phone} onChangeText={setPhone} />
        <AppInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <View>
          <AppInput
            label="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <Pressable style={styles.passwordToggle} onPress={() => setShowPassword((prev) => !prev)}>
            <Text style={styles.passwordToggleText}>
              {showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            </Text>
          </Pressable>
        </View>
        <AppButton label="Đăng ký" onPress={handleRegister} loading={loading} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heading: {
    color: colors.secondary,
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8
  },
  description: {
    color: colors.muted,
    lineHeight: 22,
    marginBottom: 24
  },
  passwordToggle: {
    alignSelf: "flex-end",
    marginTop: -6,
    marginBottom: 16
  },
  passwordToggleText: {
    color: colors.primary,
    fontWeight: "700"
  }
});
