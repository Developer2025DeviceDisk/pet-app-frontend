import { useRouter } from "expo-router";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../../assets/Vector.png")}
      className="flex-1 bg-[#07141D] justify-end"
      resizeMode="cover"
    >
      <View className="px-6 mb-16">
        <Text className="text-[#DDE6F0] text-3xl font-semibold mb-10 leading-tight">
          Where <Text className="text-[#7ED6D1]">Paws</Text> Meet{"\n"}
          Perfect Matches.
        </Text>

        <TouchableOpacity
          className="bg-primary py-4 rounded-full items-center mb-4"
          onPress={() => router.push("/(auth)/phone-number")}
        >
          <Text className="text-[#001F2B] font-semibold text-base">
            Continue with phone number
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-[#3A3F44] py-4 rounded-full items-center">
          <Text className="text-white text-[15px]">Continue with Google</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}