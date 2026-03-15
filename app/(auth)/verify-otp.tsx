import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from "react-native";
import Toast from 'react-native-toast-message';
import { API_URL } from "../../constants/api";
import { useAuth } from "../../context/AuthContext";

export default function VerifyOtp() {
  const router = useRouter();
  const { phone } = useLocalSearchParams();
  const { setAuth } = useAuth();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      Alert.alert("Error", "Please enter a 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await response.json();

      if (data.success) {
        await setAuth(data.token, data.user);

        // Redirect logic based on user profile completeness
        if (data.user && data.user.fullName) {
          router.replace("/(tabs)/" as any);
        } else {
          router.replace("/(auth)/pet-details" as any);
        }
      } else {
        Alert.alert("Error", data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };


  const handleResendOtp = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();
      if (data.success) {
        Toast.show({
          type: 'otp',
          text1: 'OTP Resent',
          text2: String(data.otp),
          visibilityTime: 10000,
          autoHide: true,
          topOffset: 10,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };





  return (
    <View className="flex-1 bg-[#07141D] px-6 pt-16">
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#DDE6F0" />
      </TouchableOpacity>

      {/* Title */}
      <Text className="text-[#DDE6F0] text-[28px] font-semibold my-10 leading-tight">
        Please enter the{"\n"}verification code
      </Text>

      {/* OTP Input */}
      <TextInput
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={6}
        className="text-[#DDE6F0] text-[28px] tracking-[15px] border-b border-[#444] pb-3"
      />

      {/* Info Text */}
      <Text className="text-[#888] text-sm mt-5 leading-5">
        We have sent verification code to the phone number{"\n"}
        <Text className="text-[#DDE6F0]">+91 {phone}</Text>.{" "}
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-[#7ED6D1]">Change phone number?</Text>
        </TouchableOpacity>
      </Text>

      {/* Resend Code */}
      <TouchableOpacity className="mt-16 items-center" onPress={handleResendOtp}>
        <Text className="text-[#7ED6D1] text-base">Resend Code</Text>
      </TouchableOpacity>

      {/* Continue Button */}
      <TouchableOpacity
        className="mt-auto mb-5 bg-primary py-4 rounded-full items-center"
        onPress={handleVerifyOtp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#001F2B" />
        ) : (
          <Text className="text-[#001F2B] font-semibold text-base">Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}