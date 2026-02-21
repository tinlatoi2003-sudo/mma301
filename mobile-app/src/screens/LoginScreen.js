import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import ScreenContainer from "../components/ScreenContainer";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import { useAuth } from "../context/AuthContext";
import { colors } from "../constants/theme";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await login(email, password);
    } catch (error) {
      Alert.alert("Đăng nhập thất bại", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <Text style={styles.title}>Room Manager</Text>
        
      </View>
      <AppInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <AppInput
        label="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <AppButton label="Đăng nhập" onPress={handleLogin} loading={loading} />
      <View style={styles.footer}>
        <Text style={styles.footerText}>Chưa có tài khoản?</Text>
        <Text style={styles.link} onPress={() => navigation.navigate("Register")}>
          Đăng ký ngay
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginTop: 16,
    marginBottom: 32
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: colors.secondary
  },
  subtitle: {
    marginTop: 10,
    color: colors.muted,
    lineHeight: 22
  },
  footer: {
    marginTop: 18,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center"
  },
  footerText: {
    color: colors.muted
  },
  link: {
    color: colors.primary,
    fontWeight: "700"
  }
});
