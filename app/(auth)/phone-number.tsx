import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function PhoneNumber() {
  const router = useRouter();

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
        />
      </View>

      <Text className="text-[#BEC9C8] text-[13px] mt-5 leading-5">
        We'll send you a code to verify you are really you.{"\n"}
        Message and data rates may apply
      </Text>

      {/* Button */}
      <TouchableOpacity
        className="mt-auto mb-5 bg-[#7ED6D1] py-4 rounded-full items-center"
        onPress={() =>
          router.push({
            pathname: "/(auth)/verify-otp",
            params: { phone: "9555942520" },
          })
        }
      >
        <Text className="text-[#001F2B] font-semibold text-base">
          Send verification code
        </Text>
      </TouchableOpacity>
    </View>
  );
}
