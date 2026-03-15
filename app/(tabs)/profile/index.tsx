import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../../context/AuthContext';
import { BASE_URL, API_URL } from '../../../constants/api';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, token, logout } = useAuth();
  const [pets, setPets] = useState<any[]>([]);

  useEffect(() => {
    const fetchMyPets = async () => {
      try {
        const response = await fetch(`${API_URL}/pet/my-pets`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setPets(data.pets);
        }
      } catch (error) {
        console.error("Error fetching my pets", error);
      }
    };
    if (token) fetchMyPets();
  }, [token]);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login' as any);
  };

  const getPetNamesStr = () => {
    if (pets.length === 0) return "Add your first pet";
    const names = pets.map(p => p.petName).join(', ');
    return names.length > 20 ? names.substring(0, 18) + '...' : names;
  };

  return (
    <LinearGradient
      colors={["#0E1514", "#4D4639"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40, paddingTop: 60 }} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View className="flex-row items-center px-6 mb-8 mt-4">
          
          {/* Overlapping Avatars Header */}
          <View className="flex-row mr-4 relative w-[100px] h-[75px]">
            {/* User Avatar (Back left) */}
            <View className="absolute left-0 top-0 w-16 h-16 rounded-full overflow-hidden border-2 border-[#1C1F22] z-10">
              <Image
                source={{ uri: user?.profileImage ? `${BASE_URL}${user.profileImage}` : 'https://images.unsplash.com/photo-1552053831-71594a27632d' }}
                className="w-full h-full"
                contentFit="cover"
              />
            </View>
            
            {/* Pet 1 Avatar (Middle right) */}
            {pets.length > 0 && (
              <View className="absolute left-8 top-0 w-16 h-16 rounded-full overflow-hidden border-2 border-[#1C1F22] z-20 shadow-lg shadow-[#EAC16C]/20">
                <Image
                  source={{ uri: pets[0].images && pets[0].images.length > 0 ? `${BASE_URL}${pets[0].images[0].replace(/\\/g, '/')}` : 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e' }}
                  className="w-full h-full"
                  contentFit="cover"
                />
              </View>
            )}

            {/* + Count Badge (Front right) */}
            {pets.length > 1 && (
              <View className="absolute left-16 top-2 w-[48px] h-[48px] rounded-full bg-[#EFECE8] border-2 border-[#1C1F22] z-30 justify-center items-center shadow-lg">
                <Text className="text-[#3B2F15] font-semibold text-sm">{pets.length - 1}+</Text>
              </View>
            )}
          </View>

          {/* Title and Edit Link */}
          <View className="flex-1 justify-center ml-2">
            <Text className="text-[#DDE6F0] text-lg font-semibold mb-1" numberOfLines={1}>
              My Pets - {getPetNamesStr()}
            </Text>
            <TouchableOpacity onPress={() => router.push('/profile/edit' as any)}>
              <Text className="text-[#EAC16C] text-sm tracking-wide">Update Pet Profiles</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Thin Divider Line */}
        <View className="h-px bg-[#3A4A55]/40 mx-6 mb-8" />

        {/* Menu Items */}
        <View className="px-6">
          <MenuLink icon="person-outline" label="My Profile" onPress={() => router.push('/profile/edit' as any)} />
          <MenuLink icon="ban-outline" label="Blocked Chats" onPress={() => {}} />
          <MenuLink icon="help-circle-outline" label="Help" onPress={() => {}} />
          <MenuLink icon="sunny-outline" label="Light/Dark Mode" onPress={() => {}} />
          <MenuLink icon="information-circle-outline" label="Privacy & Policy" onPress={() => {}} />
          <MenuLink icon="information-circle-outline" label="About Us" onPress={() => {}} />
          
          <MenuLink icon="log-out-outline" label="Logout" onPress={handleLogout} isLast />
        </View>

      </ScrollView>
    </SafeAreaView>
  </LinearGradient>
  );
}

// Reusable elegant menu item
const MenuLink = ({ icon, label, onPress, isLast = false }: { icon: any, label: string, onPress: () => void, isLast?: boolean }) => (
  <TouchableOpacity 
    className={`flex-row justify-between items-center py-5 ${!isLast ? 'border-b border-[#3A4A55]/0' : ''}`}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View className="flex-row items-center">
      <Ionicons name={icon} size={22} color="#DDE6F0" style={{ opacity: 0.8 }} />
      <Text className="text-[#DDE6F0] text-[17px] font-normal tracking-wide ml-4">{label}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#DDE6F0" style={{ opacity: 0.5 }} />
  </TouchableOpacity>
);
