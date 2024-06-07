// App.js

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { fetchActor } from "./Database";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import PersonProfileStack from "./PersonProfile";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

const FavActorStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FavActor"
        component={FavActorList}
        options={{
          headerTitle: "Favorite Actors",
          headerTitleAlign: "center",
          headerTintColor: "#14b8a6",
          headerStyle: { backgroundColor: "#5b21b6" },
        }}
      />
      {/* <Stack.Screen
        name="FavActorProfile"
        component={PersonProfileStack}
        options={{ headerShown: false }}
      /> */}
    </Stack.Navigator>
  );
};
const FavActorList = () => {
  const navigation = useNavigation();
  const [localActorList, setLocalActorList] = useState([]);
  const fetchActorsFromDatabase = async () => {
    try {
      const actorsListFromDB = await fetchActor();

      setLocalActorList(actorsListFromDB);
      console.log("fetched actor: ", actorsListFromDB);
    } catch (error) {
      console.log("Error fetching actors list:", error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchActorsFromDatabase();
    }, [])
  );
  return localActorList && localActorList.length > 0 ? (
    <FlatList
      style={{ backgroundColor: "#14b8a6" }}
      data={localActorList}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            className="flex flex-row justify-start h-40 p-px bg-teal-500 border-2 border-blue-800"
            onPress={() => {
              navigation.navigate("FavActorProfile", {
                person_id: item.actorId,
                header: item.name,
                origin: "myactor",
              });
            }}
          >
            <View className="w-fit">
              {item.profileImageUrl && item.profileImageUrl.length > 0 ? (
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w185/${item.profileImageUrl}`,
                  }}
                  className="w-24 h-full mr-1 rounded-lg"
                />
              ) : (
                <Image
                  source={require("./assets/blank.png")}
                  className="w-24 h-full mr-1 rounded-lg"
                />
              )}
            </View>
            <View className="flex items-start justify-center w-[71%]  ">
              <Text className="text-lg font-bold text-[#0d253f]">
                {item.name}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }}
      keyExtractor={(item) => item.id}
    />
  ) : (
    <View className="flex items-center justify-center w-full h-full bg-teal-500">
      <Text className="text-2xl font-bold text-center text-blue-800">
        Looks like you have not set any actor as your favorites yet. Like some
        people to see changes!
      </Text>
    </View>
  );
};

export default FavActorStack;
