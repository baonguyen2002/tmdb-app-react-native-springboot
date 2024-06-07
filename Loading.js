import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const Loading = () => (
  <View style={{ width: "100%", height: "100%", backgroundColor: "#14b8a6" }}>
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});

export default Loading;
