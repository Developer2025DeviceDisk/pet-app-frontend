import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const GOALS = ["Find Mate", "Play Date", "Both"];
const BREEDS = ["Labrador", "Golden Retriever", "Poodle", "Bulldog", "Beagle", "Other"];
const GENDERS = ["Male", "Female"];
const AGES = ["< 1 year", "1 year", "2 years", "3 years", "4 years", "5+ years"];
const HEALTH_BADGES = ["Vaccinated", "Neutered", "Healthy", "Special Care"];
const TEMPERAMENTS = ["Calm", "Playful", "Aggressive", "Friendly", "Shy"];

export default function PetDetails() {
    const router = useRouter();

    const [selectedGoal, setSelectedGoal] = useState("Find Mate");
    const [petName, setPetName] = useState("");
    const [breed, setBreed] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const [healthBadge, setHealthBadge] = useState("");
    const [temperament, setTemperament] = useState("");
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const toggleDropdown = (field: string) =>
        setOpenDropdown(openDropdown === field ? null : field);

    const selectOption = (field: string, value: string) => {
        if (field === "breed") setBreed(value);
        if (field === "gender") setGender(value);
        if (field === "age") setAge(value);
        if (field === "health") setHealthBadge(value);
        if (field === "temperament") setTemperament(value);
        setOpenDropdown(null);
    };

    const renderDropdown = (
        field: string,
        placeholder: string,
        value: string,
        options: string[]
    ) => (
        <View className="mb-4">
            <TouchableOpacity
                className="flex-row justify-between items-center py-3"
                onPress={() => toggleDropdown(field)}
                activeOpacity={0.8}
            >
                <Text className={value ? "text-[#DDE6F0] text-[15px]" : "text-[#888] text-[15px]"}>
                    {value || placeholder}
                </Text>
                <Ionicons
                    name={openDropdown === field ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="#888"
                />
            </TouchableOpacity>
            <View className="h-px bg-[#2A3A45]" />
            {openDropdown === field && (
                <View className="bg-[#1C2B35] rounded-lg mt-1 overflow-hidden">
                    {options.map((opt) => (
                        <TouchableOpacity
                            key={opt}
                            className="px-4 py-3 border-b border-[#2A3A45]"
                            onPress={() => selectOption(field, opt)}
                        >
                            <Text className="text-[#DDE6F0] text-sm">{opt}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );

    return (
        <View className="flex-1 bg-[#07141D]">
            <ScrollView
                contentContainerStyle={{ padding: 25, paddingTop: 60 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Title */}
                <Text className="text-[#7ED6D1] text-[28px] font-bold mb-2 leading-9">
                    Please share some{"\n"}details of pet
                </Text>

                <Text className="text-[#888] text-[13px] mb-5">
                    Make sure the images of pet to be clear*
                </Text>

                {/* Image Upload Row */}
                <View className="flex-row gap-3 mb-8">
                    {[0, 1, 2, 3].map((i) => (
                        <TouchableOpacity
                            key={i}
                            className="w-[70px] h-[70px] bg-[#1C2B35] rounded-xl justify-center items-center"
                            activeOpacity={0.8}
                        >
                            <Ionicons name="add-circle-outline" size={28} color="#888" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Primary Goal */}
                <Text className="text-[#7ED6D1] text-base font-semibold mb-4">
                    Primary Goal
                </Text>
                <View className="flex-row gap-3 mb-7">
                    {GOALS.map((g) => (
                        <TouchableOpacity
                            key={g}
                            className={`px-4 py-2 rounded-full border ${selectedGoal === g
                                    ? "border-[#7ED6D1]"
                                    : "border-[#3A4A55]"
                                }`}
                            onPress={() => setSelectedGoal(g)}
                        >
                            <Text
                                className={
                                    selectedGoal === g
                                        ? "text-[#DDE6F0] font-semibold text-sm"
                                        : "text-[#888] text-sm"
                                }
                            >
                                {g}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Pet Name */}
                <View className="mb-5">
                    <TextInput
                        className="text-[#DDE6F0] text-[15px] py-2"
                        placeholder="Pet Name*"
                        placeholderTextColor="#888"
                        value={petName}
                        onChangeText={setPetName}
                    />
                    <View className="h-px bg-[#2A3A45]" />
                </View>

                {renderDropdown("breed", "Pet Breed*", breed, BREEDS)}
                {renderDropdown("gender", "Pet Gender*", gender, GENDERS)}
                {renderDropdown("age", "Pet Age*", age, AGES)}
                {renderDropdown("health", "Health Badge*", healthBadge, HEALTH_BADGES)}
                {renderDropdown("temperament", "Pet Temperament*", temperament, TEMPERAMENTS)}

                <View className="h-24" />
            </ScrollView>

            {/* Next Button */}
            <View className="absolute bottom-0 left-0 right-0 px-6 pb-10 bg-[#07141D]">
                <TouchableOpacity
                    className="bg-[#7ED6D1] py-4 rounded-full items-center"
                    onPress={() => router.push("/(auth)/owner-details")}
                >
                    <Text className="text-[#001F2B] font-bold text-base">Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
