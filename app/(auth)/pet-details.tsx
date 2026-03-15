import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    ActivityIndicator,
    Modal,
    FlatList,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { Image } from "expo-image";
import { API_URL } from "../../constants/api";
import { useAuth } from "../../context/AuthContext";
import { DOG_BREEDS } from "../../constants/breeds";
import { getUploadableUri } from "../../utils/fileUpload";

const GOALS = ["Find Mate", "Play Date", "Both"];
const GENDERS = ["Male", "Female"];
const AGES = ["< 1 year", "1 year", "2 years", "3 years", "4 years", "5+ years"];
const HEALTH_BADGES = ["Vaccinated", "Neutered", "Healthy", "Special Care"];
const TEMPERAMENTS = ["Calm", "Playful", "Aggressive", "Friendly", "Shy"];

export default function PetDetails() {
    const router = useRouter();
    const { token } = useAuth();

    const [selectedGoal, setSelectedGoal] = useState("Find Mate");
    const [petName, setPetName] = useState("");
    const [breed, setBreed] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const [healthBadge, setHealthBadge] = useState("");
    const [temperament, setTemperament] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [breedModalVisible, setBreedModalVisible] = useState(false);
    const [breedSearch, setBreedSearch] = useState("");

    const pickImage = async () => {
        if (images.length >= 4) {
            Alert.alert("Limit Reached", "You can only upload up to 4 images.");
            return;
        }

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            Alert.alert("Permission Denied", "Gallery permission is required.");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 0.8,
        });

        if (!result.canceled && result.assets?.length > 0) {
            setImages([...images, result.assets[0].uri]);
        }
    };

    const handleNext = async () => {
        if (!petName || !breed || !gender || !age) {
            Alert.alert("Error", "Please fill in all required fields.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("petName", petName);
            formData.append("breed", breed);
            formData.append("gender", gender);
            formData.append("age", age);
            formData.append("healthBadge", healthBadge);
            formData.append("temperament", temperament);
            formData.append("goal", selectedGoal);

            for (const uri of images) {
                const fileUri = await getUploadableUri(uri);
                const filename = fileUri.split('/').pop() || `image_${Date.now()}.jpg`;
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : "image/jpeg";
                // @ts-ignore - React Native FormData accepts { uri, name, type }
                formData.append("images", { uri: fileUri, name: filename, type });
            }

            const response = await fetch(`${API_URL}/pet`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                router.push("/(auth)/owner-details");
            } else {
                Alert.alert("Error", data.message || "Failed to save pet details");
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
                onPress={() => {
                    if (field === "breed") {
                        setBreedSearch("");
                        setBreedModalVisible(true);
                    } else {
                        toggleDropdown(field);
                    }
                }}
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
            {openDropdown === field && field !== "breed" && (
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

    const filteredBreeds = DOG_BREEDS.filter(b => b.toLowerCase().includes(breedSearch.toLowerCase()));

    const renderBreedModal = () => (
        <Modal
            visible={breedModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setBreedModalVisible(false)}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1 bg-black/90 justify-end"
            >
                <View className="bg-[#07141D] h-[80%] rounded-t-3xl p-5 border-t border-[#3A4A55]">
                    <View className="flex-row justify-between items-center mb-5">
                        <Text className="text-[#EAC16C] text-xl font-bold">Select Breed</Text>
                        <TouchableOpacity onPress={() => setBreedModalVisible(false)}>
                            <Ionicons name="close" size={28} color="#888" />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center bg-[#1C2B35] rounded-xl px-4 py-2 mb-4 border border-[#2A3A45]">
                        <Ionicons name="search" size={20} color="#888" />
                        <TextInput
                            className="flex-1 text-[#DDE6F0] text-base ml-2 py-2"
                            placeholder="Search breed..."
                            placeholderTextColor="#888"
                            value={breedSearch}
                            onChangeText={setBreedSearch}
                            autoCorrect={false}
                        />
                        {breedSearch.length > 0 && (
                            <TouchableOpacity onPress={() => setBreedSearch("")}>
                                <Ionicons name="close-circle" size={18} color="#888" />
                            </TouchableOpacity>
                        )}
                    </View>

                    <FlatList
                        data={filteredBreeds}
                        keyExtractor={(item) => item}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                className={`py-4 border-b border-[#2A3A45] flex-row justify-between items-center`}
                                onPress={() => {
                                    selectOption("breed", item);
                                    setBreedModalVisible(false);
                                }}
                            >
                                <Text className={breed === item ? "text-[#EAC16C] font-semibold text-base" : "text-[#DDE6F0] text-base"}>
                                    {item}
                                </Text>
                                {breed === item && <Ionicons name="checkmark" size={20} color="#EAC16C" />}
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={() => (
                            <View className="py-10 items-center">
                                <Text className="text-[#888] text-base text-center">No breeds found</Text>
                            </View>
                        )}
                    />
                </View>
            </KeyboardAvoidingView>
        </Modal>
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
                    {images.map((uri, i) => (
                        <View key={i} className="relative">
                            <Image
                                source={{ uri }}
                                style={{ width: 70, height: 70, borderRadius: 12 }}
                                contentFit="cover"
                            />
                            <TouchableOpacity
                                className="absolute -top-1 -right-1 bg-red-500 rounded-full"
                                onPress={() => setImages(images.filter((_, idx) => idx !== i))}
                            >
                                <Ionicons name="close-circle" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    ))}
                    {images.length < 4 && (
                        <TouchableOpacity
                            className="w-[70px] h-[70px] bg-[#1C2B35] rounded-xl justify-center items-center"
                            activeOpacity={0.8}
                            onPress={pickImage}
                        >
                            <Ionicons name="add-circle-outline" size={28} color="#888" />
                        </TouchableOpacity>
                    )}
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

                {renderDropdown("breed", "Pet Breed*", breed, DOG_BREEDS)}
                {renderDropdown("gender", "Pet Gender*", gender, GENDERS)}
                {renderDropdown("age", "Pet Age*", age, AGES)}
                {renderDropdown("health", "Health Badge*", healthBadge, HEALTH_BADGES)}
                {renderDropdown("temperament", "Pet Temperament*", temperament, TEMPERAMENTS)}

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

            {/* Modals */}
            {renderBreedModal()}
        </View>
    );
}

