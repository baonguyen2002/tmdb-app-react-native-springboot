import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Button,
} from "react-native";
import { Badge } from "@rneui/themed";
import axios from "axios";
import Loading from "./Loading";
import { useNavigation } from "@react-navigation/native";
const ForYouTvSeeMore = ({ route }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setcurrentPage] = useState("1");
  const [page, setPage] = useState(1);
  function detectSpecialCharacters(str) {
    const regex = /[.,+\-\s]/g; // Regular expression to match commas, dots, plus signs, minus signs, and whitespace
    return regex.test(str);
  }
  const navigation = useNavigation();
  const [results, setResults] = useState([]);
  const GoToPage = () => {
    if (detectSpecialCharacters(currentPage) || parseInt(currentPage) < 1) {
      Alert.alert("Invalid", "Invalid page number");
      return;
    } else if (parseInt(currentPage) > maxPage) {
      Alert.alert("Invalid", `Page number too high (<${maxPage})`);
      return;
    } else if (parseInt(currentPage) === page) {
      Alert.alert("Notice", "You are at this page number");
      return;
    } else {
      setPage(parseInt(currentPage));
    }
  };
  const [maxPage, setMaxPage] = useState(0);
  const GoNext = () => {
    setPage((prev) => prev + 1);
  };

  const GoBack = () => {
    setPage((prev) => prev - 1);
  };
  const { list, type, isVietnamese, orJoinType, actorId, isActor } =
    route.params;
  const fetchTvBasedOnActor = () => {
    axios
      .get(
        `https://api.themoviedb.org/3/person/${actorId}/tv_credits?api_key=841da308423b4b64ea4d57d052583683`
      )
      .then((res) => {
        setResults(res.data.cast);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const fetchTvBasedOnGenre = () => {
    const joinText = orJoinType ? list.join("|") : list.join(",");
    const language = isVietnamese ? "vi" : "en";
    axios
      .get(
        `https://api.themoviedb.org/3/discover/tv?api_key=841da308423b4b64ea4d57d052583683&include_adult=false&include_video=false&with_genres=${joinText}&with_original_language=${language}&page=${page}`
      )
      .then((res) => {
        setResults(res.data.results);
        setcurrentPage(page.toString());
        setMaxPage(res.data.total_pages);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    if (type === "genre") {
      setIsLoading(true);
      fetchTvBasedOnGenre();
    } else {
      setIsLoading(true);
      fetchTvBasedOnActor();
    }
  }, [page]);
  return isLoading ? (
    <Loading />
  ) : type === "genre" ? (
    <>
      <FlatList
        style={{ backgroundColor: "#14b8a6" }}
        data={results}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-evenly",
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("MainShowDetail", {
                series_id: item.id,
                header: isVietnamese ? item.original_name : item.name,
                origin: "tvmain",
              });
            }}
            className="w-[48%] bg-teal-500 mb-0.5 rounded-2xl items-center p-2 border-2 border-violet-800"
          >
            {item.poster_path ? (
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w185/${item.poster_path}`,
                }}
                className="w-full border-2 rounded-lg h-60 flex-2"
              />
            ) : (
              <Image
                source={require("./assets/blank.png")}
                className="w-full border-2 rounded-lg h-60 flex-2"
              />
            )}

            <Text className="text-base font-semibold text-center text-[#0d253f]">
              {isVietnamese ? item.original_name : item.name}
            </Text>
            <View className="flex flex-row items-center w-full justify-evenly">
              {item.first_air_date ? (
                <Text className="font-medium text-violet-800">
                  Year: {item.first_air_date.split("-")[0]}
                </Text>
              ) : null}
              {item.vote_average ? (
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
              ) : null}
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
      <View className="flex flex-row items-center justify-between px-4 py-2 bg-teal-500">
        {page === 1 ? (
          <View></View>
        ) : (
          // <Button
          //   onPress={() => GoBack()}
          //   title="<<"
          //   color="#841584"
          //   accessibilityLabel="Go back previous page"
          // />
          <TouchableOpacity
            className="items-center justify-center w-12 rounded-md h-9 bg-violet-800"
            onPress={() => GoBack()}
          >
            <Text className="font-extrabold text-center text-teal-500">
              {"<<"}
            </Text>
          </TouchableOpacity>
        )}
        <View className="flex flex-row items-center justify-between">
          <Text className="font-semibold text-blue-900">Page: </Text>
          <TextInput
            keyboardType="numeric"
            onChangeText={setcurrentPage}
            value={currentPage}
            className="w-12 font-semibold text-center text-blue-900"
          />
          {/* <Button
            onPress={() => GoToPage()}
            title="Go"
            color="#841584"
            accessibilityLabel="Go to specified page"
          /> */}
          <TouchableOpacity
            className="items-center justify-center w-10 rounded-md h-9 bg-violet-800"
            onPress={() => GoToPage()}
          >
            <Text className="font-extrabold text-center text-teal-500">Go</Text>
          </TouchableOpacity>
        </View>
        {page === maxPage ? (
          <View></View>
        ) : (
          // <Button
          //   onPress={() => GoNext()}
          //   title=">>"
          //   color="#841584"
          //   accessibilityLabel="Go to next page"
          // />
          <TouchableOpacity
            className="items-center justify-center w-12 rounded-md h-9 bg-violet-800"
            onPress={() => GoNext()}
          >
            <Text className="font-extrabold text-center text-teal-500">
              {">>"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  ) : (
    <>
      <FlatList
        style={{ backgroundColor: "#14b8a6" }}
        data={results}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-evenly",
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("MainShowDetail", {
                series_id: item.id,
                header: isVietnamese ? item.original_name : item.name,
                origin: "tvmain",
              });
            }}
            className="w-[48%] bg-teal-500 mb-0.5 rounded-2xl items-center p-2 border-2 border-violet-800"
          >
            {item.poster_path ? (
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w185/${item.poster_path}`,
                }}
                className="w-full border-2 rounded-lg h-60 flex-2"
              />
            ) : (
              <Image
                source={require("./assets/blank.png")}
                className="w-full border-2 rounded-lg h-60 flex-2"
              />
            )}

            <Text className="text-base font-semibold text-center text-[#0d253f]">
              {isVietnamese ? item.original_name : item.name}
            </Text>
            <View className="flex flex-row items-center w-full justify-evenly">
              {item.first_air_date ? (
                <Text className="font-medium text-violet-800">
                  Year: {item.first_air_date.split("-")[0]}
                </Text>
              ) : null}
              {item.vote_average ? (
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
              ) : null}
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
      {/* <View className="flex flex-row items-center justify-between px-4 py-2">
    {page === 1 ? (
      <View></View>
    ) : (
      <Button
        onPress={() => GoBack()}
        title="<<"
        color="#841584"
        accessibilityLabel="Go back previous page"
      />
    )}
    <View className="flex flex-row items-center justify-between">
      <Text>Page: </Text>
      <TextInput
        keyboardType="numeric"
        onChangeText={setcurrentPage}
        value={currentPage}
        className="w-12 text-center"
      />
      <Button
        onPress={() => GoToPage()}
        title="Go"
        color="#841584"
        accessibilityLabel="Go to specified page"
      />
    </View>
    {page === maxPage ? (
      <View></View>
    ) : (
      <Button
        onPress={() => GoNext()}
        title=">>"
        color="#841584"
        accessibilityLabel="Go to next page"
      />
    )}
  </View> */}
    </>
  );
};

export default ForYouTvSeeMore;
