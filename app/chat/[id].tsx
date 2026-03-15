import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import { API_URL, BASE_URL } from '../../constants/api';
import { Image } from 'expo-image';

// Replace http with ws for socket URL if needed, but io usually handles it
const SOCKET_URL = API_URL.replace('/api', '');

export default function ChatRoomScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { token, user } = useAuth();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const socket = useRef<Socket | null>(null);
    const flatListRef = useRef<FlatList>(null);

    const fetchMessages = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/chat/messages/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                // Map backend message structure to frontend
                const mappedMessages = data.messages.map((m: any) => ({
                    _id: m._id,
                    matchId: m.match,
                    senderId: m.sender,
                    content: m.content,
                    timestamp: m.createdAt,
                }));
                setMessages(mappedMessages);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    }, [id, token]);

    useEffect(() => {
        fetchMessages();

        // Initialize Socket
        socket.current = io(SOCKET_URL, {
            query: { token },
        });

        socket.current.on('connect', () => {
            console.log('Connected to socket server');
            socket.current?.emit('join_room', id);
        });

        socket.current.on('receive_message', (message) => {
            setMessages((prev) => {
                // Remove optimistic message if it exists (match by content or clientId if we had one)
                const filtered = prev.filter(m =>
                    m._id !== message.clientId &&
                    !(m.content === message.content && m.senderId === message.senderId && m._id?.length < 10)
                );

                return [...filtered, {
                    ...message,
                    timestamp: message.createdAt
                }];
            });
            // Scroll to bottom
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        });

        return () => {
            socket.current?.disconnect();
        };
    }, [id, token, fetchMessages]);

    const sendMessage = () => {
        if (newMessage.trim() === '' || !socket.current) return;

        const messageData = {
            matchId: id,
            senderId: user?._id,
            content: newMessage,
        };

        socket.current.emit('send_message', messageData);
        // We now wait for the 'receive_message' event to update the UI
        // so we have the correct ID and timestamp from the database.
        // But for better UX, we can keep the optimistic update with a temp ID.
        const optimisticMessage = {
            ...messageData,
            _id: Date.now().toString(),
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, optimisticMessage]);
        setNewMessage('');

        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const renderMessage = ({ item }: { item: any }) => {
        const isMe = item.senderId === user?._id;
        return (
            <View style={[styles.messageWrapper, isMe ? styles.myMessageWrapper : styles.otherMessageWrapper]}>
                <View style={[styles.messageBubble, isMe ? styles.myBubble : styles.otherBubble]}>
                    <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.otherMessageText]}>
                        {item.content}
                    </Text>
                </View>
                <Text style={styles.timestamp}>
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#7ED6D1" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#DDE6F0" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>Chat</Text>
                    <Text style={styles.headerStatus}>Online</Text>
                </View>
                <TouchableOpacity style={styles.optionsButton}>
                    <Ionicons name="call-outline" size={24} color="#DDE6F0" />
                </TouchableOpacity>
            </View>

            {/* Messages List */}
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderMessage}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            {/* Input Area */}
            <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.attachButton}>
                    <Ionicons name="add" size={28} color="#7ED6D1" />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    placeholderTextColor="rgba(221, 230, 240, 0.4)"
                    value={newMessage}
                    onChangeText={setNewMessage}
                    multiline
                />
                <TouchableOpacity
                    style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
                    onPress={sendMessage}
                    disabled={!newMessage.trim()}
                >
                    <Ionicons name="send" size={24} color={newMessage.trim() ? "#07141D" : "rgba(7, 20, 29, 0.4)"} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#07141D',
    },
    centered: {
        flex: 1,
        backgroundColor: '#07141D',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#1C2C35',
        borderBottomWidth: 1,
        borderBottomColor: '#3A4A55',
    },
    backButton: {
        marginRight: 15,
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#DDE6F0',
    },
    headerStatus: {
        fontSize: 12,
        color: '#7ED6D1',
    },
    optionsButton: {
        padding: 5,
    },
    messagesList: {
        padding: 20,
        paddingBottom: 30,
    },
    messageWrapper: {
        marginBottom: 20,
        maxWidth: '80%',
    },
    myMessageWrapper: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    otherMessageWrapper: {
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
    },
    messageBubble: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        marginBottom: 4,
    },
    myBubble: {
        backgroundColor: '#7ED6D1',
        borderBottomRightRadius: 4,
    },
    otherBubble: {
        backgroundColor: '#1C2C35',
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: '#3A4A55',
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    myMessageText: {
        color: '#07141D',
    },
    otherMessageText: {
        color: '#DDE6F0',
    },
    timestamp: {
        fontSize: 10,
        color: '#DDE6F0',
        opacity: 0.4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#1C2C35',
        borderTopWidth: 1,
        borderTopColor: '#3A4A55',
        paddingBottom: Platform.OS === 'ios' ? 35 : 15,
    },
    attachButton: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        backgroundColor: '#07141D',
        color: '#DDE6F0',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 10,
        maxHeight: 100,
        fontSize: 16,
    },
    sendButton: {
        width: 48,
        height: 48,
        backgroundColor: '#7ED6D1',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    sendButtonDisabled: {
        backgroundColor: 'rgba(126, 214, 209, 0.3)',
    },
});
