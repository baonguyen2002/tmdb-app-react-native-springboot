import React, { Component, useContext, useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList, Switch } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
const Tabs = createMaterialTopTabNavigator();
import MovieGenre from "./MovieGenre";
import TVGenre from "./TVGenre";
import { Context } from "./Context";
import Loading from "./Loading";
import {
  deleteFavTvGenre,
  deleteFavMovieGenre,
  insertFavMovieGenre,
  insertFavTvGenre,
  fetchFavTvGenre,
  fetchFavMovieGenre,
} from "./Database";
const SettingsTabs = () => {
  return (
    <Tabs.Navigator
      screenOptions={() => ({
        headerShown: false,
        tabBarLabelStyle: {
          textTransform: "none",
          fontSize: 16,
          fontWeight: "bold",
          color: "#14b8a6",
        },

        tabBarStyle: {
          backgroundColor: "#5b21b6",
        }, // Background color for the tab bar
        //tabStyle: { backgroundColor: "orange" },
        // tabBarActiveTintColor: "#14b8a6",
        // tabBarInactiveTintColor: "#14b8a6",
        tabBarIndicatorStyle: { backgroundColor: "#14b8a6" },
      })}
    >
      <Tabs.Screen
        name="Movies"
        component={Settings}
        initialParams={{ type: "movie" }}
      />
      <Tabs.Screen
        name="TV Shows"
        component={Settings}
        initialParams={{ type: "tv" }}
      />
    </Tabs.Navigator>
  );
};
const Settings = ({ route }) => {
  const {
    setFavTvGenreList,
    setFavMovieGenreList,
    favMovieGenreList,
    favTvGenreList,
  } = useContext(Context);

  const fetchFavTvGenreFromDatabase = async () => {
    try {
      const tvGenreListFromDB = await fetchFavTvGenre();
      setLocalTvList(tvGenreListFromDB);
      setFavTvGenreList(tvGenreListFromDB);
      console.log("fetched favTvGenre: ", tvGenreListFromDB);
    } catch (error) {
      console.log("Error fetching favTvGenre list:", error);
    }
    setIsLoading(false);
  };
  const fetchFavMovieGenreFromDatabase = async () => {
    try {
      const movieGenreListFromDB = await fetchFavMovieGenre();
      setLocalMovieList(movieGenreListFromDB);
      setFavMovieGenreList(movieGenreListFromDB);
      console.log("fetched favMovieGenre: ", movieGenreListFromDB);
    } catch (error) {
      console.log("Error fetching favMovieGenre list:", error);
    }
    setIsLoading(false);
  };
  const { type } = route.params;
  const [localMovieList, setLocalMovieList] = useState([]);
  const [localTvList, setLocalTvList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (type === "movie") {
      fetchFavMovieGenreFromDatabase();
      setIsLoading(false);
    }
    if (type === "tv") {
      fetchFavTvGenreFromDatabase();
      setIsLoading(false);
    }
  }, []);

  const toggleSwitch = (id) => {
    setIsLoading(true);
    if (type === "movie") {
      if (localMovieList.some((object) => object.favMovieGenreId === id)) {
        const handleDeleteMovieGenre = async (id) => {
          try {
            await deleteFavMovieGenre(id);
            fetchFavMovieGenreFromDatabase(); // Fetch updated notes after deleting a note
          } catch (error) {
            console.error("Error deleting movie genre", error);
          }
        };
        handleDeleteMovieGenre(id);
      } else {
        const handleAddMovieGenre = async (id) => {
          try {
            await insertFavMovieGenre(id);
            fetchFavMovieGenreFromDatabase(); // Fetch updated notes after deleting a note
          } catch (error) {
            console.error("Error adding movie genre", error);
          }
        };
        handleAddMovieGenre(id);
      }
    }
    if (type === "tv") {
      if (localTvList.some((object) => object.favTvGenreId === id)) {
        const handleDeleteTvGenre = async (id) => {
          try {
            await deleteFavTvGenre(id);
            fetchFavTvGenreFromDatabase(); // Fetch updated notes after deleting a note
          } catch (error) {
            console.error("Error deleting tv genre", error);
          }
        };
        handleDeleteTvGenre(id);
      } else {
        const handleAddTvGenre = async (id) => {
          try {
            await insertFavTvGenre(id);
            fetchFavTvGenreFromDatabase(); // Fetch updated notes after deleting a note
          } catch (error) {
            console.error("Error adding tv genre", error);
          }
        };
        handleAddTvGenre(id);
      }
    }
  };

  return isLoading ? (
    <Loading />
  ) : (
    <FlatList
      className="bg-teal-500"
      numColumns={2}
      data={type === "movie" ? MovieGenre : TVGenre}
      renderItem={({ item }) => {
        let switchValue = false;
        if (type === "movie") {
          switchValue = localMovieList.some(
            (object) => object.favMovieGenreId === item.id
          );
        }
        if (type === "tv") {
          switchValue = localTvList.some(
            (object) => object.favTvGenreId === item.id
          );
        }
        return (
          <View className="flex flex-row items-center w-[49%] self-center px-8 justify-between">
            <View className="w-[75%]">
              <Text className="font-bold text-blue-800">{item.name}</Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={switchValue ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => toggleSwitch(item.id)}
              value={switchValue ? true : false}
            />
          </View>
        );
      }}
      keyExtractor={(item) => item.id}
    />
  );
};

export default SettingsTabs;
