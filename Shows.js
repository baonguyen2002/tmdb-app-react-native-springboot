import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import GridView from "./GridView";
import ShowDetails from "./ShowDetails";
import Loading from "./Loading";
import axios from "axios";
import ForYouTvStack from "./ForYouTv";
const Stack = createStackNavigator();

function ShowsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#5b21b6" },
        headerTintColor: "#14b8a6",
      }}
    >
      <Stack.Screen
        name="ForYouMovie"
        component={ForYouTvStack}
        options={{ headerShown: false }}
        initialParams={{ type: "tv" }}
      />
      <Stack.Screen
        name="Shows"
        component={Shows}
        options={{ headerTitle: "Popular Shows" }}
      />
      <Stack.Screen
        name="MainShowDetail"
        component={ShowDetails}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const Shows = () => {
  const [showPage, setShowPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);
  //const { showPage, setShowPage } = useContext(Context);
  const [isLoading, setIsLoading] = useState(true);
  const [showResult, setShowResult] = useState([]);
  const [currentPage, setcurrentPage] = useState("1");
  const getShowList = () => {
    axios
      .get(
        `https://api.themoviedb.org/3/tv/popular?api_key=841da308423b4b64ea4d57d052583683&page=${showPage}`
      )
      .then((res) => {
        //console.log(res.data.results)
        setShowResult(res.data.results);
        setcurrentPage(showPage.toString());
        if (res.data.total_pages > 500) {
          setMaxPage(500);
        } else {
          setMaxPage(res.data.total_pages);
        }

        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getShowList();
  }, [showPage]);
  function detectSpecialCharacters(str) {
    const regex = /[.,+\-\s]/g; // Regular expression to match commas, dots, plus signs, minus signs, and whitespace
    return regex.test(str);
  }
  const GoToPage = () => {
    if (detectSpecialCharacters(currentPage) || parseInt(currentPage) < 1) {
      Alert.alert("Invalid", "Invalid page number");
      return;
    } else if (parseInt(currentPage) > maxPage) {
      Alert.alert("Invalid", `Page number too high (<${maxPage})`);
      return;
    } else if (parseInt(currentPage) === showPage) {
      Alert.alert("Notice", "You are at this page number");
      return;
    } else {
      setShowPage(parseInt(currentPage));
      setIsLoading(true);
    }
  };

  const GoNext = () => {
    setShowPage((prev) => prev + 1);
    setIsLoading(true);
  };

  const GoBack = () => {
    setShowPage((prev) => prev - 1);
    setIsLoading(true);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <>
      {/* <FlatList
        columnWrapperStyle={{
          justifyContent: "space-evenly",
        }}
        numColumns={2}
        data={showResult}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("MainShowDetail", {
                id: item.id,
                header: item.name,
                origin: "tvmain",
              });
            }}
            className="w-[49%] bg-neutral-300 mb-0.5 rounded-2xl items-center p-2"
          >
            {item.poster_path ? (
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w300/${item.poster_path}`,
                }}
                className="static top-0 w-full border-2 rounded-lg h-60 flex-2"
              />
            ) : (
              <Image
                source={require("./assets/blank.png")}
                className="static top-0 w-full border-2 rounded-lg h-60 flex-2"
              />
            )}

            <Text className="text-base font-semibold text-center">
              {item.name}
            </Text>
            <View className="flex flex-row items-center w-full justify-evenly">
              <Text className="font-medium">
                First aired: {item.first_air_date.split("-")[0]}
              </Text>
              <Badge
                value={item.vote_average}
                status="primary"
                badgeStyle={{
                  height: 22,
                }}
                textStyle={{
                  fontSize: 14,
                  fontWeight: "bold",
                  color: "white",
                }}
              />
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      /> */}
      <GridView
        data={showResult}
        dataType={"tv"}
        navigationDestination={"MainShowDetail"}
        origin={"tvmain"}
      />
      <View className="flex flex-row items-center justify-between px-4 py-2 bg-teal-500">
        {showPage === 1 ? (
          <View></View>
        ) : (
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
            color="#6b21a8"
            accessibilityLabel="Go to specified page"
          /> */}
          <TouchableOpacity
            className="items-center justify-center w-10 rounded-md h-9 bg-violet-800"
            onPress={() => GoToPage()}
          >
            <Text className="font-extrabold text-center text-teal-500">Go</Text>
          </TouchableOpacity>
        </View>
        {showPage === maxPage ? (
          <View></View>
        ) : (
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
  );
};

export default ShowsStack;
