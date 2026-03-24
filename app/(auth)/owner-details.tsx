import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    ActivityIndicator
} from "react-native";
import { Image } from "expo-image";
import { API_URL } from "../../constants/api";
import { useAuth } from "../../context/AuthContext";
import { getUploadableUri } from "../../utils/fileUpload";

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
    const { token } = useAuth();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission Denied", "We need your permission to access your gallery.");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        }
    };

    const handleAutoDetectLocation = async () => {
        setLoading(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            let reverseGeocode = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            if (reverseGeocode.length > 0) {
                const address = reverseGeocode[0];
                const detectedState = address.region || "";
                const detectedCity = address.city || address.district || address.subregion || "";

                if (detectedState) {
                    // Try to match with our list or set directly if it's a new state
                    setSelectedState(detectedState);
                    if (detectedCity) {
                        setSelectedCity(detectedCity);
                    }
                } else {
                    Alert.alert("Location Detected", `We found you in ${detectedCity}, but couldn't determine the state.`);
                }
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Could not detect location. Please try again or select manually.");
        } finally {
            setLoading(false);
        }
    };

    const handleNext = async () => {
        if (!fullName || !email || !selectedState || !selectedCity) {
            Alert.alert("Error", "Please fill in all required fields.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            Alert.alert("Error", "Please enter a valid email address.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("fullName", fullName);
            formData.append("email", email);
            formData.append("state", selectedState);
            formData.append("city", selectedCity);

            if (image) {
                const fileUri = await getUploadableUri(image);
                const filename = fileUri.split('/').pop() || `profile_${Date.now()}.jpg`;
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : "image/jpeg";
                // @ts-ignore - React Native FormData accepts { uri, name, type }
                formData.append("profileImage", { uri: fileUri, name: filename, type });
            }

            const response = await fetch(`${API_URL}/user/profile`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                router.replace("/(tabs)/" as any);
            } else {
                Alert.alert("Error", data.message || "Failed to save profile details");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Something went wrong. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

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
                    className="w-[70px] h-[70px] bg-[#1C2B35] rounded-xl justify-center items-center mb-8 overflow-hidden"
                    activeOpacity={0.8}
                    onPress={pickImage}
                >
                    {image ? (
                        <Image
                            source={{ uri: image }}
                            style={{ width: '100%', height: '100%' }}
                            contentFit="cover"
                        />
                    ) : (
                        <Ionicons name="add-circle-outline" size={28} color="#888" />
                    )}
                </TouchableOpacity>

                {/* Full Name */}
                <View className="mb-5">
                    <TextInput
                        className="text-[#DDE6F0] text-[15px] py-2"
                        placeholder="Full Name*"
                        placeholderTextColor="#888"
                        value={fullName}
                        onChangeText={(text) => {
                            // Allow only letters and spaces
                            const filteredText = text.replace(/[^a-zA-Z\s]/g, "");
                            setFullName(filteredText);
                        }}
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
                        maxLength={10}
                        onChangeText={(text) => {
                            const cleaned = text.replace(/[^0-9]/g, "");
                            setPhone(cleaned);
                        }}
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

                {/* Auto detect 
                <TouchableOpacity 
                    className="items-center mt-5" 
                    activeOpacity={0.7}
                    onPress={handleAutoDetectLocation}
                    disabled={loading}
                >
                    <Text className="text-[#7ED6D1] text-[15px]">
                        {loading ? "Detecting..." : "Auto detect location"}
                    </Text>
                </TouchableOpacity> */}

                <View className="h-24" />
            </ScrollView>

            {/* Next Button */}
            <View className="absolute bottom-0 left-0 right-0 px-6 pb-10 bg-[#07141D]">
                <TouchableOpacity
                    className="bg-primary py-4 rounded-full items-center"
                    onPress={handleNext}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#001F2B" />
                    ) : (
                        <Text className="text-[#001F2B] font-bold text-base">Next</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

