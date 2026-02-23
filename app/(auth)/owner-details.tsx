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

const STATES = [
    "Andhra Pradesh", "Delhi", "Gujarat", "Karnataka",
    "Maharashtra", "Rajasthan", "Tamil Nadu", "Uttar Pradesh", "West Bengal",
];

const CITIES: Record<string, string[]> = {
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
    "Karnataka": ["Bengaluru", "Mysuru", "Hubli", "Mangaluru"],
    "Delhi": ["New Delhi", "Dwarka", "Rohini", "Saket"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri"],
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
};

export default function OwnerDetails() {
    const router = useRouter();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const toggleDropdown = (field: string) =>
        setOpenDropdown(openDropdown === field ? null : field);

    const selectState = (value: string) => {
        setSelectedState(value);
        setSelectedCity("");
        setOpenDropdown(null);
    };

    const selectCity = (value: string) => {
        setSelectedCity(value);
        setOpenDropdown(null);
    };

    const cityOptions = selectedState ? (CITIES[selectedState] || []) : [];

    return (
        <View className="flex-1 bg-[#07141D]">
            <ScrollView
                contentContainerStyle={{ padding: 25, paddingTop: 60 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Back Button */}
                <TouchableOpacity onPress={() => router.back()} className="mb-7">
                    <Ionicons name="arrow-back" size={24} color="#DDE6F0" />
                </TouchableOpacity>

                {/* Title */}
                <Text className="text-[#7ED6D1] text-[28px] font-bold mb-2 leading-9">
                    Please share details of{"\n"}yours profile
                </Text>

                <Text className="text-[#888] text-[13px] mb-5">
                    Make sure the profile images to be clear*
                </Text>

                {/* Image Upload */}
                <TouchableOpacity
                    className="w-[70px] h-[70px] bg-[#1C2B35] rounded-xl justify-center items-center mb-8"
                    activeOpacity={0.8}
                >
                    <Ionicons name="add-circle-outline" size={28} color="#888" />
                </TouchableOpacity>

                {/* Full Name */}
                <View className="mb-5">
                    <TextInput
                        className="text-[#DDE6F0] text-[15px] py-2"
                        placeholder="Full Name*"
                        placeholderTextColor="#888"
                        value={fullName}
                        onChangeText={setFullName}
                    />
                    <View className="h-px bg-[#2A3A45]" />
                </View>

                {/* Email */}
                <View className="mb-5">
                    <TextInput
                        className="text-[#DDE6F0] text-[15px] py-2"
                        placeholder="Email*"
                        placeholderTextColor="#888"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <View className="h-px bg-[#2A3A45]" />
                </View>

                {/* Phone */}
                <View className="flex-row items-center py-2 mb-1">
                    <View className="flex-row items-center mr-3 gap-1">
                        <Text className="text-[#DDE6F0] text-[15px]">IND +91</Text>
                        <Ionicons name="chevron-down" size={14} color="#888" />
                    </View>
                    <View className="w-px h-5 bg-[#2A3A45] mr-3" />
                    <TextInput
                        className="flex-1 text-[#DDE6F0] text-[15px]"
                        placeholder="Phone Number"
                        placeholderTextColor="#888"
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                    />
                </View>
                <View className="h-px bg-[#2A3A45] mb-6" />

                {/* Location */}
                <Text className="text-[#7ED6D1] text-base font-semibold mt-2 mb-2">
                    Your Location
                </Text>

                {/* State Dropdown */}
                <View className="mb-1">
                    <TouchableOpacity
                        className="flex-row justify-between items-center py-3"
                        onPress={() => toggleDropdown("state")}
                        activeOpacity={0.8}
                    >
                        <Text className={selectedState ? "text-[#DDE6F0] text-[15px]" : "text-[#888] text-[15px]"}>
                            {selectedState || "State*"}
                        </Text>
                        <Ionicons
                            name={openDropdown === "state" ? "chevron-up" : "chevron-down"}
                            size={18}
                            color="#888"
                        />
                    </TouchableOpacity>
                    <View className="h-px bg-[#2A3A45]" />
                    {openDropdown === "state" && (
                        <View className="bg-[#1C2B35] rounded-lg mt-1 overflow-hidden">
                            {STATES.map((s) => (
                                <TouchableOpacity
                                    key={s}
                                    className="px-4 py-3 border-b border-[#2A3A45]"
                                    onPress={() => selectState(s)}
                                >
                                    <Text className="text-[#DDE6F0] text-sm">{s}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* City Dropdown */}
                <View className="mb-1">
                    <TouchableOpacity
                        className="flex-row justify-between items-center py-3"
                        onPress={() => selectedState && toggleDropdown("city")}
                        activeOpacity={0.8}
                    >
                        <Text className={selectedCity ? "text-[#DDE6F0] text-[15px]" : "text-[#888] text-[15px]"}>
                            {selectedCity || "City*"}
                        </Text>
                        <Ionicons
                            name={openDropdown === "city" ? "chevron-up" : "chevron-down"}
                            size={18}
                            color="#888"
                        />
                    </TouchableOpacity>
                    <View className="h-px bg-[#2A3A45]" />
                    {openDropdown === "city" && (
                        <View className="bg-[#1C2B35] rounded-lg mt-1 overflow-hidden">
                            {cityOptions.map((c) => (
                                <TouchableOpacity
                                    key={c}
                                    className="px-4 py-3 border-b border-[#2A3A45]"
                                    onPress={() => selectCity(c)}
                                >
                                    <Text className="text-[#DDE6F0] text-sm">{c}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* Auto detect */}
                <TouchableOpacity className="items-center mt-5" activeOpacity={0.7}>
                    <Text className="text-[#7ED6D1] text-[15px]">Auto detect location</Text>
                </TouchableOpacity>

                <View className="h-24" />
            </ScrollView>

            {/* Next Button */}
            <View className="absolute bottom-0 left-0 right-0 px-6 pb-10 bg-[#07141D]">
                <TouchableOpacity
                    className="bg-[#7ED6D1] py-4 rounded-full items-center"
                    onPress={() => router.push("/(tabs)")}
                >
                    <Text className="text-[#001F2B] font-bold text-base">Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
