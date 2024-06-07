import React, { useEffect, useLayoutEffect, useState, useContext } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import HorizontalFlatList from "./HorizontalFlatList";
import { useNavigation } from "@react-navigation/native";
import Loading from "./Loading";
import axios from "axios";
import { Context } from "./Context";
import { createStackNavigator } from "@react-navigation/stack";
import EpisodeDetailsStack from "./EpisodeDetails";
import MoreMovieAndShowImageList from "./MoreMovieAndShowImageList";
import VideoList from "./VideoList";
const Stack = createStackNavigator();

const SeasonDetailsStack = ({ route }) => {
  const { header, series_id, season_number, origin } = route.params;

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#5b21b6" },
        headerTintColor: "#14b8a6",
      }}
    >
      <Stack.Screen
        name="SeasonDetails"
        component={SeasonDetails}
        initialParams={{ header, series_id, season_number, origin }}
      />
      <Stack.Screen
        name="ShowEpsideInfo"
        component={EpisodeDetailsStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MoreSeasonImages"
        component={MoreMovieAndShowImageList}
        options={{ headerTitle: "More Images" }}
      />
      <Stack.Screen
        name="SeasonVideoList"
        component={VideoList}
        options={{ headerTitle: "Related Videos" }}
      />
    </Stack.Navigator>
  );
};
const SeasonDetails = ({ route }) => {
  const { sessionId } = useContext(Context);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const navigation = useNavigation();
  const [mergedList, setMergedList] = useState([]);
  const { series_id, season_number, header, origin } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [info, setInfo] = useState({});

  useLayoutEffect(() => {
    navigation.setOptions({ title: header });
  }, [navigation, header]);
  const fetchInfo = () => {
    axios
      .get(
        `https://api.themoviedb.org/3/tv/${series_id}/season/${season_number}?api_key=841da308423b4b64ea4d57d052583683`
      )
      .then((response) => {
        setInfo(response.data);
        //console.log("success", response.data);
        axios
          .get(
            `https://api.themoviedb.org/3/tv/${series_id}/season/${season_number}/credits?api_key=841da308423b4b64ea4d57d052583683`
          )
          .then((res) => {
            //console.log("success", res.data);
            setCast(res.data.cast);
            setCrew(res.data.crew);
            axios
              .get(
                `https://api.themoviedb.org/3/tv/${series_id}/season/${season_number}/account_states?api_key=841da308423b4b64ea4d57d052583683&session_id=${sessionId}`
              )
              .then((res2) => {
                //console.log("success", res2.data.results)
                if (
                  response.data.episodes.length > 0 &&
                  res2.data.results.length > 0
                ) {
                  const mergedList = response.data.episodes.map((episode) => {
                    const result = res2.data.results.find(
                      (result) =>
                        result.episode_number === episode.episode_number
                    );
                    return { ...episode, rated: result ? result.rated : false };
                  });
                  setMergedList(mergedList);
                }
              })
              .catch((err) => {
                console.error(err);
              });
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    console.log(
      "season number: ",
      season_number,
      "series id:",
      series_id,
      "origin: ",
      origin
    );
    fetchInfo();
  }, []);

  return !isLoading ? (
    <ScrollView className="w-full px-4 bg-teal-500">
      {info.poster_path ? (
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/original/${info.poster_path}`,
          }}
          className="self-center w-full h-[480] rounded-lg mt-4"
        />
      ) : (
        <Image
          source={require("./assets/blank.png")}
          className="self-center w-full h-[455] rounded-lg mt-4"
        />
      )}
      <View className="p-3 bg-blue-100 border-2 rounded-md border-violet-800">
        <Text className="mt-4 text-3xl font-bold text-center">{info.name}</Text>
        {info.overview ? (
          <>
            <Text className="text-lg font-semibold">Sypnosis:</Text>
            <Text className="text-base">{info.overview}</Text>
          </>
        ) : null}
        {info.vote_average ? (
          <Text className="text-base italic text-sky-600">
            <Text className="text-lg font-semibold text-black">Ratings: </Text>
            {info.vote_average}
          </Text>
        ) : null}
      </View>
      <View className="flex flex-row items-center w-full my-3 justify-evenly">
        <TouchableOpacity
          onPress={() => {
            navigation.push("MoreSeasonImages", {
              id: series_id,
              type: "tvseason",
              season_number: season_number,
              episode_number: false,
            });
          }}
          className="h-16  w-[48%] rounded-lg bg-violet-800 justify-center items-center"
        >
          <Text className="text-lg font-bold text-teal-500">More Images</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.push("SeasonVideoList", {
              id: series_id,
              type: "tvseason",
              season_number: season_number,
              episode_number: false,
            });
          }}
          className="h-16  w-[48%] rounded-lg bg-violet-800 justify-center items-center"
        >
          <Text className="text-lg font-bold text-teal-500">
            Related Videos
          </Text>
        </TouchableOpacity>
      </View>
      {cast && cast.length > 0 ? (
        <>
          <View
            style={{
              padding: 16,
              //backgroundColor: "rgba(255, 255, 255, 0.5)", // Set the desired background color with opacity
            }}
            className="backdrop-blur-3xl"
          >
            <Text className="text-2xl font-extrabold ">Cast:</Text>
          </View>
          {/* <FlatList
            className="mb-4"
            data={cast}
            initialNumToRender={5}
            maxToRenderPerBatch={7}
            updateCellsBatchingPeriod={1000}
            horizontal // Set the horizontal prop to true
            showsHorizontalScrollIndicator={false} // Optional: hide the horizontal scroll indicator
            keyExtractor={(item) => item.credit_id.toString()} // Convert the ID to a string for the keyExtractor
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.push("ShowPersonProfile", {
                    id: item.id,
                    origin: origin,
                    header: item.name,
                  });
                }}
                className="items-center px-1 pt-4 mx-1 bg-gray-300 rounded-lg w-[180] h-[300]"
              >
                {item.profile_path ? (
                  <Image
                    source={{
                      uri: `https://image.tmdb.org/t/p/w185/${item.profile_path}`,
                    }}
                    className="w-4/5 h-3/4"
                  />
                ) : (
                  <Image
                    source={require("./assets/blank_avatar.jpg")}
                    className="w-4/5 h-3/4"
                  />
                )}

                <Text className="text-base font-bold text-center">
                  {truncateName(item.name)}
                </Text>
                <Text className="text-sm font-bold text-center">
                  {truncateRole(item.character)}
                </Text>
              </TouchableOpacity>
            )}
          /> */}
          <HorizontalFlatList
            data={cast}
            level2Text={true}
            level3Text={false}
            level4Text={false}
            navigationDestination={"ShowPersonProfile"}
            origin={origin}
            dataType={"personcast"}
            series_id={null}
            movie_id={null}
            season_number={null}
          />
        </>
      ) : null}
      {crew && crew.length > 0 ? (
        <>
          <View
            style={{
              padding: 16,
              //backgroundColor: "rgba(255, 255, 255, 0.5)", // Set the desired background color with opacity
            }}
            className="backdrop-blur-3xl"
          >
            <Text className="text-2xl font-extrabold ">Crew:</Text>
          </View>
          {/* <FlatList
            className="mb-4"
            data={crew}
            initialNumToRender={5}
            maxToRenderPerBatch={7}
            updateCellsBatchingPeriod={1000}
            horizontal // Set the horizontal prop to true
            showsHorizontalScrollIndicator={false} // Optional: hide the horizontal scroll indicator
            keyExtractor={(item) => item.credit_id.toString()} // Convert the ID to a string for the keyExtractor
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.push("ShowPersonProfile", {
                    id: item.id,
                    origin: origin,
                    header: item.name,
                  });
                }}
                className="items-center px-1 pt-4 mx-1 bg-gray-300 rounded-lg w-[180] h-[300]"
              >
                {item.profile_path ? (
                  <Image
                    source={{
                      uri: `https://image.tmdb.org/t/p/w185/${item.profile_path}`,
                    }}
                    className="w-4/5 h-3/4"
                  />
                ) : (
                  <Image
                    source={require("./assets/blank_avatar.jpg")}
                    className="w-4/5 h-3/4"
                  />
                )}

                <Text className="text-base font-bold text-center">
                  {truncateName(item.name)}
                </Text>
                <Text className="text-sm font-bold text-center">
                  {truncateRole(item.job)}
                </Text>
              </TouchableOpacity>
            )}
          /> */}
          <HorizontalFlatList
            data={crew}
            level2Text={true}
            level3Text={false}
            level4Text={false}
            navigationDestination={"ShowPersonProfile"}
            origin={origin}
            dataType={"personcrew"}
            series_id={null}
            movie_id={null}
            season_number={null}
          />
        </>
      ) : null}
      {mergedList && mergedList.length > 0 ? (
        <>
          <View
            style={{
              padding: 16,
              //backgroundColor: "rgba(255, 255, 255, 0.5)", // Set the desired background color with opacity
            }}
            className="backdrop-blur-3xl"
          >
            <Text className="text-2xl font-extrabold ">Episodes:</Text>
          </View>

          {/* <FlatList
            className="mb-4"
            data={mergedList}
            initialNumToRender={5}
            maxToRenderPerBatch={7}
            updateCellsBatchingPeriod={1000}
            horizontal // Set the horizontal prop to true
            showsHorizontalScrollIndicator={false} // Optional: hide the horizontal scroll indicator
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ShowEpsideInfo", {
                    season_number: season_number,
                    header: item.name,
                    origin: origin,
                    series_id: series_id,
                    episode_number: item.episode_number,
                  });
                }}
                className="items-center w-40 px-1 pt-4 mx-1 bg-gray-300 rounded-lg h-72"
              >
                {item.still_path ? (
                  <Image
                    source={{
                      uri: `https://image.tmdb.org/t/p/w300/${item.still_path}`,
                    }}
                    className="w-3/4 h-2/3"
                  />
                ) : (
                  <Image
                    source={require("./assets/blank.png")}
                    className="w-3/4 h-2/3"
                  />
                )}
                <Text className="text-sm font-bold text-center">
                  {item.name}
                </Text>

                <View className="flex flex-row items-center justify-evenly">
                  {item.air_date ? (
                    <Text className="w-1/3 text-sm font-medium ">
                      {item.air_date.split("-")[0]}
                    </Text>
                  ) : null}

                  <Badge
                    value={item.vote_average}
                    status="primary"
                    badgeStyle={{ height: 22 }}
                    textStyle={{
                      fontSize: 15,
                      fontWeight: "bold",
                      color: "white",
                    }}
                    className="w-1/3"
                  />
                </View>
                {item.rated.value ? (
                  <View className="flex flex-row items-center justify-evenly">
                    <Text className="w-1/3 text-sm font-medium ">
                      Your rating:
                    </Text>

                    <Badge
                      value={item.rated.value}
                      status="primary"
                      badgeStyle={{ height: 22 }}
                      textStyle={{
                        fontSize: 15,
                        fontWeight: "bold",
                        color: "white",
                      }}
                      className="w-1/3"
                    />
                  </View>
                ) : null}
              </TouchableOpacity>
            )}
          /> */}
          <HorizontalFlatList
            data={mergedList}
            level2Text={true}
            level3Text={true}
            level4Text={false}
            navigationDestination={"ShowEpsideInfo"}
            origin={origin}
            dataType={"episode"}
            series_id={series_id}
            movie_id={null}
            season_number={season_number}
          />
        </>
      ) : null}
    </ScrollView>
  ) : (
    <Loading />
  );
};

export default SeasonDetailsStack;
