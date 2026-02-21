import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ScreenContainer from "../components/ScreenContainer";
import RoomCard from "../components/RoomCard";
import { api } from "../services/api";
import { colors } from "../constants/theme";

export default function HomeScreen({ navigation }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRooms = async () => {
    try {
      const response = await api.getRooms();
      setRooms(response.data);
    } catch (error) {
      Alert.alert("Không tải được danh sách phòng", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRooms();
    }, [])
  );

  if (loading) {
    return (
      <ScreenContainer>
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text style={styles.heading}>Danh sách phòng cho thuê</Text>
      <FlatList
        data={rooms}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <RoomCard
            room={item}
            onPress={() => navigation.navigate("RoomDetail", { roomId: item._id })}
          />
        )}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadRooms();
            }}
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.secondary,
    marginBottom: 6
  },
  subtitle: {
    color: colors.muted,
    marginBottom: 18
  }
});
