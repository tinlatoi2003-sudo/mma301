import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import ScreenContainer from "../components/ScreenContainer";
import AppButton from "../components/AppButton";
import { api } from "../services/api";
import { colors } from "../constants/theme";
import { useAuth } from "../context/AuthContext";

export default function RoomDetailScreen({ route, navigation }) {
  const { roomId } = route.params;
  const { token } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const loadRoom = async () => {
      try {
        const response = await api.getRoomDetail(roomId);
        setRoom(response.data);
      } catch (error) {
        Alert.alert("Khong tai duoc chi tiet phong", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadRoom();
  }, [roomId]);

  const handleBooking = async () => {
    try {
      const bookingRoomId = room?._id || roomId;

      if (!bookingRoomId) {
        Alert.alert("Dat lich that bai", "Khong tim thay ma phong de dat lich");
        return;
      }

      setBookingLoading(true);

      await api.createBooking(token, {
        roomId: bookingRoomId,
        visitDate: new Date().toISOString().slice(0, 10),
        note: "Dat lich xem phong tu mobile app"
      });
      Alert.alert("Thanh cong", "Da tao lich hen. Vao LichHen de thanh toan sandbox.");

      navigation.navigate("MainTabs", {
        screen: "LichHen"
      });
    } catch (error) {
      Alert.alert("Dat lich that bai", error.message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading || !room) {
    return (
      <ScreenContainer>
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: room.imageUrl }} style={styles.image} />
        <Text style={styles.title}>{room.title}</Text>
        <Text style={styles.price}>{room.price.toLocaleString("vi-VN")} VND/thang</Text>
        <Text style={styles.address}>{room.address}</Text>
        <Text style={styles.sectionTitle}>Mo ta</Text>
        <Text style={styles.description}>{room.description}</Text>
        <Text style={styles.sectionTitle}>Tien ich</Text>
        <View style={styles.facilityList}>
          {room.facilities.map((facility) => (
            <View key={facility} style={styles.facilityItem}>
              <Text style={styles.facilityText}>{facility}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.sectionTitle}>Thong tin quan ly</Text>
        <Text style={styles.info}>Nguoi quan ly: {room.managerName}</Text>
        <Text style={styles.info}>So dien thoai: {room.managerPhone}</Text>
        <AppButton label="Dat lich xem phong" onPress={handleBooking} loading={bookingLoading} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 220,
    borderRadius: 24,
    marginBottom: 18
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.secondary
  },
  price: {
    marginTop: 8,
    color: colors.primary,
    fontWeight: "700",
    fontSize: 18
  },
  address: {
    color: colors.muted,
    marginTop: 6
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    color: colors.secondary,
    fontWeight: "800",
    fontSize: 18
  },
  description: {
    color: colors.text,
    lineHeight: 22
  },
  facilityList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 8
  },
  facilityItem: {
    backgroundColor: "#efe6dc",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999
  },
  facilityText: {
    color: colors.secondary,
    fontWeight: "600"
  },
  info: {
    color: colors.text,
    marginBottom: 6
  }
});
