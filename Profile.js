import React, { useContext, useEffect, useCallback } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import axios from "axios";
import { Context } from "./Context";
import { useState } from "react";
import Loading from "./Loading";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import FavoriteRatingWatchList from "./FavoriteRatingWatchList";
import SettingsTabs from "./Setting";
import FavActorStack from "./FavActorList";
import PersonProfileStack from "./PersonProfile";
import ShowDetails from "./ShowDetails";
import MovieDetail from "./MovieDetail";
const Stack = createStackNavigator();
const Profile = () => {
  const navigation = useNavigation();
  const { suggestedMovieList, setSuggestedMovieList, setUsername } =
    useContext(Context);
  useFocusEffect(
    useCallback(() => {
      if (suggestedMovieList) {
        console.log("suggestedMovieList", suggestedMovieList);
        setSuggestedMovieList(null);
      }
      return () => {};
    }, [])
  );
  return (
    <ScrollView className="bg-teal-500">
      <Image
        className="self-center w-40 h-40 mt-4 rounded-full "
        source={require("./assets/blank_avatar.jpg")}
      />

      <Text className="mt-4 text-3xl font-extrabold text-center text-[#0d253f]">
        User
      </Text>

      <View className="items-center w-full">
        <TouchableOpacity
          className="items-center justify-center w-4/5 h-20 my-4 rounded-full bg-violet-800"
          onPress={() => {
            navigation.navigate("FavoriteRatingWatchList", {
              listType: "favorite",
              title: "My Favorites",
            });
          }}
        >
          <Text className="text-lg font-semibold text-teal-500">Favorites</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="items-center justify-center w-4/5 h-20 my-4 rounded-full bg-violet-800"
          onPress={() => {
            navigation.navigate("FavoriteRatingWatchList", {
              listType: "rated",
              title: "My Ratings",
            });
          }}
        >
          <Text className="text-lg font-semibold text-teal-500">Ratings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center justify-center w-4/5 h-20 my-4 bg-red-800 rounded-full"
          onPress={() => {
            setUsername(null);
          }}
        >
          <Text className="text-lg font-semibold text-white">Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#5b21b6" },
          headerTitleStyle: { color: "#14b8a6" },
        }}
      />
      <Stack.Screen
        name="FavActorList"
        component={FavActorStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FavActorProfile"
        component={PersonProfileStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FavoriteRatingWatchList"
        component={FavoriteRatingWatchList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyMovieDetails"
        component={MovieDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyTvDetails"
        component={ShowDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsTabs}
        options={{
          headerTitleAlign: "center",
          headerTitle: "Set your preferences",
          headerStyle: { backgroundColor: "#5b21b6" },
          headerTitleStyle: { color: "#14b8a6" },
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
