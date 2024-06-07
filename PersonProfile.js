// App.js
import React, { useEffect, useState, useContext } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import PersonImageList from "./PersonImageList";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import OtherCreditsTabs from "./OtherCredits";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { insertActor, deleteActor, fetchActor } from "./Database";
import { Context } from "./Context";
const Stack = createStackNavigator();

const PersonProfileStack = ({ route }) => {
  const { person_id, origin, header } = route.params;

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: "#14b8a6",
        headerStyle: { backgroundColor: "#5b21b6" },
      }}
    >
      <Stack.Screen
        name="PersonProfile"
        component={PersonProfile}
        initialParams={{ person_id: person_id, origin: origin }}
        options={{ headerTitle: header }}
      />
      <Stack.Screen
        name="PersonImageList"
        component={PersonImageList}
        initialParams={{ person_id: person_id }}
        options={{ headerTitle: "More Images" }}
      />
      <Stack.Screen
        name="OtherMovieCredits"
        component={OtherCreditsTabs}
        options={{ headerTitle: "Other Movies" }}
      />
      <Stack.Screen
        name="OtherShowsCredits"
        component={OtherCreditsTabs}
        options={{ headerTitle: "Other Shows" }}
      />
    </Stack.Navigator>
  );
};
const PersonProfile = ({ route }) => {
  const { setFavActorList } = useContext(Context);
  const [isFavorited, setIsFavorited] = useState(false);
  const [personDetail, setPersonDetail] = useState("");
  const { person_id, origin } = route.params;
  const [showFullText, setShowFullText] = useState(false);
  const [localFavActorList, setLocalFavActorList] = useState([]);
  const toggleReadMore = () => {
    setShowFullText(!showFullText);
  };
  const navigation = useNavigation();
  const fetchActorsFromDatabase = async () => {
    try {
      const actorsListFromDB = await fetchActor();
      setFavActorList(actorsListFromDB);
      setLocalFavActorList(actorsListFromDB);
      setIsFavorited(
        actorsListFromDB.some((item) => item.actorId === person_id)
      );
      console.log("fetched actor: ", actorsListFromDB);
    } catch (error) {
      console.log("Error fetching actors list:", error);
    }
  };
  const truncatedText = (text) => {
    return text.slice(0, 200);
  };
  const displayText = (text) => {
    return showFullText ? text : truncatedText(text);
  };
  const handleHeartPress = (actorId, profile_path, actorName) => {
    if (localFavActorList.some((item) => item.actorId === actorId)) {
      const handleDeleteActor = async () => {
        try {
          await deleteActor(actorId);
          fetchActorsFromDatabase(); // Fetch updated notes after deleting a note
        } catch (error) {
          console.error("Error deleting actor genre", error);
        }
      };
      handleDeleteActor();
    } else {
      const handleAddActor = async () => {
        try {
          await insertActor(actorId, profile_path, actorName);
          fetchActorsFromDatabase(); // Fetch updated notes after deleting a note
        } catch (error) {
          console.error("Error adding actor", error);
        }
      };
      handleAddActor();
    }
  };
  useEffect(() => {
    console.log("Person origin: ", origin);
    fetchPersonDetail();
    fetchActorsFromDatabase();
  }, []);
  const fetchPersonDetail = () => {
    axios
      .get(
        `https://api.themoviedb.org/3/person/${person_id}?api_key=841da308423b4b64ea4d57d052583683`
      )
      .then((response) => {
        setPersonDetail(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <ScrollView className="px-4 bg-teal-500">
      {personDetail.profile_path ? (
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/original/${personDetail.profile_path}`,
          }}
          className="self-center w-full h-[455] rounded-lg mt-4"
        />
      ) : (
        <Image
          source={require("./assets/blank_avatar.jpg")}
          className="self-center w-full h-[455] rounded-lg mt-4"
        />
      )}
      <View className="p-3 bg-blue-100 border-2 rounded-md border-violet-800">
        {personDetail.name ? (
          <Text className="mt-4 text-3xl font-bold text-center">
            {personDetail.name}
          </Text>
        ) : null}
        <TouchableOpacity
          className="items-center w-full text-center"
          onPress={() => {
            handleHeartPress(
              personDetail.id,
              personDetail.profile_path ? personDetail.profile_path : null,
              personDetail.name
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
        {personDetail.birthday ? (
          <Text className="text-base italic text-sky-600">
            <Text className="text-lg font-semibold text-black">Born: </Text>
            {personDetail.birthday}
          </Text>
        ) : null}
        {personDetail.deathday ? (
          <Text className="text-base italic text-sky-600">
            <Text className="text-lg font-semibold text-black">Died: </Text>
            {personDetail.deathday}
          </Text>
        ) : null}
        {personDetail.place_of_birth ? (
          <Text className="text-base italic text-sky-600">
            <Text className="text-lg font-semibold text-black">
              Place of birth:{" "}
            </Text>
            {personDetail.place_of_birth}
          </Text>
        ) : null}
        {personDetail.gender ? (
          <Text className="text-base italic text-sky-600">
            <Text className="text-lg font-semibold text-black">Gender: </Text>
            {personDetail.gender === 1
              ? "Female"
              : personDetail.gender === 2
              ? "Male"
              : "Non-binary"}
          </Text>
        ) : null}
        {personDetail.biography ? (
          <>
            <Text className="text-lg font-semibold">Biography:</Text>
            <Text className="text-base">
              {displayText(personDetail.biography)}
            </Text>
            {personDetail.biography.length > 200 && (
              <TouchableOpacity
                onPress={() => {
                  toggleReadMore();
                }}
                className="self-center w-24 border-2 border-teal-500 rounded-xl"
              >
                <Text className="text-center">
                  {showFullText ? "Show Less" : "Show More"}
                </Text>
              </TouchableOpacity>
            )}
          </>
        ) : null}
        {personDetail.popularity ? (
          <Text className="text-base italic text-sky-600">
            <Text className="text-lg font-semibold text-black">
              Popularity:{" "}
            </Text>
            {personDetail.popularity}
          </Text>
        ) : null}
        {personDetail.also_known_as && personDetail.also_known_as.length > 0 ? (
          <>
            <Text className="text-lg font-semibold">Also known as: </Text>
            {personDetail.also_known_as.map((item) => (
              <View key={item} style={{ width: "100%", paddingHorizontal: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: "300" }}>{item}</Text>
              </View>
            ))}
          </>
        ) : null}
      </View>

      <View
        style={{
          padding: 16,
          //backgroundColor: "rgba(255, 255, 255, 0.5)", // Set the desired background color with opacity
        }}
        className="backdrop-blur-3xl"
      >
        <Text className="text-2xl font-extrabold ">See more:</Text>
      </View>
      <View className="flex flex-row items-center mb-3 justify-evenly">
        <TouchableOpacity
          className="w-[33%] h-14  bg-violet-800 justify-center items-center rounded-md"
          onPress={() => {
            navigation.navigate("PersonImageList");
          }}
        >
          <Text className="font-extrabold text-center text-teal-500">
            More Images
          </Text>
        </TouchableOpacity>
        {/* {origin.includes("search") ? (
          <>
            <TouchableOpacity
              className="w-[30%] h-24 border-2 border-orange-600"
              onPress={() => {
                navigation.navigate("OtherMovieCredits", {
                  id: id,
                  origin: "moviesearch",
                  type: "movies",
                });
              }}
            >
              <Text>Other Movies</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-[30%] h-24 border-2 border-orange-600"
              onPress={() => {
                navigation.navigate("OtherShowsCredits", {
                  id: id,
                  origin: "tvsearch",
                  type: "tv",
                });
              }}
            >
              <Text>Other Shows</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {origin.includes("movie") ? (
              <TouchableOpacity
                className="w-[30%] h-24 border-2 border-orange-600"
                onPress={() => {
                  navigation.navigate("OtherMovieCredits", {
                    id: id,
                    origin: origin,
                    type: "movies",
                  });
                }}
              >
                <Text>Other Movies</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="w-[30%] h-24 border-2 border-orange-600"
                onPress={() => {
                  navigation.navigate("OtherShowsCredits", {
                    id: id,
                    origin: origin,
                    type: "tv",
                  });
                }}
              >
                <Text>Other Shows</Text>
              </TouchableOpacity>
            )}
          </>
        )} */}

        {origin === "tvmain" ? null : (
          <TouchableOpacity
            className="w-[33%] h-14  bg-violet-800 justify-center items-center rounded-md"
            onPress={() => {
              navigation.navigate("OtherMovieCredits", {
                id: person_id,
                origin: origin.includes("search")
                  ? "moviesearch"
                  : origin.includes("my")
                  ? "moviemy"
                  : origin.includes("discover")
                  ? "moviediscover"
                  : origin,
                type: "movies",
              });
            }}
          >
            <Text className="font-extrabold text-center text-teal-500">
              Other Movies
            </Text>
          </TouchableOpacity>
        )}
        {origin === "moviemain" ? null : (
          <TouchableOpacity
            className="w-[33%] h-14  bg-violet-800 justify-center items-center rounded-md"
            onPress={() => {
              navigation.navigate("OtherShowsCredits", {
                id: person_id,
                origin: origin.includes("search")
                  ? "tvsearch"
                  : origin.includes("my")
                  ? "tvmy"
                  : origin.includes("discover")
                  ? "tvdiscover"
                  : origin,
                type: "tv",
              });
            }}
          >
            <Text className="font-extrabold text-center text-teal-500">
              Other Shows
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default PersonProfileStack;
