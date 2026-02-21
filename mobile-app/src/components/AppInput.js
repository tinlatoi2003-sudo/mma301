import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../constants/theme";

export default function AppInput({ label, ...props }) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.muted}
        style={styles.input}
        allowFontScaling={true}
        editable={true}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14
  },
  label: {
    color: colors.secondary,
    marginBottom: 8,
    fontWeight: "600"
  },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    color: colors.text
  }
});
