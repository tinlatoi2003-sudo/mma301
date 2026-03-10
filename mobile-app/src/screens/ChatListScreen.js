import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import ScreenContainer from "../components/ScreenContainer";
import AppButton from "../components/AppButton";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { colors } from "../constants/theme";

function formatDate(value) {
  if (!value) {
    return "Chua co tin nhan";
  }

  return new Date(value).toLocaleString("vi-VN");
}

export default function ChatListScreen() {
  const navigation = useNavigation();
  const { token, user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadConversations = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.getConversations(token);
      setConversations(response.data);
    } catch (error) {
      Alert.alert("Khong tai duoc cuoc tro chuyen", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (user?.role !== "admin" && !user?.chatEnabled) {
        setConversations([]);
        setLoading(false);
        return;
      }

      loadConversations();
    }, [token, user?.role, user?.chatEnabled])
  );

  if (loading) {
    return (
      <ScreenContainer>
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  if (user?.role !== "admin" && !user?.chatEnabled) {
    return (
      <ScreenContainer>
        <View style={styles.emptyWrap}>
          <Text style={styles.empty}>
            Ban chua bat chat voi admin. Vao Chinh sua thong tin de bat chat.
          </Text>
          <AppButton
            label="Bat chat ngay"
            onPress={() => navigation.navigate("EditProfile")}
            style={styles.enableButton}
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text style={styles.heading}>
        {user?.role === "admin" ? "Tro chuyen voi khach" : "Chat voi admin"}
      </Text>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadConversations(true)}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }) => {
          const otherParty = user?.role === "admin" ? item.customer : item.admin;

          return (
            <Pressable
              style={styles.card}
              onPress={() =>
                navigation.navigate("ChatDetail", {
                  conversationId: item._id,
                  title:
                    user?.role === "admin"
                      ? otherParty?.fullName || "Khach hang"
                      : "Ho tro admin"
                })
              }
            >
              <Text style={styles.name}>
                {user?.role === "admin"
                  ? otherParty?.fullName || "Khach hang"
                  : "Admin ho tro"}
              </Text>
              {user?.role === "admin" && (
                <Text style={styles.meta}>
                  {otherParty?.email || "Chua co email"}
                </Text>
              )}
              <Text style={styles.preview} numberOfLines={2}>
                {item.lastMessage || "Bat dau cuoc tro chuyen"}
              </Text>
              <Text style={styles.time}>{formatDate(item.lastMessageAt)}</Text>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.empty}>
              {user?.role === "admin"
                ? "Chua co cuoc tro chuyen nao."
                : "Chua co hoi thoai. Ban co the mo chat voi admin ngay bay gio."}
            </Text>
          </View>
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
    marginBottom: 18
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.secondary
  },
  meta: {
    marginTop: 6,
    color: colors.muted
  },
  preview: {
    marginTop: 10,
    color: colors.text,
    lineHeight: 20
  },
  time: {
    marginTop: 10,
    color: colors.muted,
    fontSize: 12
  },
  emptyWrap: {
    paddingTop: 30
  },
  enableButton: {
    marginTop: 14
  },
  empty: {
    color: colors.muted,
    lineHeight: 22
  }
});
