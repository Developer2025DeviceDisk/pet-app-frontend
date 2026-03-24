import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../../context/AuthContext';
import { API_URL, BASE_URL } from '../../../constants/api';

export default function ChatScreen() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Find Mate Chats");

  const fetchMatches = async () => {
    try {
      const response = await fetch(`${API_URL}/user/matches`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setMatches(data.matches);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [token]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMatches();
  }, [token]);

  const renderMatchItem = ({ item, index }: { item: any, index: number }) => {
    // Find the other user and pet
    const otherUser = item.users.find((u: any) => u._id !== user?._id);
    const otherPet = item.pets.find((p: any) => p.owner && p.owner !== user?._id);
    
    // Check if there is a real last message
    const lastMessage = item.lastMessage;
    const messageText = lastMessage?.content || `Matched with ${otherPet?.petName || 'their pet'}!`;
    
    // Format the time if available
    let timeString = "";
    if (lastMessage?.createdAt) {
      const date = new Date(lastMessage.createdAt);
      timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (item.createdAt) {
      const matchDate = new Date(item.createdAt);
      timeString = matchDate.toLocaleDateString();
    }
    
    // Temporary active layout simulation
    const isActive = index === 1;

    return (
      <TouchableOpacity
        className={`flex-row items-center py-4 px-5 ${isActive ? 'bg-[#3A4A55]/40 border-y border-white/5' : ''}`}
        onPress={() => router.push({
            pathname: `/chat/${item._id}` as any,
            params: {
                petName: otherPet?.petName || 'Pet',
                ownerName: otherUser?.fullName || 'Owner'
            }
        })}
        activeOpacity={0.7}
      >
        <View className="relative mr-4 w-14 h-14 rounded-full overflow-hidden">
            <Image
            source={{ 
                uri: otherPet?.images && otherPet.images.length > 0 
                  ? `${BASE_URL}${otherPet.images[0].replace(/\\/g, '/')}` 
                  : (otherUser?.profileImage ? `${BASE_URL}${otherUser.profileImage}` : 'https://images.unsplash.com/photo-1552053831-71594a27632d') 
            }}
            className="w-full h-full"
            style={{ width: 56, height: 56 }}
            contentFit="cover"
            />
            {/* Soft inner shadow/glow simulating the design could be done via CSS or wrapper, keeping it clean for now */}
        </View>

        <View className="flex-1 justify-center">
            <Text className="text-[#DDE6F0] text-[17px] tracking-wide mb-1.5 flex-row">
                {otherUser?.fullName || 'Pet Owner'} 
                <Text className="text-[#DDE6F0] opacity-80"> ({otherPet?.petName ? `${otherPet.petName}'s owner` : 'Owner'})</Text>
            </Text>
            <Text className="text-[#888] text-[15px] tracking-wide font-normal" numberOfLines={1}>
                {messageText}
            </Text>
        </View>

        <View className="items-end justify-start h-full pl-2 pb-5">
            <Text className="text-[#888] text-[13px] tracking-wider uppercase">
                {timeString}
            </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <LinearGradient colors={["#0E1514", "#4D4639"]} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
        <ActivityIndicator size="large" color="#D8C4A0" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#0E1514", "#4D4639"]} style={{ flex: 1, paddingTop: 56 }} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
      {/* Header Toggle */}
      <View className="px-5 mb-6 mt-2">
        <View className="bg-[#3A4A55]/60 rounded-[30px] flex-row p-1 border border-white/5">
            <TouchableOpacity
                onPress={() => setSelectedTab("Find Mate Chats")}
                className={`flex-1 py-3.5 rounded-[25px] items-center ${
                    selectedTab === "Find Mate Chats" ? "bg-primary" : ""
                }`}
            >
                <Text className={`text-[15px] tracking-wide ${
                    selectedTab === "Find Mate Chats" ? "text-[#3B2F15] font-semibold" : "text-[#DDE6F0]/70 font-medium"
                }`}>
                    Find Mate Chats
                </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
                onPress={() => setSelectedTab("Play Date Chats")}
                className={`flex-1 py-3.5 rounded-[25px] items-center ${
                    selectedTab === "Play Date Chats" ? "bg-primary" : ""
                }`}
            >
                <Text className={`text-[15px] tracking-wide ${
                    selectedTab === "Play Date Chats" ? "text-[#3B2F15] font-semibold" : "text-[#DDE6F0]/70 font-medium"
                }`}>
                    Play Date Chats
                </Text>
            </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <View className="flex-1 mt-2">
        {matches.filter(m => m.category === selectedTab.replace(" Chats", "")).length > 0 ? (
            <FlatList
            data={matches.filter(m => m.category === selectedTab.replace(" Chats", ""))}
            keyExtractor={(item) => item._id}
            renderItem={renderMatchItem}
            className="flex-1"
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D8C4A0" />
            }
            />
        ) : (
            <View className="flex-1 justify-center items-center px-10 pb-20">
            <View className="bg-[#3A4A55]/30 p-8 rounded-full mb-5">
                <Ionicons name="chatbubbles-outline" size={50} color="#D8C4A0" />
            </View>
            <Text className="text-[#DDE6F0] text-xl font-semibold mb-2">No chats yet</Text>
            <Text className="text-[#888] text-center text-base leading-6">
                When you match with others, your conversations will appear here.
            </Text>
            <TouchableOpacity
                className="bg-primary px-8 py-3.5 rounded-full mt-6"
                onPress={() => router.push('/(tabs)/' as any)}
            >
                <Text className="text-[#3B2F15] font-semibold">Start Swiping</Text>
            </TouchableOpacity>
            </View>
        )}
      </View>
    </LinearGradient>
  );
}
