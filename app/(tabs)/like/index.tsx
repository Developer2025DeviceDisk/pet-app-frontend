import { View, Text, Button, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function LikeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liked Pets 🐶</Text>

      <Button
        title="Go to Details"
        onPress={() => router.push("/like/details")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
