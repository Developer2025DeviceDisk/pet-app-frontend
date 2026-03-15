import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

import Swiper from "react-native-deck-swiper";
import { API_URL, BASE_URL } from "../../constants/api";
import { useAuth } from "../../context/AuthContext";

const { height } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const { token, user } = useAuth();
  const [selectedGoal, setSelectedGoal] = useState("Find Mate");
  const [pets, setPets] = useState<any[]>([]);
  const [myPets, setMyPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    breed,
    gender,
    ageRange,
    healthBadge,
    temperament,
    distance
  } = searchParams;

  const [lastParams, setLastParams] = useState("");

  useEffect(() => {
    const fetchMyPets = async () => {
      try {
        const response = await fetch(`${API_URL}/pet/my-pets`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setMyPets(data.pets);
        }
      } catch (error) {
        console.error("Error fetching my pets", error);
      }
    };
    if (token) {
        fetchMyPets();
    }

    const currentParams = JSON.stringify({ breed, gender, ageRange, healthBadge, temperament, distance });
    if (currentParams !== lastParams) {
      fetchPets();
      setLastParams(currentParams);
    }
  }, [breed, gender, ageRange, healthBadge, temperament, distance, token]);

  const fetchPets = async () => {
    setLoading(true);
    try {
      // Build query string manually for better stability
      let queryStr = "";
      const params = [];
      if (breed) params.push(`breed=${encodeURIComponent(breed as string)}`);
      if (gender) params.push(`gender=${encodeURIComponent(gender as string)}`);
      if (ageRange) params.push(`ageRange=${encodeURIComponent(ageRange as string)}`);
      if (healthBadge) params.push(`healthBadge=${encodeURIComponent(healthBadge as string)}`);
      if (temperament) params.push(`temperament=${encodeURIComponent(temperament as string)}`);

      if (params.length > 0) {
        queryStr = `?${params.join("&")}`;
      }

      const response = await fetch(`${API_URL}/pet${queryStr}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        console.log("Fetched pets successfully, count:", data.pets.length);
        if (data.pets.length > 0 && data.pets[0].images) {
          console.log("Sample Image URL:", `${BASE_URL}${data.pets[0].images[0]}`);
        }
        setPets(data.pets);
      }
    } catch (error) {
      console.error("Error fetching pets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (petId: string) => {
    try {
      const response = await fetch(`${API_URL}/pet/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ petId, category: selectedGoal }),
      });
      const data = await response.json();
      if (data.success && data.isMatch) {
        // Navigate to match success screen
        router.push({
          pathname: "/match-success" as any,
          params: {
            matchedPetName: data.matchedPet.petName,
            matchedPetImage: data.matchedPet.images[0],
            ownerName: data.matchedPet.owner.fullName,
            matchId: data.match._id
          }
        });
      }
    } catch (error) {
      console.error("Error liking pet:", error);
    }
  };


  return (
    <LinearGradient
      colors={["#0E1514", "#4D4639"]}
      style={{ flex: 1, paddingHorizontal: 20, paddingTop: 8 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-full overflow-hidden mr-3 border-2 border-[#7ED6D1]">
            <Image
              source={{
                uri: myPets && myPets.length > 0 && myPets[0].images && myPets[0].images.length > 0
                  ? `${BASE_URL}${myPets[0].images[0].replace(/\\/g, '/')}`
                  : user?.profileImage
                    ? `${BASE_URL}${user.profileImage}`
                    : "https://images.unsplash.com/photo-1552053831-71594a27632d"
              }}
              className="w-full h-full"
              style={{ width: 48, height: 48 }}
              contentFit="cover"
            />
          </View>

          <View>
            <Text className="text-[#DDE6F0] text-sm opacity-80">Find perfect match for your pets</Text>
            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={14} color="#7ED6D1" />
              <Text className="text-[#DDE6F0] text-base font-semibold ml-1">{user?.location || "India"}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/filter")}
          className="bg-[#1C2C35] w-12 h-12 rounded-full items-center justify-center">
          <Ionicons name="options-outline" size={24} color="#DDE6F0" />
        </TouchableOpacity>
      </View>

      {/* Goal Toggle */}
      <View className="bg-[#1C2C35] rounded-full flex-row p-1 ">
        <TouchableOpacity
          onPress={() => setSelectedGoal("Find Mate")}
          className={`flex-1 py-3 rounded-full items-center ${selectedGoal === "Find Mate" ? "bg-[#D8C4A0] border border-[#B2C8E840]" : ""
            }`}
        >
          <Text className={selectedGoal === "Find Mate" ? "text-[#3B2F15] font-semibold" : "text-[#DDE6F0] opacity-60"}>
            Find Mate
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedGoal("Play Date")}
          className={`flex-1 py-3 rounded-full items-center ${selectedGoal === "Play Date" ? "bg-[#D8C4A0] border border-[#B2C8E840]" : ""
            }`}
        >
          <Text className={selectedGoal === "Play Date" ? "text-[#3B2F15] font-semibold" : "text-[#DDE6F0] opacity-60"}>
            Play Date
          </Text>
        </TouchableOpacity>
      </View>

      {/* Swiper Container */}
      <View className="flex-1 -mx-5  bg-transparent">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#7ED6D1" />
          </View>
        ) : pets && pets.length > 0 ? (
          <Swiper
            key={`swiper-${lastParams}-${pets.length}`} // Force remount only when filters or data length actually change
            cards={pets}
            renderCard={(card) => {
              if (!card) return null;
              return (
                <View className="bg-[#1C2C35] rounded-3xl overflow-hidden h-[380px] shadow-xl border border-[#3A4A55]">
                  {/* Fallback Icon */}
                  <View className="absolute inset-0 items-center justify-center opacity-10">
                    <Ionicons name="paw-outline" size={80} color="#7ED6D1" />
                  </View>

                  <View className="flex-1 items-center justify-center">
                    <View className="w-full h-full overflow-hidden bg-[#07141D]">
                      <Image
                        source={{
                          uri: card.images && card.images.length > 0
                            ? `${BASE_URL}${card.images[0].replace(/\\/g, '/')}`
                            : "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e"
                        }}
                        style={{ width: '100%', height: '100%' }}
                        contentFit="cover"
                        transition={500}
                        cachePolicy="disk"
                      />
                    </View>
                  </View>

                  {/* Breed Badge */}
                  <View className="absolute top-4 right-4 bg-[#7ED6D1]/20 px-3 py-1  border border-[#7ED6D1]/30">
                    <Text className="text-[#7ED6D1] text-xs font-bold">{card.breed}</Text>
                  </View>

                  {/* Info Section */}
                  <View className="p-6 bg-[#1C2C35] border-t border-[#3A4A55]">
                    <View className="flex-row justify-between items-center mb-3">
                      <View className="flex-row items-center">
                        <Text className="text-white text-2xl font-bold mr-2">
                          {card.petName}, {card.age}
                        </Text>
                        <View className="bg-green-500 rounded-full p-0.5">
                          <Ionicons name="checkmark" size={14} color="white" />
                        </View>
                      </View>
                      <View className="flex-row items-center bg-[#07141D] px-3 py-1 rounded-full border border-[#3A4A55]">
                        <Ionicons name="male-female" size={14} color="#7ED6D1" />
                        <Text className="text-[#DDE6F0] text-xs ml-1 font-medium">{card.gender}</Text>
                      </View>
                    </View>

                    <View className="flex-row items-center">
                      <View className="flex-row items-center bg-[#07141D] px-3 py-1 rounded-full mr-2">
                        <Ionicons name="location-outline" size={14} color="#7ED6D1" />
                        <Text className="text-[#DDE6F0] text-xs ml-1 font-medium">
                          {card.owner?.city ? `${card.owner.city}, ${card.owner.state}` : "Nearby"}
                        </Text>
                      </View>
                      <View className="flex-row items-center bg-[#07141D] px-3 py-1 rounded-full">
                        <Ionicons name="heart-half-outline" size={14} color="#7ED6D1" />
                        <Text className="text-[#DDE6F0] text-xs ml-1 font-medium">
                          {card.temperament || "Friendly"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )
            }}
            onSwipedRight={(cardIndex) => {
              const likedPet = pets[cardIndex];
              if (likedPet) {
                handleLike(likedPet._id);
              }
            }}
            onSwiped={(cardIndex) => { console.log("Swiped index:", cardIndex); }}
            onSwipedAll={() => { console.log('All cards swiped'); }}
            cardIndex={0}
            backgroundColor={'transparent'}
            stackSize={3}
            stackSeparation={15}
            disableBottomSwipe
            overlayLabels={{
              left: {
                title: 'NOPE',
                style: {
                  label: {
                    backgroundColor: 'rgba(239, 68, 68, 0.8)',
                    borderColor: '#ef4444',
                    color: 'white',
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: 10
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start',
                    marginTop: 30,
                    marginLeft: -30
                  }
                }
              },
              right: {
                title: 'LIKE',
                style: {
                  label: {
                    backgroundColor: 'rgba(34, 197, 94, 0.8)',
                    borderColor: '#22c55e',
                    color: 'white',
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: 10
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    marginTop: 30,
                    marginLeft: 30
                  }
                }
              }
            }}
            animateCardOpacity
            swipeBackCard
          />
        ) : (
          <View className="flex-1 justify-center items-center px-10">
            <View className="bg-[#1C2C35] p-10 rounded-full mb-6 border border-[#3A4A55]">
              <Ionicons name="paw-outline" size={64} color="#7ED6D1" />
            </View>
            <Text className="text-[#DDE6F0] text-xl font-bold mt-4">No pets found</Text>
            <Text className="text-[#DDE6F0] opacity-60 text-center mt-2 leading-6">
              Adjust your filters or distance range to explore more pets nearby.
            </Text>
          </View>
        )}
      </View>


      {/* Action Buttons */}
      <View className="flex-row justify-center items-center gap-6 mb-10">
        <TouchableOpacity className="bg-[#3A4A55] w-14 h-14 rounded-full items-center justify-center border border-[#3A4A55] shadow-lg">
          <Ionicons name="close" size={28} color="#DDE6F0" />
        </TouchableOpacity>

        {/* <TouchableOpacity className="bg-[#7ED6D1] w-14 h-14 rounded-full items-center justify-center shadow-lg shadow-[#7ED6D1]/30">
          <Ionicons name="flash" size={28} color="#001F2B" />
        </TouchableOpacity> */}

        <TouchableOpacity className="bg-[#FF4D67] w-14 h-14 rounded-full items-center justify-center shadow-lg shadow-[#FF4D67]/30">
          <Ionicons name="heart" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

