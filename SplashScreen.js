import React from "react";
import { View, StyleSheet, Image, Text, Dimensions } from "react-native";
import LottieView from "lottie-react-native";

const { width } = Dimensions.get("window");

const SplashScreen = () => {
  return (
    <View style={styles.container} className="bg-violet-800">
      <View style={styles.textContainer}>
        <Image
          source={require("./assets/tmdb.png")}
          className="w-[226] h-[160] self-center"
        />
      </View>

      <View style={styles.animationContainer}>
        <LottieView
          source={require("./assets/swingingBall.json")}
          autoPlay
          loop
          //style={styles.animation}
          className="w-full h-full"
        />
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginBottom: 16,
    width: "100%",
  },
  animationContainer: {
    width: width * 0.6,
    aspectRatio: 1, // Maintain aspect ratio of the animation
  },
  animation: {
    width: "100%",
    height: "100%",
  },
});
