import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  insertFavTv,
  insertWatchlistTv,
  deleteFavTv,
  deleteWatchlistTv,
} from "./Database";
import axios from "axios";
import Loading from "./Loading";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import VideoList from "./VideoList";
import { createStackNavigator } from "@react-navigation/stack";
import VideoWebView from "./VideoWebView";
import RatingModal from "./RatingModal";
import { Context } from "./Context";
import Review from "./Review";
import PersonProfileStack from "./PersonProfile";
import SeasonDetailsStack from "./SeasonDetails";
import HorizontalFlatList from "./HorizontalFlatList";
const Stack = createStackNavigator();
import MoreMovieAndShowImageList from "./MoreMovieAndShowImageList";
function ShowDetails({ route }) {
  const { series_id, header, origin } = route.params;

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#5b21b6" },
        headerTintColor: "#14b8a6",
      }}
    >
      <Stack.Screen
        name="ShowDetailInfo"
        component={ShowDetailInfo}
        initialParams={{ series_id: series_id, origin: origin, header: header }}
      />
      <Stack.Screen
        name="ShowReview"
        component={Review}
        initialParams={{ id: series_id, type: "tv" }}
        options={{ headerTitle: `Reviews for: ${header}` }}
      />
      <Stack.Screen
        name="ShowSeasonInfo"
        component={SeasonDetailsStack}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ShowVideoList"
        component={VideoList}
        //initialParams={{ id: id, type: "movie" }}
        options={{ headerTitle: "Related Videos" }}
      />
      <Stack.Screen
        name="ShowPersonProfile"
        component={PersonProfileStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MoreShowImageList"
        component={MoreMovieAndShowImageList}
        options={{ headerTitle: "More Images" }}
      />

      <Stack.Screen name="ShowVideoWebView" component={VideoWebView} />
    </Stack.Navigator>
  );
}

