import { Stack } from "expo-router";

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="phone-number" />
            <Stack.Screen name="verify-otp" />
            <Stack.Screen name="owner-details" />
            <Stack.Screen name="pet-details" />
        </Stack>
    );
}
