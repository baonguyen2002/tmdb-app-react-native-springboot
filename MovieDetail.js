import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import ForyouMovieStack from "./ForYouMovie";
import { apiBaseUrl } from "./API";
import { Badge } from "@rneui/themed";
import {
  insertFavMovie,
  deleteFavMovie,
  checkExistedInFavMovie,
  getGenreScore,
  updateScore,
  checkExistedInRatedMovie,
  fetchRecentMovie,
} from "./Database";
import Review from "./Review";
//import { insertFlaggedMovie, fetchFlaggedMovie } from "./Database";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import PersonProfileStack from "./PersonProfile";
import VideoList from "./VideoList";
import Loading from "./Loading";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Context } from "./Context";
import { createStackNavigator } from "@react-navigation/stack";
import VideoWebView from "./VideoWebView";
const Stack = createStackNavigator();
import RatingModal from "./RatingModal";
import MoreMovieAndShowImageList from "./MoreMovieAndShowImageList";
import HorizontalFlatList from "./HorizontalFlatList";
import { FlatList } from "react-native-gesture-handler";
function MovieDetail({ route, navigation }) {
  const { movie_id, header, origin } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({ title: header });
  }, [navigation, header]);
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#5b21b6" },
        headerTintColor: "#14b8a6",
      }}
    >
      <Stack.Screen
        name="MovieDetailInfo"
        component={MovieDetailInfo}
        initialParams={{ movie_id: movie_id, origin: origin }}
        options={{ headerTitle: header }}
      />
      <Stack.Screen
        name="MovieReview"
        component={Review}
        initialParams={{ id: movie_id, type: "movie" }}
        options={{ headerTitle: `Reviews for: ${header}` }}
      />
      <Stack.Screen
        name="MovieVideoList"
        component={VideoList}
        options={{ headerTitle: "Related Videos" }}
      />
      <Stack.Screen
        name="MoviePersonProfile"
        component={PersonProfileStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MoreMovieImageList"
        component={MoreMovieAndShowImageList}
        options={{ headerTitle: "More Images" }}
      />

      <Stack.Screen name="MovieVideoWebView" component={VideoWebView} />
    </Stack.Navigator>
  );
}

