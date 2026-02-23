import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function VerifyOtp() {
  const router = useRouter();
  const { phone } = useLocalSearchParams();
  const [otp, setOtp] = useState("");

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
        <Text className="text-[#7ED6D1]">Change phone number?</Text>
      </Text>

      {/* Resend Code */}
      <TouchableOpacity className="mt-16 items-center">
        <Text className="text-[#7ED6D1] text-base">Resend Code</Text>
      </TouchableOpacity>

      {/* Continue Button */}
      <TouchableOpacity
        className="mt-auto mb-5 bg-[#7ED6D1] py-4 rounded-full items-center"
        onPress={() => router.push("/(auth)/pet-details")}
      >
        <Text className="text-[#001F2B] font-semibold text-base">Continue</Text>
      </TouchableOpacity>
    </View>
  );
}