import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, Dimensions } from "react-native";
const windowWidth = Dimensions.get("window").width;
import Loading from "./Loading";
import axios from "axios";
const PersonImageList = ({ route }) => {
  const [imageList, setImageList] = useState([]);
  const { person_id } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const fetchImages = () => {
    axios
      .get(
        `https://api.themoviedb.org/3/person/${person_id}/images?api_key=841da308423b4b64ea4d57d052583683`
      )
      .then((response) => {
        //console.log(response.data.profiles);

        setImageList(response.data.profiles);
        //console.log(typeof response.data.profiles[0].aspect_ratio);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    fetchImages();
    //console.log(windowHeight, windowWidth);
  }, []);
  return isLoading ? (
    <Loading />
  ) : imageList && imageList.length > 0 ? (
    <View className="w-full h-full p-2 bg-teal-500">
      <FlatList
        numColumns={2}
        data={imageList}
        renderItem={({ item }) => (
          <View className="items-center w-1/2 px-2 py-1">
            {item.aspect_ratio >= 0.6 && item.aspect_ratio <= 0.7 ? (
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w185/${item.file_path}`,
                }}
                style={{
                  width: windowWidth / 2 - 15,
                  height: windowWidth * item.aspect_ratio,
                }}
              />
            ) : (
              <Text>N</Text>
            )}
          </View>
        )}
        keyExtractor={(item) => item.file_path}
      />
    </View>
  ) : (
    <View className="flex items-center justify-center w-full h-full bg-teal-500">
      <Text className="px-4 text-2xl font-extrabold text-center text-blue-800">
        Seems like this person has no more images...
      </Text>
    </View>
  );
};

export default PersonImageList;