const MovieDetailInfo = ({ route }) => {
  const [sliderValue, setSliderValue] = useState(5);
  const navigation2 = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const { movie_id, origin } = route.params;
  const [movieDetail, setMovieDetail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [genre, setGenre] = useState("");
  const [genreId, setGenreId] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isRated, setIsRated] = useState(false);
  const [language, setLanguage] = useState(false);
  const [localRatings, setLocalRatings] = useState(false);
  const [recentMovie, setRecentMovie] = useState(false);
  //const [favMovieList, setFavMovieList] = useState([]);

  const pushLocation =
    origin === "moviemain"
      ? "MainMovieDetail"
      : origin === "moviesearch"
      ? "SearchMovieDetails"
      : origin === "moviediscover"
      ? "DiscoverMovie"
      : origin === "moviesuggestions"
      ? "SuggestionsMovieDetail"
      : "MyMovieDetails";

  const checkFavStatus = async () => {
    try {
      const isFaved = await checkExistedInFavMovie(movie_id);
      setIsFavorited(isFaved);
      //console.log("isFaved: ", isFaved);
    } catch (error) {
      console.log("Error checking fav status:", error);
    }
  };
  const handleInsertFavMovie = async (movieId, posterImageUrl, name, date) => {
    try {
      await insertFavMovie(movieId, posterImageUrl, name, date);
      //fetchFavMovieFromDatabase(); // Fetch updated after deleting
    } catch (error) {
      console.error("Error inserting fav movie", error);
    }
  };

  const checkRatedStatus = async () => {
    try {
      const isRatedInDb = await checkExistedInRatedMovie(movie_id);
      //console.log(isRatedInDb);
      if (isRatedInDb.length > 0) {
        setIsRated(isRatedInDb[0]);
        setSliderValue(isRatedInDb[0].ratedValue);
        setLocalRatings(isRatedInDb[0].ratedValue);
        //console.log("isRatedInDb: ", isRatedInDb[0]);
      }
    } catch (error) {
      console.log("Error checking rated status:", error);
    }
  };

  const handleDeleteFavMovie = async (movieId) => {
    try {
      await deleteFavMovie(movieId);
      // fetchFavMovieFromDatabase(); // Fetch updated after deleting
    } catch (error) {
      console.error("Error delete fav movie", error);
    }
  };

  const GetMovieInfo = () => {
    axios
      .get(`${apiBaseUrl}/movie/${movie_id}`)
      .then((res) => {
        //console.log("movies info: ", res.data);
        setMovieDetail(res.data);
        setGenre(res.data.genres.map((genre) => genre.name).join(", "));
        setGenreId(res.data.genres);
        setLanguage(
          res.data.spoken_languages.map((language) => language.english_name)
        );
        let gerneIdList = res.data.genres
          .map((genre) => genre.genreId)
          .join(", ");
        //console.log("genres info: ", gerneIdList);
        axios
          .get(`${apiBaseUrl}/movie/search-by-genre?genreIds=${gerneIdList}`)
          .then((response) => {
            //console.log(response.data);
            setRecommendations(response.data);
          })
          .catch((err) => {
            console.error(err);
          });
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };
  // useEffect(() => {
  //   GetMovieInfo();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      checkFavStatus();
      checkRatedStatus();
      fetchRecentMovieFromDB();
      GetMovieInfo();
    }, [])
  );
  const fetchRecentMovieFromDB = async () => {
    try {
      const movieList = await fetchRecentMovie();
      if (movieList.length > 0) {
        setRecentMovie(movieList);
        //console.log("fetched recentMovie: ", movieList);
      }
    } catch (error) {
      console.log("Error fetching recentMovie:", error);
      return;
    }
  };
  const fetchScoreFromDatabase = async (id) => {
    try {
      const scoreDict = await getGenreScore(id);
      const score = scoreDict[0].score;
      //console.log("fetched score: ", score);
      return score;
    } catch (error) {
      console.log("Error fetching score:", error);
      return;
    }
  };
  const updateScoreInDatabase = async (
    genreId,
    currentScore,
    value,
    isAdding
  ) => {
    try {
      await updateScore(genreId, currentScore, value, isAdding);
      //fetchFavMovieFromDatabase(); // Fetch updated after deleting
    } catch (error) {
      console.error("Error updating score", error);
    }
  };

  const handleHeartPress = async (posterImageUrl, movieName, date) => {
    //console.log("HeartPressed");
    const newState = !isFavorited;
    setIsFavorited(newState);
    //console.log(genreId);
    if (newState) {
      handleInsertFavMovie(movie_id, posterImageUrl, movieName, `${date}`);
      for (let genreItem of genreId) {
        const genre_id = genreItem.genreId;
        const score = await fetchScoreFromDatabase(genre_id);
        //console.log(score);
        await updateScoreInDatabase(genre_id, score, 2, newState);
      }
    } else {
      handleDeleteFavMovie(movie_id);
      for (let genreItem of genreId) {
        const genre_id = genreItem.genreId;
        const score = await fetchScoreFromDatabase(genre_id);
        //console.log(score);
        await updateScoreInDatabase(genre_id, score, 2, newState);
      }
    }
  };

  const handleStarPress = () => {
    //console.log("StarPressed");
    setModalVisible(true);
  };
  return isLoading || movieDetail === null ? (
    <Loading />
  ) : (
    <>
      <RatingModal
        oldRating={localRatings}
        updateScoreInDatabase={updateScoreInDatabase}
        fetchScoreFromDatabase={fetchScoreFromDatabase}
        genreId={genreId}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        isRated={isRated}
        poster={movieDetail.poster_path}
        name={movieDetail.title}
        sliderValue={sliderValue}
        setSliderValue={setSliderValue}
        id={movie_id}
        date={movieDetail.release_date}
        setIsRated={setIsRated}
        type={"movie"}
        setLocalRatings={setLocalRatings}
        season_number={false}
        episode_number={false}
        //setList={setLocalFlaggedMovieList}
      />
      <ScrollView className="px-4 bg-teal-500">
        {movieDetail.poster_path ? (
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/original/${movieDetail.poster_path}`,
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
            {movieDetail.title}
          </Text>
          {movieDetail.tagline ? (
            <Text className="my-2 text-base italic text-center">
              "{movieDetail.tagline}"
            </Text>
          ) : null}

          <View className="flex flex-row w-full justify-evenly">
            <TouchableOpacity
              className="items-center w-1/3 text-center"
              onPress={() => {
                handleHeartPress(
                  movieDetail.poster_path,
                  movieDetail.title,
                  movieDetail.release_date
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
                handleStarPress();
              }}
            >
              <FontAwesome
                name={isRated ? "star" : "star-o"}
                size={30}
                color={isRated ? "#E06e0a" : "black"}
              />
              {isRated ? (
                <Text className="text-center">Tap to change your rating</Text>
              ) : (
                <Text className="text-center">Add your rating</Text>
              )}
            </TouchableOpacity>
          </View>

          {isRated && isRated.ratedValue ? (
            <Text className="text-base italic text-sky-600">
              <Text className="text-lg font-semibold text-black">
                Your rating:{" "}
              </Text>
              {isRated.ratedValue}
            </Text>
          ) : localRatings ? (
            <Text className="text-base italic text-sky-600">
              <Text className="text-lg font-semibold text-black">
                Your rating:{" "}
              </Text>
              {localRatings}
            </Text>
          ) : null}
          {movieDetail.overview ? (
            <>
              <Text className="text-lg font-semibold">Sypnosis:</Text>
              <Text className="text-base">{movieDetail.overview}</Text>
            </>
          ) : null}
          {genre ? (
            <Text className="text-base italic text-sky-600">
              <Text className="text-lg font-semibold text-black">Genre: </Text>
              {genre}
            </Text>
          ) : null}
          {movieDetail.vote_average ? (
            <Text className="text-base italic text-sky-600">
              <Text className="text-lg font-semibold text-black">
                Ratings:{" "}
              </Text>
              {movieDetail.vote_average}
              {movieDetail.vote_count ? (
                <>
                  <Text className="text-lg font-semibold text-black">
                    {" "}
                    from{" "}
                  </Text>
                  <Text>{movieDetail.vote_count} votes</Text>
                </>
              ) : null}
            </Text>
          ) : null}
          {language.length > 0 ? (
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
          {movieDetail.release_date ? (
            <Text className="text-base italic text-sky-600">
              <Text className="text-lg font-semibold text-black">
                Release date:{" "}
              </Text>
              {movieDetail.release_date}
            </Text>
          ) : null}
          {movieDetail.runtime ? (
            <Text className="mb-2 text-base italic text-sky-600">
              <Text className="text-lg font-semibold text-black">
                Runtime:{" "}
              </Text>
              {movieDetail.runtime === 1
                ? `${movieDetail.runtime} minute`
                : `${movieDetail.runtime} minutes`}
            </Text>
          ) : null}
        </View>
        {recommendations.length > 0 ? (
          <>
            <View
              style={{
                padding: 16,
                //backgroundColor: "rgba(255, 255, 255, 0.5)", // Set the desired background color with opacity
              }}
              className="backdrop-blur-3xl"
            >
              <Text className="text-2xl font-extrabold ">Similar Movies:</Text>
            </View>
            <HorizontalFlatList
              data={recommendations}
              level2Text={false}
              level3Text={true}
              level4Text={false}
              navigationDestination={pushLocation}
              origin={origin}
              dataType={"movie"}
              series_id={null}
              movie_id={movie_id}
            />
          </>
        ) : null}
        {recentMovie.length > 0 ? (
          <>
            <View
              style={{
                padding: 16,
                //backgroundColor: "rgba(255, 255, 255, 0.5)", // Set the desired background color with opacity
              }}
              className="backdrop-blur-3xl"
            >
              <Text className="text-2xl font-extrabold ">Recently viewed:</Text>
            </View>

            <FlatList
              className="mb-4 bg-teal-500"
              data={recentMovie}
              initialNumToRender={5}
              maxToRenderPerBatch={7}
              updateCellsBatchingPeriod={1000}
              horizontal // Set the horizontal prop to true
              showsHorizontalScrollIndicator={false} // Optional: hide the horizontal scroll indicator
              keyExtractor={(item) => {
                return item.movieId.toString();
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="items-center py-3  mx-1 border-2 border-violet-800 rounded-lg w-[180]"
                  onPress={() => {
                    // console.log(
                    //   "navigationDestination:",
                    //   navigationDestination,
                    //   "origin:",
                    //   origin,
                    //   "person_id: ",
                    //   dataType.includes("person") ? item.id : null,
                    //   "header: ",
                    //   header
                    // );

                    navigation2.push(pushLocation, {
                      header: item.name,

                      origin: origin,

                      movie_id: item.movieId,
                    });
                  }}
                >
                  {item.posterImageUrl ? (
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w185/${item.posterImageUrl}`,
                      }}
                      className="w-5/6 h-60"
                    />
                  ) : !human ? (
                    <Image
                      source={require("./assets/blank.png")}
                      className="w-5/6 h-60"
                    />
                  ) : (
                    <Image
                      source={require("./assets/blank_avatar.jpg")}
                      className="w-5/6 h-60"
                    />
                  )}

                  <Text className="text-base font-bold text-center text-blue-800">
                    {item.name}
                  </Text>

                  <View className="flex flex-row items-center justify-evenly">
                    {item.releaseDate ? (
                      <Text className="w-1/3 text-sm font-medium text-violet-800">
                        {item.releaseDate.split("-")[0]}
                      </Text>
                    ) : null}
                    <Badge
                      value={item.popularity}
                      status={
                        item.popularity > 8
                          ? "success"
                          : item.popularity > 4
                          ? "warning"
                          : "error"
                      }
                      badgeStyle={{ height: 22 }}
                      textStyle={{
                        fontSize: 15,
                        fontWeight: "bold",
                        color: "black",
                      }}
                      className="w-1/3"
                    />
                  </View>
                </TouchableOpacity>
              )}
            />
          </>
        ) : null}
      </ScrollView>
    </>
  );
};

export default MovieDetail;
