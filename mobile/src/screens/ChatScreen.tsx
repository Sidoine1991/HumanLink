import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomTabNavigator from '../components/BottomTabNavigator';
import { colors, spacing, radius, typography, shadows } from '../ui/theme';
import Card from '../components/Card';
import { useApi } from '../api';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date;
  senderName?: string;
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  avatar?: string;
}

export default function ChatScreen() {
  const navigation = useNavigation<any>();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [conversationToRecipient, setConversationToRecipient] = useState<Record<string, number>>({});
  const { client } = useApi();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const me = await client.get('/auth/me');
        setUserId(me.data.id);
      } catch (e) {
        console.error('Impossible de récupérer le profil', e);
      }
      await loadConversations();
    };
    bootstrap();
  }, []);

  const loadConversations = async () => {
    try {
      const res = await client.get('/chat/conversations');
      const data = res.data as any[];
      const map: Record<string, number> = {};
      const mapped: Chat[] = data.map((c) => {
        const otherUserId = userId === c.user_one_id ? c.user_two_id : c.user_one_id;
        map[String(c.id)] = otherUserId;
        return {
          id: String(c.id),
          name: `Utilisateur ${otherUserId}`,
          lastMessage: '',
          timestamp: new Date(c.created_at),
          unread: 0,
        };
      });
      setConversationToRecipient(map);
      setChats(mapped);
    } catch (e) {
      console.error('Erreur de chargement des conversations', e);
      setChats([]);
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    sendMessage(messageText).catch(() => {});
  };

  const sendMessage = async (text: string) => {
    if (!selectedChat || !userId) return;
    const recipientId = conversationToRecipient[selectedChat];
    try {
      const res = await client.post('/chat/send', {
        conversation_id: Number(selectedChat),
        recipient_id: recipientId,
        text,
      });
      const m = res.data;
      setMessages((prev) => [
        ...prev,
        {
          id: String(m.id),
          text: m.text,
          sender: 'me',
          timestamp: new Date(m.created_at),
        },
      ]);
      setMessageText('');
    } catch (e) {
      console.error('Erreur d’envoi du message', e);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const res = await client.get(`/chat/messages/${conversationId}`);
      const data = res.data as any[];
      const mapped: Message[] = data.map((m) => ({
        id: String(m.id),
        text: m.text,
        sender: m.sender_id === userId ? 'me' : 'other',
        timestamp: new Date(m.created_at),
      }));
      setMessages(mapped);
    } catch (e) {
      console.error('Erreur de chargement des messages', e);
      setMessages([]);
    }
  };

  if (selectedChat) {
    // Vue de conversation
    const chat = chats.find((c) => c.id === selectedChat);
    if (messages.length === 0) {
      // Charger messages au premier rendu de la conversation
      loadMessages(selectedChat);
    }
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setSelectedChat(null)}>
            <Text style={styles.backButton}>← Retour</Text>
          </TouchableOpacity>
          <Text style={styles.chatName}>{chat?.name}</Text>
          <View style={styles.placeholder} />
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.sender === 'me' ? styles.myMessage : styles.otherMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.sender === 'me' ? styles.myMessageText : styles.otherMessageText,
                ]}
              >
                {item.text}
              </Text>
              <Text style={styles.messageTime}>
                {item.timestamp.toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>💬</Text>
              <Text style={styles.emptyText}>Aucun message pour le moment</Text>
              <Text style={styles.emptySubtext}>Commencez la conversation !</Text>
            </View>
          }
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Tapez votre message..."
            value={messageText}
            onChangeText={setMessageText}
            multiline
            placeholderTextColor={colors.textTertiary}
          />
          <TouchableOpacity
            style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <Text style={styles.sendIcon}>📤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // Liste des conversations
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messagerie</Text>
        <Text style={styles.subtitle}>Communiquez avec la communauté</Text>
      </View>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => setSelectedChat(item.id)}
            activeOpacity={0.7}
          >
            <View style={styles.chatAvatar}>
              <Text style={styles.chatAvatarText}>{item.name.charAt(0)}</Text>
            </View>
            <View style={styles.chatContent}>
              <View style={styles.chatHeaderRow}>
                <Text style={styles.chatName}>{item.name}</Text>
                <Text style={styles.chatTime}>
                  {item.timestamp.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
              <Text style={styles.chatLastMessage} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>
            {item.unread > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unread}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Image 
              source={require('../../assets/images/chat/Message.jpeg')}
              style={styles.emptyStateImage}
              resizeMode="contain"
            />
            <Text style={styles.emptyText}>Aucune conversation</Text>
            <Text style={styles.emptySubtext}>
              Commencez à discuter avec des membres de la communauté
            </Text>
          </View>
        }
      />
      <BottomTabNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  chatItem: {
    flexDirection: 'row',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
  },
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  chatAvatarText: {
    ...typography.h4,
    color: colors.textInverse,
  },
  chatContent: {
    flex: 1,
  },
  chatHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  chatName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  chatTime: {
    ...typography.small,
    color: colors.textTertiary,
  },
  chatLastMessage: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  unreadBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  unreadText: {
    ...typography.smallBold,
    color: colors.textInverse,
    fontSize: 10,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    ...typography.bodyBold,
    color: colors.primary,
    marginRight: spacing.md,
  },
  placeholder: {
    width: 60,
  },
  messagesList: {
    padding: spacing.md,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.bgSecondary,
  },
  messageText: {
    ...typography.body,
    marginBottom: spacing.xs,
  },
  myMessageText: {
    color: colors.textInverse,
  },
  otherMessageText: {
    color: colors.text,
  },
  messageTime: {
    ...typography.small,
    color: colors.textTertiary,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: colors.bgSecondary,
    borderRadius: radius.md,
    padding: spacing.md,
    maxHeight: 100,
    ...typography.body,
    color: colors.text,
    marginRight: spacing.sm,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendIcon: {
    fontSize: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyStateImage: {
    width: 200,
    height: 200,
    marginBottom: spacing.md,
    opacity: 0.7,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyText: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});

