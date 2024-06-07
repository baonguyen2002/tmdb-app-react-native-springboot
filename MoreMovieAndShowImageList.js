import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, FlatList, Image } from "react-native";
const windowWidth = Dimensions.get("window").width;
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import axios from "axios";
const Tab = createMaterialTopTabNavigator();
import Loading from "./Loading";
const MoreMovieAndShowImageList = ({ route }) => {
  const { id, type, season_number, episode_number } = route.params;
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: true,
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
        // indicatorStyle: { backgroundColor: "blue" },
      }}
      // screenOptions={() => ({
      //   headerShown: false,
      //   tabBarLabelStyle: {
      //     textTransform: "none",
      //     fontSize: 16,
      //     fontWeight: "bold",
      //     color: "#14b8a6",
      //   },

      //   tabBarStyle: {
      //     backgroundColor: "#5b21b6",
      //   }, // Background color for the tab bar
      //   //tabStyle: { backgroundColor: "orange" },
      //   // tabBarActiveTintColor: "#14b8a6",
      //   // tabBarInactiveTintColor: "#14b8a6",
      //   tabBarIndicatorStyle: { backgroundColor: "#14b8a6" },
      //})}
    >
      <Tab.Screen
        name="Posters"
        component={ImageTab}
        initialParams={{
          id: id,
          type: type,
          imageType: "posters",
          season_number: season_number,
          episode_number: episode_number,
        }}
      />
      <Tab.Screen
        name="Backdrops"
        component={ImageTab}
        initialParams={{
          id: id,
          type: type,
          imageType: "backdrops",
          season_number: season_number,
          episode_number: episode_number,
        }}
      />
      <Tab.Screen
        name="Logos"
        component={ImageTab}
        initialParams={{
          id: id,
          type: type,
          imageType: "logos",
          season_number: season_number,
          episode_number: episode_number,
        }}
      />
      <Tab.Screen
        name="Stills"
        component={ImageTab}
        initialParams={{
          id: id,
          type: type,
          imageType: "stills",
          season_number: season_number,
          episode_number: episode_number,
        }}
      />
    </Tab.Navigator>
  );
};

const ImageTab = ({ route }) => {
  const [isLoading, setIsLoading] = useState(true);
  const imgWidth = windowWidth * 0.45;
  const imgHeight = (aspectRatio) => {
    return Math.round(imgWidth / aspectRatio);
  };
  const { id, type, imageType, season_number, episode_number } = route.params;
  const [imageList, setImageList] = useState([]);
  const setUrl = () => {
    if (typeof episode_number === "number") {
      return `https://api.themoviedb.org/3/tv/${id}/season/${season_number}/episode/${episode_number}/images?api_key=841da308423b4b64ea4d57d052583683`;
    } else {
      if (typeof season_number === "number") {
        return `https://api.themoviedb.org/3/tv/${id}/season/${season_number}/images?api_key=841da308423b4b64ea4d57d052583683`;
      } else {
        return `https://api.themoviedb.org/3/${type}/${id}/images?api_key=841da308423b4b64ea4d57d052583683`;
      }
    }
  };
  const fetchImages = () => {
    axios
      .get(setUrl())
      .then((response) => {
        //console.log(response.data);
        if (imageType === "stills") {
          setImageList(response.data.stills);
        } else if (imageType === "backdrops") {
          setImageList(response.data.backdrops);
        } else if (imageType === "logos") {
          setImageList(response.data.logos);
        } else setImageList(response.data.posters);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    //console.log(id, type, imageType, season_number, episode_number);
    fetchImages();
  }, []);
  return isLoading ? (
    <Loading />
  ) : (
    <>
      {imageList && imageList.length > 0 ? (
        imageType ? (
          <FlatList
            className="bg-teal-500"
            numColumns={2}
            data={imageList}
            renderItem={({ item }) =>
              !item.file_path.includes(".svg") ? (
                <View className="w-1/2 px-2 py-1">
                  <Image
                    source={{
                      uri: `https://image.tmdb.org/t/p/w300/${item.file_path}`,
                    }}
                    style={{
                      width: imgWidth,
                      height: imgHeight(item.aspect_ratio),
                      borderRadius: imageType === "logos" ? 0 : 7,
                    }}
                  />
                </View>
              ) : null
            }
            keyExtractor={(item) => item.file_path}
          />
        ) : null
      ) : (
        <View className="flex items-center justify-center w-full h-full bg-teal-500">
          <Text className="text-2xl font-bold text-center text-blue-800">
            {`Seems like this ${
              type.includes("season")
                ? "season"
                : type.includes("episode")
                ? "episode"
                : type.includes("movie")
                ? "movie"
                : "show"
            } has no images of this type...`}
          </Text>
        </View>
      )}
    </>
  );
};

export default MoreMovieAndShowImageList;
