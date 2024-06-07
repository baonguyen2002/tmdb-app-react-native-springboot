import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Loading from "./Loading";
import { Context } from "./Context";
import { Badge } from "@rneui/themed";
import { createStackNavigator } from "@react-navigation/stack";
import ListView from "./ListView";
import { fetchFavMovie, fetchRatedMovie } from "./Database";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();
const FavoriteRatingWatchList = ({ route }) => {
  const { listType, title } = route.params;

  // useLayoutEffect(() => {
  //   navigation.setOptions({ title: title, headerTitleAlign: "center" });
  // }, [navigation, title]);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TopTabs"
        component={TopTabs}
        initialParams={{
          listType: listType,

          title: title,
        }}
        options={{
          headerTitle: title,
          // origin === "favorite"
          //   ? "My Favorites"
          //   : origin === "ratings"
          //   ? "My Ratings"
          //   : "My Watchlist",
          headerTintColor: "#14b8a6",
          headerStyle: { backgroundColor: "#5b21b6" },
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
};
const TopTabs = ({ route }) => {
  const { listType } = route.params;

  return (
    <Tab.Navigator
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
      <Tab.Screen
        name="Movies"
        component={List}
        initialParams={{
          type: "movies",
          listType: listType,

          origin: "moviemy",
        }}
      />
    </Tab.Navigator>
  );
};

const List = ({ route }) => {
  const [favMovieList, setFavMovieList] = useState([]);
  const [ratedMovieList, setRatedMovieList] = useState([]);
  const fetchFavMovieFromDatabase = async () => {
    try {
      const movieListFromDB = await fetchFavMovie();

      setFavMovieList(movieListFromDB);
      //console.log("fetched favMovie: ", movieListFromDB);
    } catch (error) {
      console.log("Error fetching favMovie list:", error);
    }
  };
  const fetchRatedMovieFromDatabase = async () => {
    try {
      const movieListFromDB = await fetchRatedMovie();

      setRatedMovieList(movieListFromDB);
      //console.log("fetched ratedMovie: ", movieListFromDB);
    } catch (error) {
      console.log("Error fetching ratedMovie list:", error);
    }
  };

  const { suggestedMovieList, setSuggestedMovieList } = useContext(Context);
  useFocusEffect(
    useCallback(() => {
      if (suggestedMovieList) {
        setSuggestedMovieList(null);
      }
      return () => {};
    }, [])
  );
  const { type, listType, origin } = route.params;

  useFocusEffect(
    useCallback(() => {
      fetchFavMovieFromDatabase();
      fetchRatedMovieFromDatabase();
    }, [])
  );
  return (
    <List2
      type={type}
      listType={listType}
      favMovieList={favMovieList}
      ratedMovieList={ratedMovieList}
    />
  );
};

const List2 = ({
  favMovieList,
  type,
  listType,
  watchMovieList,
  ratedMovieList,
  favTvList,
  watchlistTv,
  ratedTv,
}) => {
  const navigation = useNavigation();

  return (
    <>
      {type === "movies" ? (
        listType === "favorite" ? (
          favMovieList && favMovieList.length > 0 ? (
            <FlatList
              style={{ backgroundColor: "#14b8a6" }}
              data={favMovieList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="flex flex-row justify-start h-40 p-px bg-teal-500 border-2 border-blue-800"
                  onPress={() => {
                    navigation.navigate("MyMovieDetails", {
                      movie_id: item.favMovieId,
                      header: item.name,
                      origin: "moviemy",
                    });
                  }}
                >
                  <View className="w-fit">
                    {item.posterImageUrl ? (
                      <Image
                        source={{
                          uri: `https://image.tmdb.org/t/p/w154/${item.posterImageUrl}`,
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
                    {item.releaseDate ? (
                      <Text className="font-light text-violet-800">
                        {"Release date: " + item.releaseDate}
                      </Text>
                    ) : null}
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.favMovieId}
            />
          ) : (
            <View className="flex items-center justify-center w-full h-full bg-teal-500">
              <Text className="px-4 text-2xl font-extrabold text-center text-blue-800 ">
                Here you can find movies you have marked as Favorites, try to
                heart some movies!
              </Text>
            </View>
          )
        ) : listType === "watchlist" ? (
          watchMovieList && watchMovieList.length > 0 ? (
            <FlatList
              style={{ backgroundColor: "#14b8a6" }}
              data={watchMovieList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="flex flex-row justify-start h-40 p-px bg-teal-500 border-2 border-blue-800"
                  onPress={() => {
                    navigation.navigate("MyMovieDetails", {
                      movie_id: item.watchlistMovieId,
                      header: item.name,
                      origin: "moviemy",
                    });
                  }}
                >
                  <View className="w-fit">
                    {item.posterImageUrl ? (
                      <Image
                        source={{
                          uri: `https://image.tmdb.org/t/p/w154/${item.posterImageUrl}`,
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
                    {item.releaseDate ? (
                      <Text className="font-light text-violet-800">
                        {"Release date: " + item.releaseDate}
                      </Text>
                    ) : null}
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.watchlistMovieId}
            />
          ) : (
            <View className="flex items-center justify-center w-full h-full bg-teal-500">
              <Text className="px-4 text-2xl font-extrabold text-center text-blue-800 ">
                Seems like there are no items at the moment, let's add some to
                this list!
              </Text>
            </View>
          )
        ) : ratedMovieList && ratedMovieList.length > 0 ? (
          <FlatList
            style={{ backgroundColor: "#14b8a6" }}
            data={ratedMovieList}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex flex-row justify-start h-40 p-px bg-teal-500 border-2 border-blue-800"
                onPress={() => {
                  navigation.navigate("MyMovieDetails", {
                    movie_id: item.ratedMovieId,
                    header: item.name,
                    origin: "moviemy",
                  });
                }}
              >
                <View className="w-fit">
                  {item.posterImageUrl ? (
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w154/${item.posterImageUrl}`,
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
                  {item.releaseDate ? (
                    <Text className="font-light text-violet-800">
                      {"Release date: " + item.releaseDate}
                    </Text>
                  ) : null}
                  <View className="flex flex-row items-center">
                    <Text className="font-semibold">Your rating: </Text>
                    <Badge
                      value={item.ratedValue}
                      status={
                        item.ratedValue > 8
                          ? "success"
                          : item.ratedValue > 4
                          ? "warning"
                          : "error"
                      }
                      badgeStyle={{
                        height: 22,
                      }}
                      textStyle={{
                        fontSize: 14,
                        fontWeight: "bold",
                        color: "black",
                      }}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.ratedMovieId}
          />
        ) : (
          <View className="flex items-center justify-center w-full h-full bg-teal-500">
            <Text className="px-4 text-2xl font-extrabold text-center text-blue-800 ">
              Here you can find movies that you have rated, try to rate some
              movies!
            </Text>
          </View>
        )
      ) : listType === "favorite" ? (
        favTvList && favTvList.length > 0 ? (
          <FlatList
            style={{ backgroundColor: "#14b8a6" }}
            data={favTvList}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex flex-row justify-start h-40 p-px bg-teal-500 border-2 border-blue-800"
                onPress={() => {
                  navigation.navigate("MyTvDetails", {
                    series_id: item.favTvId,
                    header: item.name,
                    origin: "tvmy",
                  });
                }}
              >
                <View className="w-fit">
                  {item.posterImageUrl ? (
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w154/${item.posterImageUrl}`,
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
                  {item.firstAirDate ? (
                    <Text className="font-light text-violet-800">
                      {"First aired date: " + item.firstAirDate}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.favTvId}
          />
        ) : (
          <View className="flex items-center justify-center w-full h-full bg-teal-500">
            <Text className="px-4 text-2xl font-extrabold text-center text-blue-800 ">
              Seems like there are no items at the moment, let's add some to
              this list!
            </Text>
          </View>
        )
      ) : listType === "watchlist" ? (
        watchlistTv && watchlistTv.length > 0 ? (
          <FlatList
            style={{ backgroundColor: "#14b8a6" }}
            data={watchlistTv}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex flex-row justify-start h-40 p-px bg-teal-500 border-2 border-blue-800"
                onPress={() => {
                  navigation.navigate("MyTvDetails", {
                    series_id: item.watchlistTvId,
                    header: item.name,
                    origin: "tvmy",
                  });
                }}
              >
                <View className="w-fit">
                  {item.posterImageUrl ? (
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w154/${item.posterImageUrl}`,
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
                  {item.firstAirDate ? (
                    <Text className="font-light text-violet-800">
                      {"First aired date: " + item.firstAirDate}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.watchlistTvId}
          />
        ) : (
          <View className="flex items-center justify-center w-full h-full bg-teal-500">
            <Text className="px-4 text-2xl font-extrabold text-center text-blue-800 ">
              Seems like there are no items at the moment, let's add some to
              this list!
            </Text>
          </View>
        )
      ) : ratedTv && ratedTv.length > 0 ? (
        <FlatList
          style={{ backgroundColor: "#14b8a6" }}
          data={ratedTv}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="flex flex-row justify-start h-40 p-px bg-teal-500 border-2 border-blue-800"
              onPress={() => {
                navigation.navigate("MyTvDetails", {
                  series_id: item.ratedTvId,
                  header: item.name,
                  origin: "tvmy",
                });
              }}
            >
              <View className="w-fit">
                {item.posterImageUrl ? (
                  <Image
                    source={{
                      uri: `https://image.tmdb.org/t/p/w154/${item.posterImageUrl}`,
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
                {item.firstAirDate ? (
                  <Text className="font-light text-violet-800">
                    {"First aired date: " + item.firstAirDate}
                  </Text>
                ) : null}
                <View className="flex flex-row items-center">
                  <Text className="font-semibold">Your rating: </Text>
                  <Badge
                    value={item.ratedValue}
                    status={
                      item.ratedValue > 8
                        ? "success"
                        : item.ratedValue > 4
                        ? "warning"
                        : "error"
                    }
                    badgeStyle={{
                      height: 22,
                    }}
                    textStyle={{
                      fontSize: 14,
                      fontWeight: "bold",
                      color: "black",
                    }}
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.ratedTvId}
        />
      ) : (
        <View className="flex items-center justify-center w-full h-full bg-teal-500">
          <Text className="px-4 text-2xl font-extrabold text-center text-blue-800 ">
            Seems like there are no items at the moment, let's add some to this
            list!
          </Text>
        </View>
      )}
    </>
  );
};

export default FavoriteRatingWatchList;
