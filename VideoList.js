import React, { useEffect, useLayoutEffect, useState } from "react";
import { Text, TouchableOpacity, FlatList, View, Image } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import Loading from "./Loading";
import { useNavigation } from "@react-navigation/native";

const VideoList = ({ route }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { id, type, season_number, episode_number } = route.params;
  const navigation2 = useNavigation();
  const [videos, setVideos] = useState([]);
  const [videosLoaded, setVideosLoaded] = useState(false);
  const setUrl = () => {
    if (typeof episode_number === "number") {
      return `https://api.themoviedb.org/3/tv/${id}/season/${season_number}/episode/${episode_number}/videos?api_key=841da308423b4b64ea4d57d052583683`;
    } else if (typeof season_number === "number") {
      return `https://api.themoviedb.org/3/tv/${id}/season/${season_number}/videos?api_key=841da308423b4b64ea4d57d052583683`;
    } else {
      return `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=841da308423b4b64ea4d57d052583683`;
    }
  };
  const getVideos = () => {
    axios
      .get(setUrl())
      .then((res) => {
        // console.log("videos:", res.data.results);
        setVideos(res.data.results);
        setVideosLoaded(true);
      })
      .catch((err) => {
        console.error(err);
        setVideosLoaded(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    //console.log("effect triggered");
    getVideos();
  }, [id]);

  return isLoading ? (
    <Loading />
  ) : (
    <View className="w-full h-full px-4 bg-teal-500">
      {videosLoaded && videos.length > 0 ? (
        <>
          <FlatList
            data={videos}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation2.navigate(
                      type === "movie"
                        ? "MovieVideoWebView"
                        : "ShowVideoWebView",
                      {
                        item: item,
                        header: item.name,
                      }
                    );
                  }}
                  className="p-2 my-2 rounded-2xl bg-violet-800"
                >
                  <View className="w-full h-40">
                    <Image
                      source={{
                        uri: `https://i.ytimg.com/vi/${item.key}/hqdefault.jpg`,
                      }}
                      className="w-full h-full rounded-md"
                    />
                  </View>
                  <View className="flex flex-row items-center justify-between w-full px-2 mt-2">
                    <View className="w-4/5">
                      <Text className="text-base font-semibold text-teal-500">
                        {item.name}
                      </Text>
                    </View>
                    <View className="items-center w-1/5">
                      <AntDesign name="arrowright" size={32} color="#14b8a6" />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item.id}
          />
        </>
      ) : (
        <View className="flex items-center justify-center h-full">
          <Text className="px-4 text-2xl font-extrabold text-center text-blue-800 ">
            {`Seems like this ${
              type.includes("season")
                ? "season"
                : type.includes("movie")
                ? "movie"
                : type.includes("episode")
                ? "episode"
                : "show"
            } has no related videos...`}
          </Text>
        </View>
      )}
    </View>
  );
};

export default VideoList;