const ShowDetailInfo = ({ route }) => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: header });
  }, [navigation, header]);
  const [crew, setCrew] = useState([]);
  const [cast, setCast] = useState([]);
  const { sessionId, accountDetail } = useContext(Context);
  const navigation2 = useNavigation();
  const { series_id, origin, header } = route.params;
  const [showDetail, setShowDetail] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState();
  const [recommendations, setRecommendations] = useState("");
  const [seasons, setSeasons] = useState("");
  const [isRecommendationsLoading, setIsRecommendationsLoading] =
    useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isRated, setIsRated] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [sliderValue, setSliderValue] = useState(5);
  const [localRatings, setLocalRatings] = useState(false);
  const pushLocation =
    origin === "tvmain"
      ? "MainShowDetail"
      : origin === "tvsearch"
      ? "SearchTvDetails"
      : origin === "tvdiscover"
      ? "DiscoverTv"
      : "MyTvDetails";

  const handleInsertFavTv = async (tvId, posterImageUrl, name, date) => {
    try {
      await insertFavTv(tvId, posterImageUrl, name, date);
      //fetchFavMovieFromDatabase(); // Fetch updated after deleting
    } catch (error) {
      console.error("Error inserting fav tv", error);
    }
  };
  const handleDeleteFavTv = async (tvId) => {
    try {
      await deleteFavTv(tvId);
      //fetchFavMovieFromDatabase(); // Fetch updated after deleting
    } catch (error) {
      console.error("Error inserting fav tv", error);
    }
  };

  const handleInsertWatchilistTv = async (tvId, posterImageUrl, name, date) => {
    try {
      await insertWatchlistTv(tvId, posterImageUrl, name, date);
      //fetchFavMovieFromDatabase(); // Fetch updated after deleting
    } catch (error) {
      console.error("Error inserting fav tv", error);
    }
  };
  const handleDeleteWatchlistTv = async (tvId) => {
    try {
      await deleteWatchlistTv(tvId);
      //fetchFavMovieFromDatabase(); // Fetch updated after deleting
    } catch (error) {
      console.error("Error inserting fav tv", error);
    }
  };

  const GetShowInfo = () => {
    axios
      .get(
        `https://api.themoviedb.org/3/tv/${series_id}?api_key=841da308423b4b64ea4d57d052583683`
      )
      .then((res) => {
        //console.log(res.data);
        setShowDetail(res.data);
        setGenre(res.data.genres.map((genre) => genre.name).join(", "));
        setLanguage(
          res.data.spoken_languages.map((language) => language.english_name)
        );
        setSeasons(res.data.seasons);
        axios
          .get(
            `https://api.themoviedb.org/3/tv/${series_id}/account_states?api_key=841da308423b4b64ea4d57d052583683&session_id=${sessionId}`
          )
          .then((res) => {
            //console.log(res.data);
            setIsFavorited(res.data.favorite);
            setIsInWatchlist(res.data.watchlist);
            setIsRated(res.data.rated);
            setSliderValue(res.data.rated ? res.data.rated.value : 5);
            axios
              .get(
                `https://api.themoviedb.org/3/tv/${series_id}/credits?api_key=841da308423b4b64ea4d57d052583683`
              )
              .then((res) => {
                //console.log(res.data.cast);
                setCast(res.data.cast);
                setCrew(res.data.crew);
                axios
                  .get(
                    `https://api.themoviedb.org/3/tv/${series_id}/recommendations?api_key=841da308423b4b64ea4d57d052583683`
                  )
                  .then((res) => {
                    //console.log(res);
                    setRecommendations(res.data.results);
                    setIsRecommendationsLoading(false);
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
          });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  // useEffect(() => {
  //   GetShowInfo();
  //   //console.log(id, origin);
  // }, []);
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      GetShowInfo();
    }, [])
  );

  const handleHeartPress = (id, posterUrl, name, date) => {
    //console.log("HeartPressed");
    const newState = !isFavorited;
    setIsFavorited(newState);
    axios
      .post(
        `https://api.themoviedb.org/3/account/${accountDetail.id}/favorite?api_key=841da308423b4b64ea4d57d052583683&session_id=${sessionId}`,
        {
          media_type: "tv",
          media_id: series_id,
          favorite: newState,
        }
      )
      .then((response) => {
        //console.log("changed fav state:", response.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        if (newState) {
          handleInsertFavTv(id, posterUrl, name, date);
        } else {
          handleDeleteFavTv(id);
        }
      });
  };
  const handleBookmarkPress = (id, posterUrl, name, date) => {
    //console.log("BookmarkPressed");
    const newState = !isInWatchlist;
    setIsInWatchlist(newState);
    axios
      .post(
        `https://api.themoviedb.org/3/account/${accountDetail.id}/watchlist?api_key=841da308423b4b64ea4d57d052583683&session_id=${sessionId}`,
        {
          media_type: "tv",
          media_id: series_id,
          watchlist: newState,
        }
      )
      .then((response) => {
        // console.log("changed watchlist state:", response.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        if (newState) {
          handleInsertWatchilistTv(id, posterUrl, name, date);
        } else {
          handleDeleteWatchlistTv(id);
        }
      });
  };
  const handleStarPress = () => {
    //console.log("StarPressed");
    if (isRated === false) {
      setSliderValue(5);
    }
    setModalVisible(true);
  };

  return isLoading || showDetail === null ? (
    <Loading />
  ) : (
    <>
      <RatingModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        isRated={isRated}
        sliderValue={sliderValue}
        setSliderValue={setSliderValue}
        id={series_id}
        setIsRated={setIsRated}
        type={"tv"}
        setLocalRatings={setLocalRatings}
        season_number={false}
        episode_number={false}
        poster={showDetail.poster_path}
        name={showDetail.name}
        date={showDetail.first_air_date}
      />
      <ScrollView className="px-4 bg-teal-500">
        {showDetail.poster_path ? (
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/original/${showDetail.poster_path}`,
            }}
            className="self-center w-full h-[480] rounded-lg mt-4"
          />
        ) : (
          <Image
            source={require("./assets/blank.png")}
            className="self-center w-full h-[480] rounded-lg mt-4"
          />
        )}
        <View className="p-3 bg-blue-100 border-2 rounded-md border-violet-800">
          <Text className="mt-4 text-2xl font-bold text-center">
            {showDetail.name}
          </Text>
          {showDetail.tagline ? (
            <Text className="my-2 text-base italic text-center">
              "{showDetail.tagline}"
            </Text>
          ) : null}
          {sessionId ? (
            <>
              <View className="flex flex-row w-full justify-evenly">
                <TouchableOpacity
                  className="items-center w-1/3 text-center"
                  onPress={() => {
                    handleHeartPress(
                      series_id,
                      showDetail.poster_path,
                      showDetail.name,
                      showDetail.first_air_date
                    );
                  }}
                >
                  <AntDesign
                    name={isFavorited ? "heart" : "hearto"}
                    size={30}
                    color={isFavorited ? "fuchsia" : "black"}
                  />
                  {isFavorited ? (
                    <Text className="text-center">Favorited</Text>
                  ) : (
                    <Text className="text-center">Add to Favorites</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  className="items-center w-1/3 text-center"
                  onPress={() => {
                    handleBookmarkPress(
                      series_id,
                      showDetail.poster_path,
                      showDetail.name,
                      showDetail.first_air_date
                    );
                  }}
                >
                  <FontAwesome
                    name={isInWatchlist ? "bookmark" : "bookmark-o"}
                    size={30}
                    color={isInWatchlist ? "red" : "black"}
                  />
                  {isInWatchlist ? (
                    <Text className="text-center"> In Watchlist</Text>
                  ) : (
                    <Text className="text-center">Add to Watchlist</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  className="items-center w-1/3 text-center"
                  onPress={() => {
                    handleStarPress();
                  }}
                >
                  <FontAwesome
                    name={isRated ? "star" : "star-o"}
                    size={30}
                    color={isRated ? "#E06e0a" : "black"}
                  />
                  {isRated ? (
                    <Text className="text-center">
                      Tap to change your rating
                    </Text>
                  ) : (
                    <Text className="text-center">Add your rating</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          ) : null}
          {isRated.value ? (
            <Text className="text-base italic text-sky-600">
              <Text className="text-lg font-semibold text-black">
                Your rating:{" "}
              </Text>
              {isRated.value}
            </Text>
          ) : localRatings ? (
            <Text className="text-base italic text-sky-600">
              <Text className="text-lg font-semibold text-black">
                Your rating:{" "}
              </Text>
              {localRatings}
            </Text>
          ) : null}
          {showDetail.overview ? (
            <>
              <Text className="text-lg font-semibold">Sypnosis:</Text>
              <Text className="text-base">{showDetail.overview}</Text>
            </>
          ) : null}

          <Text className="text-base italic text-sky-600">
            <Text className="text-lg font-semibold text-black">
              In production:{" "}
            </Text>
            {showDetail.in_production ? "Yes" : "No"}
          </Text>
          {showDetail.status ? (
            <Text className="text-base italic text-sky-600">
              <Text className="text-lg font-semibold text-black">Status: </Text>
              {showDetail.status}
            </Text>
          ) : null}

          {genre ? (
            <Text className="text-base italic text-sky-600">
              <Text className="text-lg font-semibold text-black">Genre: </Text>
              {genre}
            </Text>
          ) : null}

          {showDetail.number_of_episodes > 0 ? (
            <Text className="text-base italic text-sky-600">
              <Text className="text-lg font-semibold text-black">
                Number of episodes:{" "}
              </Text>
              {showDetail.number_of_episodes}
            </Text>
          ) : null}
          {showDetail.number_of_seasons > 0 ? (
            <Text className="text-base italic text-sky-600">
              <Text className="text-lg font-semibold text-black">
                Number of seasons:{" "}
              </Text>
              {showDetail.number_of_seasons}
            </Text>
          ) : null}

          {language && language.length > 0 ? (
            language.length > 1 ? (
              <Text className="text-base italic text-sky-600">
                <Text className="text-lg font-semibold text-black">
                  Spoken languages:{" "}
                </Text>
                {language.join(", ")}
              </Text>
            ) : (
              <Text className="text-base italic text-sky-600">
                <Text className="text-lg font-semibold text-black">
                  Spoken languages:{" "}
                </Text>
                {language.join(", ")}
              </Text>
            )
          ) : null}

          {showDetail.first_air_date ? (
            <Text className="text-base italic text-sky-600">
              <Text className="text-lg font-semibold text-black">
                First air date:{" "}
              </Text>
              {showDetail.first_air_date}
            </Text>
          ) : null}
          {showDetail.last_air_date ? (
            <Text className="text-base italic text-sky-600">
              <Text className="text-lg font-semibold text-black">
                Last air date:{" "}
              </Text>
              {showDetail.last_air_date}
            </Text>
          ) : null}
        </View>
        <View className="flex flex-row items-center justify-between w-full mt-3">
          <TouchableOpacity
            onPress={() => {
              navigation2.navigate("MoreShowImageList", {
                id: series_id,
                type: "tv",
                season_number: false,
                episode_number: false,
              });
            }}
            className="h-16  w-[48%] rounded-lg bg-violet-800 justify-center items-center"
          >
            <Text className="text-lg font-bold text-teal-500">More Images</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation2.navigate("ShowVideoList", {
                id: series_id,
                type: "tv",
                season_number: false,
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
        <View className="flex flex-row items-center w-full mt-4 justify-evenly">
          <TouchableOpacity
            onPress={() => {
              navigation2.navigate("ShowReview");
            }}
            className="h-16  w-[60%] rounded-lg bg-violet-800 justify-center items-center"
          >
            <Text className="text-lg font-bold text-teal-500">See Reviews</Text>
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
              horizontal // Set the horizontal prop to true
              showsHorizontalScrollIndicator={false} // Optional: hide the horizontal scroll indicator
              keyExtractor={(item) => item.credit_id.toString()} // Convert the ID to a string for the keyExtractor
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation2.push("ShowPersonProfile", {
                      id: item.id,
                      origin: origin,
                      header: item.name,
                    });
                  }}
                  className="items-center h-64 pt-4 mx-1 bg-gray-300 rounded-lg w-50"
                >
                  {item.profile_path ? (
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w185/${item.profile_path}`,
                      }}
                      className="w-4/5 h-60"
                    />
                  ) : (
                    <Image
                      source={require("./assets/blank_avatar.jpg")}
                      className="w- h-60"
                    />
                  )}

                  <Text className="text-base font-bold text-center">
                    {item.name}
                  </Text>
                  <Text className="text-sm font-bold text-center">
                    {item.character}
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
              horizontal // Set the horizontal prop to true
              showsHorizontalScrollIndicator={false} // Optional: hide the horizontal scroll indicator
              keyExtractor={(item) => item.credit_id.toString()} // Convert the ID to a string for the keyExtractor
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation2.push("ShowPersonProfile", {
                      id: item.id,
                      origin: origin,
                      header: item.name,
                    });
                  }}
                  className="items-center w-40 h-64 px-1 pt-4 mx-1 bg-gray-300 rounded-lg"
                >
                  {item.profile_path ? (
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w185/${item.profile_path}`,
                      }}
                      className="w-3/4 h-2/3"
                    />
                  ) : (
                    <Image
                      source={require("./assets/blank_avatar.jpg")}
                      className="w-3/4 h-2/3"
                    />
                  )}

                  <Text className="text-base font-bold text-center">
                    {item.name}
                  </Text>
                  <Text className="text-sm font-bold text-center">
                    {item.job}
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
        {seasons && seasons.length > 0 ? (
          <>
            <View
              style={{
                padding: 16,
                //backgroundColor: "rgba(255, 255, 255, 0.5)", // Set the desired background color with opacity
              }}
              className="backdrop-blur-3xl"
            >
              <Text className="text-2xl font-extrabold ">Seasons:</Text>
            </View>
            {/* <FlatList
              className="mb-4"
              data={seasons}
              initialNumToRender={5}
              maxToRenderPerBatch={7}
              updateCellsBatchingPeriod={1000}
              horizontal // Set the horizontal prop to true
              showsHorizontalScrollIndicator={false} // Optional: hide the horizontal scroll indicator
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="items-center px-1 pt-4 mx-1 bg-gray-300 rounded-lg w-[180] h-[300]"
                  onPress={() => {
                    navigation2.navigate("ShowSeasonInfo", {
                      header: item.name,
                      series_id: id,
                      season_number: item.season_number,
                      origin: origin,
                    });
                  }}
                >
                  {item.poster_path ? (
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w154/${item.poster_path}`,
                      }}
                      className="w-4/5 h-3/4"
                    />
                  ) : (
                    <Image
                      source={require("./assets/blank.png")}
                      className="w-3/4 h-2/3"
                    />
                  )}

                  <Text className="text-base font-bold text-center">
                    {truncateSeasonName(item.name)}
                  </Text>
                  <View className="flex flex-row items-center justify-evenly">
                    {item.air_date ? (
                      <Text className="w-1/3 text-sm font-medium ">
                        {item.air_date.split("-")[0]}
                      </Text>
                    ) : (
                      <></>
                    )}
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
                  <Text className="text-base font-bold">
                    Episodes: {item.episode_count}
                  </Text>
                </TouchableOpacity>
              )}
            /> */}
            <HorizontalFlatList
              movie_id={null}
              data={seasons}
              level2Text={false}
              level3Text={true}
              level4Text={true}
              navigationDestination={"ShowSeasonInfo"}
              origin={origin}
              dataType={"season"}
              series_id={series_id}
              season_number={null}
            />
          </>
        ) : null}
        {recommendations && recommendations.length > 0 ? (
          <>
            <View
              style={{
                padding: 16,
                //backgroundColor: "rgba(255, 255, 255, 0.5)", // Set the desired background color with opacity
              }}
              className="backdrop-blur-3xl"
            >
              <Text className="text-2xl font-extrabold ">
                You may also like:
              </Text>
            </View>
            {isRecommendationsLoading ? (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                style={{ marginVertical: 10 }}
              />
            ) : (
              // <FlatList
              //   className="mb-4"
              //   data={recommendations}
              //   initialNumToRender={5}
              //   maxToRenderPerBatch={7}
              //   updateCellsBatchingPeriod={1000}
              //   horizontal // Set the horizontal prop to true
              //   showsHorizontalScrollIndicator={false} // Optional: hide the horizontal scroll indicator
              //   keyExtractor={(item) => item.id.toString()}
              //   renderItem={({ item }) => (
              //     <TouchableOpacity
              //       onPress={() => {
              //         navigation2.push(pushLocation, {
              //           id: item.id,
              //           header: item.name,
              //           origin: origin,
              //         });
              //       }}
              //       className="items-center w-40 px-1 pt-4 mx-1 bg-gray-300 rounded-lg h-72"
              //     >
              //       {item.poster_path ? (
              //         <Image
              //           source={{
              //             uri: `https://image.tmdb.org/t/p/w154/${item.poster_path}`,
              //           }}
              //           className="w-3/4 h-2/3"
              //         />
              //       ) : (
              //         <Image
              //           source={require("./assets/blank.png")}
              //           className="w-3/4 h-2/3"
              //         />
              //       )}
              //       <Text className="text-sm font-bold text-center">
              //         {item.name}
              //       </Text>

              //       <View className="flex flex-row items-center justify-evenly">
              //         <Text className="w-1/3 text-sm font-medium ">
              //           {item.first_air_date.split("-")[0]}
              //         </Text>
              //         <Badge
              //           value={item.vote_average}
              //           status="primary"
              //           badgeStyle={{ height: 22 }}
              //           textStyle={{
              //             fontSize: 15,
              //             fontWeight: "bold",
              //             color: "white",
              //           }}
              //           className="w-1/3"
              //         />
              //       </View>
              //     </TouchableOpacity>
              //   )}
              // />
              <HorizontalFlatList
                movie_id={null}
                data={recommendations}
                level2Text={false}
                level3Text={true}
                level4Text={false}
                navigationDestination={pushLocation}
                origin={origin}
                dataType={"show"}
                series_id={series_id}
                season_number={null}
              />
            )}
          </>
        ) : null}
      </ScrollView>
    </>
  );
};

export default ShowDetails;
