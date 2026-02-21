import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../constants/theme";

export default function AppButton({
  label,
  onPress,
  loading,
  variant = "primary",
  style,
  textStyle
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, variant === "secondary" && styles.secondaryButton, style]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "secondary" ? colors.primary : colors.white} />
      ) : (
        <Text
          style={[
            styles.label,
            variant === "secondary" && styles.secondaryLabel,
            textStyle
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center"
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary
  },
  label: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 16
  },
  secondaryLabel: {
    color: colors.primary
  }
});
