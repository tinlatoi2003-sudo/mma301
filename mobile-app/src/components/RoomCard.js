import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/theme";

export default function RoomCard({ room, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Image source={{ uri: room.imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.title}>{room.title}</Text>
          <View style={[styles.badge, styles[room.status]]}>
            <Text style={styles.badgeLabel}>{room.status}</Text>
          </View>
        </View>
        <Text style={styles.address}>{room.address}</Text>
        <Text style={styles.meta}>
          {room.area} m2 • {room.price.toLocaleString("vi-VN")} VND/tháng
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border
  },
  image: {
    width: "100%",
    height: 160
  },
  content: {
    padding: 16
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  title: {
    flex: 1,
    color: colors.text,
    fontSize: 17,
    fontWeight: "700"
  },
  address: {
    marginTop: 8,
    color: colors.muted
  },
  meta: {
    marginTop: 10,
    color: colors.secondary,
    fontWeight: "600"
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999
  },
  available: {
    backgroundColor: "#d8f3dc"
  },
  reserved: {
    backgroundColor: "#ffe5d9"
  },
  occupied: {
    backgroundColor: "#dee2e6"
  },
  badgeLabel: {
    textTransform: "capitalize",
    fontSize: 12,
    fontWeight: "700",
    color: colors.secondary
  }
});
