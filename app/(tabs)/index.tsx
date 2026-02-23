import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Swiper from "react-native-deck-swiper";

const { height } = Dimensions.get("window");

const PETS = [
  {
    id: 1,
    name: "Mari",
    age: 11,
    breed: "Great Danes",
    location: "Coimbatore",
    distance: "<5 miles away",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e", // Using a placeholder image for a large dog
    verified: true,
  },
  {
    id: 2,
    name: "Sheru",
    age: 3,
    breed: "Labrador",
    location: "Coimbatore",
    distance: "2 miles away",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d",
    verified: true,
  },
  {
    id: 3,
    name: "Bella",
    age: 5,
    breed: "Golden Retriever",
    location: "Coimbatore",
    distance: "10 miles away",
    image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8",
    verified: true,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState("Find Mate");

  return (
    <View className="flex-1 bg-bg px-5 pt-12">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-row items-center">
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1552053831-71594a27632d" }}
            className="w-12 h-12 rounded-full mr-3 border-2 border-teal"
          />
          <View>
            <Text className="text-light text-sm opacity-80">Find perfect match for Sheru</Text>
            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={14} color="#7ED6D1" />
              <Text className="text-light text-base font-semibold ml-1">Coimbatore</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity className="bg-card w-12 h-12 rounded-full items-center justify-center">
          <Ionicons name="options-outline" size={24} color="#DDE6F0" />
        </TouchableOpacity>
      </View>

      {/* Goal Toggle */}
      <View className="bg-card rounded-full flex-row p-1 mb-8">
        <TouchableOpacity
          onPress={() => setSelectedGoal("Find Mate")}
          className={`flex-1 py-3 rounded-full items-center ${selectedGoal === "Find Mate" ? "bg-[#B2C8E820] border border-[#B2C8E840]" : ""
            }`}
          style={selectedGoal === "Find Mate" ? { backgroundColor: "#B2C8E820" } : {}}
        >
          <Text className={selectedGoal === "Find Mate" ? "text-teal font-semibold" : "text-light opacity-60"}>
            Find Mate
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedGoal("Play Date")}
          className={`flex-1 py-3 rounded-full items-center ${selectedGoal === "Play Date" ? "bg-[#B2C8E820] border border-[#B2C8E840]" : ""
            }`}
          style={selectedGoal === "Play Date" ? { backgroundColor: "#B2C8E820" } : {}}
        >
          <Text className={selectedGoal === "Play Date" ? "text-teal font-semibold" : "text-light opacity-60"}>
            Play Date
          </Text>
        </TouchableOpacity>
      </View>

      {/* Swiper Container */}
      <View className="flex-1 -mx-5">
        <Swiper
          cards={PETS}
          renderCard={(card) => (
            <View className="bg-card rounded-3xl overflow-hidden h-[450px] shadow-xl border border-separator">
              <Image source={{ uri: card.image }} className="w-full h-full" resizeMode="cover" />

              {/* Breed Badge */}
              <View className="absolute top-4 right-4 bg-black/40 px-3 py-1 rounded-full">
                <Text className="text-white text-xs">{card.breed}</Text>
              </View>

              {/* Bottom Info Overlay */}
              <View className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 to-transparent">
                <View className="flex-row items-center mb-1">
                  <Text className="text-white text-2xl font-bold mr-2">
                    {card.name}, {card.age}
                  </Text>
                  {card.verified && (
                    <View className="bg-green-500 rounded-full p-0.5">
                      <Ionicons name="checkmark" size={14} color="white" />
                    </View>
                  )}
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="location-outline" size={14} color="#fff" style={{ opacity: 0.8 }} />
                  <Text className="text-white text-sm opacity-80 ml-1">
                    {card.location}  {card.distance}
                  </Text>
                </View>
              </View>
            </View>
          )}
          onSwiped={(cardIndex) => { console.log(cardIndex); }}
          onSwipedAll={() => { console.log('onSwipedAll'); }}
          cardIndex={0}
          backgroundColor={'transparent'}
          stackSize={3}
          stackSeparation={15}
          overlayLabels={{
            left: {
              title: 'NOPE',
              style: {
                label: {
                  backgroundColor: 'red',
                  borderColor: 'red',
                  color: 'white',
                  borderWidth: 1
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
                  backgroundColor: 'green',
                  borderColor: 'green',
                  color: 'white',
                  borderWidth: 1
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
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-center items-center gap-6 mb-10">
        <TouchableOpacity className="bg-[#3A4A55] w-14 h-14 rounded-full items-center justify-center border border-separator shadow-lg">
          <Ionicons name="close" size={28} color="#DDE6F0" />
        </TouchableOpacity>

        <TouchableOpacity className="bg-teal w-14 h-14 rounded-full items-center justify-center shadow-lg shadow-teal/30">
          <Ionicons name="flash" size={28} color="#001F2B" />
        </TouchableOpacity>

        <TouchableOpacity className="bg-[#FF4D67] w-14 h-14 rounded-full items-center justify-center shadow-lg shadow-[#FF4D67]/30">
          <Ionicons name="heart" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
