// Import necessary dependencies
import { useNavigation } from "@react-navigation/native";
import React, {
  Component,
  useLayoutEffect,
  useEffect,
  useState,
  useContext,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import HorizontalFlatList from "./HorizontalFlatList";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();
import Loading from "./Loading";
import RatingModal from "./RatingModal";
import { Context } from "./Context";
import MoreMovieAndShowImageList from "./MoreMovieAndShowImageList";
import VideoList from "./VideoList";
const EpisodeDetailsStack = ({ route }) => {
  const { series_id, header, origin, season_number, episode_number } =
    route.params;
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#5b21b6" },
        headerTintColor: "#14b8a6",
      }}
    >
      <Stack.Screen
        name="EpisodeDetails"
        component={EpisodeDetails}
        initialParams={{
          series_id: series_id,
          header: header,
          origin: origin,
          season_number: season_number,
          episode_number: episode_number,
        }}
      />
      <Stack.Screen
        name="MoreEpisodeImages"
        component={MoreMovieAndShowImageList}
        options={{ headerTitle: "More Images" }}
      />
      <Stack.Screen
        name="EpisodeVideoList"
        component={VideoList}
        options={{ headerTitle: "Related Videos" }}
      />
    </Stack.Navigator>
  );
};
// Create a component
const EpisodeDetails = ({ route }) => {
  const { sessionId } = useContext(Context);
  const [sliderValue, setSliderValue] = useState(5);
  const [details, setDetails] = useState([]);
  const { series_id, header, origin, season_number, episode_number } =
    route.params;
  const navigation = useNavigation();
  const [crew, setCrew] = useState([]);
  const [guest, setGuest] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRated, setIsRated] = useState(false);
  const [localRatings, setLocalRatings] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const handleStarPress = () => {
    //console.log("StarPressed");
    if (isRated === false) {
      setSliderValue(5);
    }
    setModalVisible(true);
  };
  useLayoutEffect(() => {
    navigation.setOptions({ title: header });
  }, [navigation, header]);

  const fetchDetails = () => {
    axios
      .get(
        `https://api.themoviedb.org/3/tv/${series_id}/season/${season_number}/episode/${episode_number}?api_key=841da308423b4b64ea4d57d052583683`
      )
      .then((response) => {
        //console.log(response.data);
        setDetails(response.data);
        setGuest(response.data.guest_stars);
        setCrew(response.data.crew);
        axios
          .get(
            `https://api.themoviedb.org/3/tv/${series_id}/season/${season_number}/episode/${episode_number}/account_states?api_key=841da308423b4b64ea4d57d052583683&session_id=${sessionId}`
          )
          .then((res) => {
            console.log(res.data);
            setIsRated(res.data.rated);
            setSliderValue(res.data.rated ? res.data.rated.value : 5);
          })
          .catch((error) => {
            console.error(error);
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
      "series_id:",
      series_id,
      header,
      origin,
      "season_number:",
      season_number,
      "episode_number: ",
      episode_number
    );
    fetchDetails();
  }, []);
  return isLoading ? (
    <Loading />
  ) : (
    <ScrollView className="w-full px-4 bg-teal-500">
      <RatingModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        isRated={isRated}
        sliderValue={sliderValue}
        setSliderValue={setSliderValue}
        id={series_id}
        setIsRated={setIsRated}
        type={"tv"}
        season_number={season_number}
        episode_number={episode_number}
        setLocalRatings={setLocalRatings}
      />

      {details.still_path ? (
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/original/${details.still_path}`,
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
        <Text className="mt-4 text-3xl font-bold text-center">
          {details.name}
        </Text>
        <View className="flex flex-row w-full justify-evenly">
          {/* <TouchableOpacity
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
            <Text>Add your rating</Text>
          )}
        </TouchableOpacity> */}
        </View>
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
        {details.overview ? (
          <>
            <Text className="text-lg font-semibold">Sypnosis:</Text>
            <Text className="text-base">{details.overview}</Text>
          </>
        ) : null}
        {details.vote_average ? (
          <Text className="text-base italic text-sky-600">
            <Text className="text-lg font-semibold text-black">Ratings: </Text>
            {details.vote_average}
            {details.vote_count ? (
              <>
                <Text className="text-lg font-semibold text-black"> from </Text>
                <Text>{details.vote_count} votes</Text>
              </>
            ) : null}
          </Text>
        ) : null}
        {details.air_date ? (
          <Text className="text-base italic text-sky-600">
            <Text className="text-lg font-semibold text-black">Air date: </Text>
            {details.air_date}
          </Text>
        ) : null}
        {details.runtime ? (
          <Text className="mb-2 text-base italic text-sky-600">
            <Text className="text-lg font-semibold text-black">Runtime: </Text>
            {details.runtime === 1
              ? `${details.runtime} minute`
              : `${details.runtime} minutes`}
          </Text>
        ) : null}
      </View>
      <View className="flex flex-row items-center w-full my-3 justify-evenly">
        <TouchableOpacity
          onPress={() => {
            navigation.push("MoreEpisodeImages", {
              id: series_id,
              type: "tvepisode",
              season_number: season_number,
              episode_number: episode_number,
            });
          }}
          className="h-16  w-[48%] rounded-lg bg-violet-800 justify-center items-center"
        >
          <Text className="text-lg font-bold text-teal-500">More Images</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.push("EpisodeVideoList", {
              id: series_id,
              type: "tvepisode",
              season_number: season_number,
              episode_number: episode_number,
            });
          }}
          className="h-16  w-[48%] rounded-lg bg-violet-800 justify-center items-center"
        >
          <Text className="text-lg font-bold text-teal-500">
            Related Videos
          </Text>
        </TouchableOpacity>
      </View>
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
                    person_id: item.id,
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
      {guest && guest.length > 0 ? (
        <>
          <View
            style={{
              padding: 16,
              //backgroundColor: "rgba(255, 255, 255, 0.5)", // Set the desired background color with opacity
            }}
            className="backdrop-blur-3xl"
          >
            <Text className="text-2xl font-extrabold ">Guest Stars:</Text>
          </View>
          {/* <FlatList
            className="mb-4"
            data={guest}
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
                    person_id: item.id,
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
            data={guest}
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
    </ScrollView>
  );
};

export default EpisodeDetailsStack;
