import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from "react-native";
import Toast from 'react-native-toast-message';
import { API_URL } from "../../constants/api";

export default function PhoneNumber() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (phone.length < 10) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (data.success) {
        // Show OTP in a beautiful Toast banner
        Toast.show({
          type: 'otp',
          text1: 'Verification Code',
          text2: String(data.otp),
          visibilityTime: 10000,
          autoHide: true,
          topOffset: 10,
        });

        // Redirect to verify-otp
        router.push({
          pathname: "/(auth)/verify-otp",
          params: { phone },
        });

      } else {
        Alert.alert("Error", data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };




  return (
    <View className="flex-1 bg-[#07141D] px-6 pt-16">
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#DDE6F0" />
      </TouchableOpacity>

      <Text className="text-[#B2C8E8] text-[32px] font-semibold my-10 leading-tight">
        Can we get your{"\n"}number?
      </Text>

      {/* Input Row */}
      <View className="flex-row items-center border-b border-[#444] pb-3">
        <Text className="text-[#DDE6F0] mr-4">IND +91</Text>
        <TextInput
          placeholder="Phone Number"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          className="flex-1 text-[#DDE6F0] text-base"
          value={phone}
          onChangeText={setPhone}
          maxLength={10}
        />
      </View>

      <Text className="text-[#BEC9C8] text-[13px] mt-5 leading-5">
        We'll send you a code to verify you are really you.{"\n"}
        Message and data rates may apply
      </Text>

      {/* Button */}
      <TouchableOpacity
        className="mt-auto mb-12 bg-primary py-4 rounded-full items-center"
        onPress={handleSendOtp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#001F2B" />
        ) : (
          <Text className="text-[#001F2B] font-semibold text-base">
            Send verification code
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

