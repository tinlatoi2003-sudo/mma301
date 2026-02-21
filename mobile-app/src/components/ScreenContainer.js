import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { colors } from "../constants/theme";

export default function ScreenContainer({ children }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16
  }
});
