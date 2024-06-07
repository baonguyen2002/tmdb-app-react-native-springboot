import React, { useEffect, useState, useContext, useCallback } from "react";
import { View, TextInput, TouchableOpacity, Alert, Text } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Button } from "@rneui/base";
import axios from "axios";
import ListView from "./ListView";
import { Entypo } from "@expo/vector-icons";
import Loading from "./Loading";
import MovieDetail from "./MovieDetail";
import { createStackNavigator } from "@react-navigation/stack";
import ShowDetails from "./ShowDetails";
import PersonProfileStack from "./PersonProfile";
import { apiBaseUrl } from "./API";
import { ScrollView } from "react-native-gesture-handler";
import { Context } from "./Context";
import { useFocusEffect } from "@react-navigation/native";
const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();
const SearchStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchTab"
        component={SearchTab}
        options={{
          headerTitleAlign: "center",
          headerTitle: "Search",
          headerTitleStyle: {
            color: "#14b8a6",
          },
          headerStyle: { backgroundColor: "#5b21b6" },
        }}
      />
      <Stack.Screen
        name="SearchMovieDetails"
        component={MovieDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SearchTvDetails"
        component={ShowDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SearchPersonDetails"
        component={PersonProfileStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const SearchTab = () => {
  return (
    <Tab.Navigator
      screenOptions={() => ({
        //headerShown: false,
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
      <Tab.Screen
        name="Movies"
        component={SearchResults}
        initialParams={{ type: "movies" }}
      />
      {/* <Tab.Screen
        name="TV Shows"
        component={SearchResults}
        initialParams={{ type: "tvshow" }}
      />
      <Tab.Screen
        name="Person"
        component={SearchResults}
        initialParams={{ type: "person" }}
        options={{ tabBarLabel: "People" }}
      /> */}
    </Tab.Navigator>
  );
};

const SearchResults = ({ route }) => {
  const { type } = route.params;
  const [results, setResults] = useState(false);
  const [isNewDataEmpty, setIsNewDataEmpty] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isResultEmpty, setIsResultEmpty] = useState(false);
  const [movieSearchPage, setMovieSearchPage] = useState(1);
  const [personSearchPage, setPersonSearchPage] = useState(1);
  const [TVShowSearchPage, setTVShowSearchPage] = useState(1);
  const [editable, setEditable] = useState(true);
  const [searchButtonPressed, setSearchButtonPressed] = useState(false);
  const { suggestedMovieList, setSuggestedMovieList } = useContext(Context);
  useFocusEffect(
    useCallback(() => {
      if (suggestedMovieList) {
        setSuggestedMovieList(null);
      }
      return () => {};
    }, [])
  );
  const clearText = () => {
    setSearchButtonPressed(false);
    setEditable(true);
    setKeyword("");
    setResults(false);
    // if (type === "movies") {
    //   setMovieSearchPage(1);
    // } else {
    //   setTVShowSearchPage(1);
    // }
    setLoading(false);
  };
  useEffect(() => {
    //console.log(type);
    if (keyword) {
      Search();
    }
  }, [movieSearchPage, TVShowSearchPage, personSearchPage]);

  const Search = () => {
    setLoading(true);
    if (!keyword.trim()) {
      Alert.alert("Invalid", "Please enter a keyword");
      setLoading(false);
      return;
    } else {
      setEditable(false);
      axios
        .get(`${apiBaseUrl}/movie/search-by-title?title=${keyword}`)
        .then((response) => {
          console.log(response.data);
          setResults(response.data);
          setSearchButtonPressed(true);
          // //console.log(type);
          // if (response.data.results.length === 0) {
          //   if (results.length == 0) {
          //     setIsResultEmpty(true);
          //   }
          //   setIsNewDataEmpty(true);
          // } else {
          //   const filteredResults = response.data.results.filter(
          //     (newResult) =>
          //       !results.some(
          //         (existingResult) => existingResult.id === newResult.id
          //       )
          //   );
          //   setResults((prevResults) => [...prevResults, ...filteredResults]);
          //   setIsNewDataEmpty(false);
          // }

          // //setKeyword(keyword);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  const origin =
    type === "movies"
      ? "moviesearch"
      : type === "tvshow"
      ? "tvsearch"
      : "personsearch";

  return (
    <>
      <View className="flex flex-row items-center pt-3 bg-teal-500 justify-evenly">
        <View className="w-4/6 p-2 border-2 border-blue-800 rounded-md ">
          <TextInput
            editable={editable}
            onChangeText={setKeyword}
            value={keyword}
          />
        </View>

        <TouchableOpacity onPress={clearText}>
          <Entypo
            name="circle-with-cross"
            size={26}
            color={keyword ? "red" : "#4b476b"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            //setSearchButtonPressed(true);
            Search();
          }}
          className="items-center justify-center w-16 h-10 rounded-md bg-violet-800"
        >
          <Text className="text-base font-bold text-center text-teal-500">
            Search
          </Text>
        </TouchableOpacity>
      </View>
      {!searchButtonPressed ? (
        <View className="w-full h-full bg-teal-500"></View>
      ) : null}
      {results && results.length > 0 ? (
        <ListView
          role={""}
          results={results}
          type={type}
          setPage={false}
          origin={origin}
          isNewDataEmpty={isNewDataEmpty}
        />
      ) : results.length == 0 ? (
        <View className="flex items-center justify-center w-full h-full bg-teal-500">
          <Text className="px-4 text-2xl font-extrabold text-center text-blue-800">
            Seems like there are no results...
          </Text>
        </View>
      ) : null}

      {/* {!searchButtonPressed ? (
        <View className="w-full h-full bg-teal-500">
          <Text>Bruh</Text>
        </View>
      ) : null} */}
      {/* {results.length === 0 ? (
        <View className="w-full h-full bg-teal-500"></View>
      ) : null} */}
      {/* {!loading ? (
        results && results.length > 0 ? (
          <ListView
            role={""}
            results={results}
            type={type}
            setPage={
              type === "movies"
                ? setMovieSearchPage
                : type === "tvshow"
                ? setTVShowSearchPage
                : setPersonSearchPage
            }
            origin={origin}
            isNewDataEmpty={isNewDataEmpty}
          />
        ) : isResultEmpty ? (
          <View className="flex items-center justify-center w-full h-full bg-teal-500">
            <Text className="px-4 text-2xl font-extrabold text-center text-blue-800">
              Seems like there are no results...
            </Text>
          </View>
        ) : null
      ) : (
        <Loading />
      )} */}
    </>
  );
};
export default SearchStack;
