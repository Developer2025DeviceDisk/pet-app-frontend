import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
    const { token, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#07141D' }}>
                <ActivityIndicator size="large" color="#7ED6D1" />
            </View>
        );
    }

    if (!token) {
        return <Redirect href={"/(auth)/" as any} />;
    }

    return <Redirect href={"/(tabs)/" as any} />;
}
