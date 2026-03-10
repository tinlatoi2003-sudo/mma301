import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import ScreenContainer from "../components/ScreenContainer";
import AppButton from "../components/AppButton";
import { colors } from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

function formatMessageTime(value) {
  return new Date(value).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function ChatDetailScreen({ route, navigation }) {
  const flatListRef = useRef(null);
  const { token, user } = useAuth();
  const { conversationId, title } = route.params;
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [text, setText] = useState("");

  const screenTitle = useMemo(() => title || "Tro chuyen", [title]);

  useEffect(() => {
    navigation.setOptions({ title: screenTitle });
  }, [navigation, screenTitle]);

  const loadMessages = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      const response = await api.getConversationMessages(token, conversationId);
      setConversation(response.data.conversation);
      setMessages(response.data.messages);
    } catch (error) {
      Alert.alert("Khong tai duoc tin nhan", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages(true);
    const timer = setInterval(() => {
      loadMessages(false);
    }, 5000);

    return () => clearInterval(timer);
  }, [conversationId, token]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 50);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) {
      return;
    }

    try {
      setSending(true);
      await api.sendMessage(token, conversationId, text.trim());
      setText("");
      await loadMessages(false);
    } catch (error) {
      Alert.alert("Khong gui duoc tin nhan", error.message);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <ScreenContainer>
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>{screenTitle}</Text>
          <Text style={styles.headerMeta}>
            {user?.role === "admin"
              ? conversation?.customer?.email || "Khach hang"
              : "Nhan vien ho tro se phan hoi trong cuoc tro chuyen nay"}
          </Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const isMine = item.sender?._id === user?._id;

            return (
              <View
                style={[
                  styles.messageRow,
                  isMine ? styles.messageRowMine : styles.messageRowOther
                ]}
              >
                <View
                  style={[
                    styles.bubble,
                    isMine ? styles.bubbleMine : styles.bubbleOther
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      isMine && styles.messageTextMine
                    ]}
                  >
                    {item.text}
                  </Text>
                  <Text
                    style={[
                      styles.messageTime,
                      isMine && styles.messageTimeMine
                    ]}
                  >
                    {item.sender?.fullName || "Nguoi dung"} •{" "}
                    {formatMessageTime(item.createdAt)}
                  </Text>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Chua co tin nhan nao. Hay bat dau cuoc tro chuyen.
            </Text>
          }
        />

        <View style={styles.inputWrap}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Nhap tin nhan..."
            placeholderTextColor={colors.muted}
            style={styles.input}
            multiline
          />
          <AppButton
            label={sending ? "Dang gui..." : "Gui"}
            onPress={handleSend}
            loading={sending}
            style={styles.sendButton}
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  headerCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 12
  },
  headerTitle: {
    color: colors.secondary,
    fontSize: 18,
    fontWeight: "700"
  },
  headerMeta: {
    color: colors.muted,
    marginTop: 6
  },
  listContent: {
    paddingBottom: 16
  },
  messageRow: {
    marginBottom: 10,
    flexDirection: "row"
  },
  messageRowMine: {
    justifyContent: "flex-end"
  },
  messageRowOther: {
    justifyContent: "flex-start"
  },
  bubble: {
    maxWidth: "82%",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  bubbleMine: {
    backgroundColor: colors.primary
  },
  bubbleOther: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border
  },
  messageText: {
    color: colors.text,
    lineHeight: 20
  },
  messageTextMine: {
    color: colors.white
  },
  messageTime: {
    color: colors.muted,
    marginTop: 8,
    fontSize: 11
  },
  messageTimeMine: {
    color: "#f6ddd2"
  },
  empty: {
    color: colors.muted,
    marginTop: 20
  },
  inputWrap: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12
  },
  input: {
    minHeight: 52,
    maxHeight: 120,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    textAlignVertical: "top"
  },
  sendButton: {
    marginTop: 10
  }
});
