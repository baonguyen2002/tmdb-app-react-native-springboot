import React, {
  Component,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import ForYouTvSeeMore from "./ForYouTvSeeMore";
import {
  Text,
  View,
  FlatList,
  Button,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { fetchFavTvGenre, fetchActor } from "./Database";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Badge } from "@rneui/themed";
const windowHeight = Dimensions.get("window").height;
const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();
const ForYouTvStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#5b21b6",
        },
        headerTintColor: "#14b8a6",
      }}
    >
      <Stack.Screen
        name="ForYouTvTab"
        component={ForYouTab}
        options={{
          headerTitle: "Recommended For You",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="ForYouTvSeeMore"
        component={ForYouTvSeeMore}
        options={{
          headerTitleAlign: "center",
          headerTitle: "More TV Shows",
        }}
      />
    </Stack.Navigator>
  );
};
const ForYouTab = () => {
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
        name="Genre"
        component={ForYou}
        initialParams={{ type: "genre" }}
      />
      <Tab.Screen
        name="Actor"
        component={ForYou}
        initialParams={{ type: "actor" }}
      />
    </Tab.Navigator>
  );
};
const ForYou = ({ route }) => {
  const { type } = route.params;
  const [localFavTvGenreList, setLocalFavTvGenreList] = useState([]);
  const [tvListBasedOnFavTvGenre, setTvListBasedOnFavTvGenre] = useState([]);
  const navigation = useNavigation();
  const [localFavActorList, setLocalFavActorList] = useState([]);
  const [tvListBasedOnFavActor, setTvListBasedOnFavActor] = useState([]);
  const [realLocalFavActorList, setRealLocalFavActorList] = useState([]);
  const [orJoinType, setOrJoinType] = useState(true);
  const [isVietnamese, setIsVietnamese] = useState(false);

  const fetchFavTvGenreFromDatabase = async () => {
    try {
      const tvGenreListFromDB = await fetchFavTvGenre();
      if (tvGenreListFromDB.length > 0) {
        const favTvGenreIds = tvGenreListFromDB.map(
          (item) => item.favTvGenreId
        );

        setLocalFavTvGenreList(favTvGenreIds);
        console.log("fetched favTvGenre: ", favTvGenreIds);
      } else {
        setLocalFavTvGenreList(tvGenreListFromDB);
        console.log("fetched favTvGenre: ", tvGenreListFromDB);
      }
    } catch (error) {
      console.log("Error fetching favTvGenre list:", error);
    }
  };

  const fetchActorsFromDatabase = async () => {
    try {
      const actorsListFromDB = await fetchActor();
      setRealLocalFavActorList(actorsListFromDB);
      console.log("real list: ", actorsListFromDB);
      if (actorsListFromDB.length > 0) {
        const favActorIds = actorsListFromDB.map((item) => item.actorId);

        setLocalFavActorList(favActorIds);
        console.log("fetched favActor: ", favActorIds);
      } else {
        setLocalFavActorList(actorsListFromDB);
        console.log("fetched favActor: ", actorsListFromDB);
      }
    } catch (error) {
      console.log("Error fetching favTvGenre list:", error);
    }
  };

  const fetchFavGenreResult = () => {
    const joinText = orJoinType
      ? localFavTvGenreList.join("|")
      : localFavTvGenreList.join(",");
    const language = isVietnamese ? "vi" : "en";
    axios
      .get(
        `https://api.themoviedb.org/3/discover/tv?api_key=841da308423b4b64ea4d57d052583683&include_adult=false&include_video=false&with_genres=${joinText}&with_original_language=${language}`

        //&language=en-US
      )
      .then((res) => {
        //console.log(res.data.results);
        setTvListBasedOnFavTvGenre(res.data.results);
        // if (res.data.total_pages > 500) {
        //   setMaxFavGenrePage(500);
        // } else {
        //   setMaxFavGenrePage(res.data.total_pages);
        // }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  //   const fetchFavActorTv = () => {
  //     const joinText = orJoinType
  //       ? localFavActorList.join("|")
  //       : localFavActorList.join(",");
  //     console.log(joinText);
  //     axios
  //       .get(
  //         `https://api.themoviedb.org/3/discover/tv?api_key=841da308423b4b64ea4d57d052583683&include_adult=false&include_video=false&with_cast=${joinText}`

  //         //&language=en-US
  //       )
  //       .then((res) => {
  //         //console.log(res.data.results);
  //         setTvListBasedOnFavActor(res.data.results);
  //         // if (res.data.total_pages > 500) {
  //         //   setMaxFavActorPage(500);
  //         // } else {
  //         //   setMaxFavActorPage(res.data.total_pages);
  //         // }
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //       });
  //   };
  useFocusEffect(
    useCallback(() => {
      fetchFavTvGenreFromDatabase();
      // fetchFlaggedMovieFromDatabase();
      fetchActorsFromDatabase();
    }, [])
  );
  useEffect(() => {
    if (localFavTvGenreList.length > 0) {
      fetchFavGenreResult();
    }
  }, [localFavTvGenreList, orJoinType, isVietnamese]);
  //   useEffect(() => {
  //     if (localFavActorList.length > 0) {
  //       fetchFavActorTv();
  //     }
  //   }, [orJoinType, localFavActorList]);
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        className="flex flex-row justify-start h-40 p-px bg-teal-500 border-2 border-blue-800"
        onPress={() => {
          navigation.navigate("MainShowDetail", {
            series_id: item.id,
            header: isVietnamese ? item.original_name : item.name,
            origin: "tvmain",
            orJoinType: orJoinType,
          });
        }}
      >
        <View className="w-fit">
          {item.poster_path ? (
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w185/${item.poster_path}`,
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
            {isVietnamese ? item.original_name : item.name}
          </Text>
          <Text className="font-light text-violet-800">
            {"First aired date: " + item.first_air_date}
          </Text>
          <View className="flex flex-row items-center">
            <Text className="font-semibold text-[#0d253f]">Rating: </Text>
            <Badge
              value={item.vote_average}
              status={
                item.vote_average > 8
                  ? "success"
                  : item.vote_average > 4
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
    );
  };
  return type === "genre" ? (
    <>
      {localFavTvGenreList && localFavTvGenreList.length > 0 ? (
        <>
          {/* <View className="flex flex-row items-center justify-evenly">
            <View className="w-1/2">
              <Text className="text-base font-bold">
                Tap to change filter type:
              </Text>
            </View>
            <View className="w-2/5">
              <Button
                title={orJoinType ? "Or" : "And"}
                onPress={() => {
                  setOrJoinType((prev) => !prev);
                }}
              />
            </View>
          </View>
          <View className="flex flex-row items-center justify-evenly">
            <View className="w-1/2">
              <Text className="text-base font-bold">
                Tap to change filter language:
              </Text>
            </View>
            <View className="w-2/5">
              <Button
                title={isVietnamese ? "Vietnamese" : "English"}
                onPress={() => {
                  setIsVietnamese((prev) => !prev);
                }}
              />
            </View>
          </View> */}
          <View className="bg-teal-500 ">
            <View className="flex flex-row items-center justify-between px-3 mt-2">
              <View className="items-center w-3/5">
                <Text className="text-base font-bold text-blue-900 ">
                  Tap to change filter type:
                </Text>
              </View>
              <TouchableOpacity
                className="items-center w-2/5 h-10 bg-[#90cea1] justify-center rounded-xl"
                onPress={() => {
                  setOrJoinType((prev) => !prev);
                }}
              >
                <Text className="text-base font-bold text-[#0d253f]">
                  {orJoinType ? "Or" : "And"}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex flex-row items-center justify-between px-3 my-2">
              <View className="items-center w-3/5">
                <Text className="text-base font-bold text-blue-900 ">
                  Tap to change language:
                </Text>
              </View>
              <TouchableOpacity
                className="items-center w-2/5 h-10 bg-[#90cea1] justify-center rounded-xl"
                onPress={() => {
                  setIsVietnamese((prev) => !prev);
                }}
              >
                <Text className="text-base font-bold text-[#0d253f]">
                  {isVietnamese ? "Vietnamese" : "English"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {tvListBasedOnFavTvGenre && tvListBasedOnFavTvGenre.length > 0 ? (
            <>
              <FlatList
                style={{ backgroundColor: "#14b8a6" }}
                data={tvListBasedOnFavTvGenre.slice(0, 5)}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListFooterComponent={() => {
                  return (
                    <View className="flex flex-row items-center pt-px bg-teal-500 justify-evenly">
                      {tvListBasedOnFavTvGenre.length <= 5 ? null : (
                        <TouchableOpacity
                          className="w-[48%] bg-violet-800 flex-row items-center h-12 self-center justify-center border-2 border-blue-800 rounded-lg"
                          onPress={() => {
                            navigation.navigate("ForYouTvSeeMore", {
                              list: localFavTvGenreList,
                              isVietnamese: isVietnamese,
                              type: "genre",
                              orJoinType: orJoinType,
                              isActor: false,
                            });
                          }}
                        >
                          <Text className="text-lg font-semibold text-center text-teal-500">
                            See more results
                          </Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        className="w-[48%] bg-violet-800 flex-row items-center h-12 self-center justify-center border-2 border-blue-800 rounded-lg"
                        onPress={() => {
                          navigation.navigate("Shows");
                        }}
                      >
                        <Text className="text-lg font-semibold text-center text-teal-500">
                          To Popular Shows
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </>
          ) : (
            <View className="flex items-center justify-center w-full h-full bg-teal-500">
              <Text className="text-2xl font-bold text-center text-blue-900">
                Looks like no shows match your criteria.
              </Text>
              <View>
                <Text className="text-2xl font-bold text-center text-blue-900">
                  Or you can visit Popular TV Shows for some suggestions!
                </Text>
                <TouchableOpacity
                  className="flex-row items-center self-center justify-center w-48 h-12 rounded-md bg-violet-800"
                  onPress={() => {
                    navigation.navigate("Shows");
                  }}
                >
                  <Text className="text-lg font-bold text-center text-teal-500">
                    To Popular TV Shows
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      ) : (
        <View className="flex items-center justify-center w-full h-full bg-teal-500">
          <Text className="text-2xl font-bold text-center text-blue-800">
            {
              "Looks like you have not set any genre as your favorites yet. Modify it in Profile => Settings to see changes!"
            }
          </Text>
          <View>
            <Text className="text-2xl font-bold text-center text-blue-800">
              Or you can visit Popular TV Shows for some suggestions!
            </Text>
            <TouchableOpacity
              className="flex-row items-center self-center justify-center w-48 h-12 rounded-md bg-violet-800"
              onPress={() => {
                navigation.navigate("Shows");
              }}
            >
              <Text className="text-lg font-bold text-center text-teal-500">
                To Popular TV Shows
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  ) : (
    <>
      {localFavActorList && localFavActorList.length > 0 ? (
        <View className="w-full h-full bg-teal-500">
          {/* <Button
            title={orJoinType ? "Search Type: Or" : "Search Type: And"}
            onPress={() => {
              setOrJoinType((prev) => !prev);
            }}
          /> */}
          {/* {realLocalFavActorList && realLocalFavActorList.length > 0 ? ( */}
          <FlatList
            style={{ backgroundColor: "#14b8a6" }}
            ListHeaderComponent={
              <Text className="text-xl font-bold text-center text-blue-900">
                Tap on any person to see the shows they starred in!
              </Text>
            }
            data={realLocalFavActorList}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  className="flex flex-row justify-start h-40 p-px bg-teal-500 border-2 border-blue-800"
                  onPress={() => {
                    navigation.navigate("ForYouTvSeeMore", {
                      actorId: item.actorId,
                      isActor: true,
                      list: localFavTvGenreList,
                      isVietnamese: isVietnamese,
                      type: "actor",
                      orJoinType: orJoinType,
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
            keyExtractor={(item) => item.actorId}
            ListFooterComponent={() => {
              return (
                <TouchableOpacity
                  className="w-[70%] bg-violet-800 flex-row items-center h-12 self-center justify-center border-2 border-blue-800 rounded-lg"
                  onPress={() => {
                    navigation.navigate("Shows");
                  }}
                >
                  <Text className="text-lg font-semibold text-center text-teal-500">
                    To Popular Shows
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
          {/* ) : (
            <View className="flex items-center justify-center w-full h-full">
              <Text className="text-2xl font-bold text-center">
                Looks like no shows match your criteria.
              </Text>
              <View>
                <Text className="text-2xl font-bold text-center">
                  Or you can visit Popular TV Shows for some suggestions!
                </Text>
                <TouchableOpacity
                  className="flex-row items-center  h-12 bg-green-600 border-2 rounded-md w-[65%] self-center"
                  onPress={() => {
                    navigation.navigate("Shows");
                  }}
                >
                  <Text className="text-base font-medium text-center text-white">
                    To Popular TV Shows
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )} */}
        </View>
      ) : (
        <View className="flex items-center justify-center w-full h-full bg-teal-500">
          <Text className="text-2xl font-bold text-center text-blue-800">
            Looks like you have not set any actor as your favorites yet. Like
            some people to see changes!
          </Text>
          <View>
            <Text className="text-2xl font-bold text-center text-blue-800">
              Or you can visit Popular TV Shows for some suggestions!
            </Text>
            <TouchableOpacity
              className="flex-row items-center self-center justify-center w-48 h-12 rounded-md bg-violet-800"
              onPress={() => {
                navigation.navigate("Shows");
              }}
            >
              <Text className="text-lg font-bold text-center text-teal-500">
                To Popular TV Shows
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default ForYouTvStack;
