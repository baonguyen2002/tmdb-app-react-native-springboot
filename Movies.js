import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Button,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { Context } from "./Context";
import Loading from "./Loading";
import { Badge } from "@rneui/themed";
import MovieDetail from "./MovieDetail";
import { AntDesign } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import GridView from "./GridView";
import ForyouMovieStack from "./ForYouMovie";
import { apiBaseUrl } from "./API";
import { fetchGenreScore } from "./Database";
const Stack = createStackNavigator();

function MovieStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "#5b21b6",
        },
        headerTintColor: "#14b8a6",
      }}
    >
      <Stack.Screen
        name="Movies"
        component={Movies}
        options={{ headerTitle: "Popular Movies" }}
      />
      <Stack.Screen
        name="MainMovieDetail"
        component={MovieDetail}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const Movies = () => {
  const [currentPage, setcurrentPage] = useState("1");
  const navigation = useNavigation();
  const [moviePage, setMoviePage] = useState(1);
  const [movieResult, setMovieResult] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [maxPage, setMaxPage] = useState(0);
  const [genreScore, setGenreScore] = useState([]);
  const GetMovies = () => {
    axios
      .get(`${apiBaseUrl}/popular/${moviePage}`)
      //.get(`http://localhost:8080/popular/${moviePage}`)
      .then((response) => {
        //console.log(response);
        setMovieResult(response.data.results);
        setcurrentPage(moviePage.toString());
        if (response.data.total_pages > 10) {
          setMaxPage(10);
        } else {
          setMaxPage(response.data.total_pages);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const fetchGenreScoreFromDatabase = async () => {
    try {
      const ListFromDB = await fetchGenreScore();

      setGenreScore(ListFromDB);
      console.log("fetched genreScore: ", ListFromDB);
    } catch (error) {
      console.log("Error fetching genreScore list:", error);
    }
  };
  const { suggestedMovieList, setSuggestedMovieList } = useContext(Context);
  useFocusEffect(
    useCallback(() => {
      if (suggestedMovieList) {
        setSuggestedMovieList(null);
      }
      return () => {};
    }, [])
  );
  // useFocusEffect(
  //   useCallback(() => {
  //     //fetchGenreScoreFromDatabase();
  //   }, [])
  // );
  useEffect(() => {
    GetMovies();
  }, [moviePage]);

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
    } else if (parseInt(currentPage) === moviePage) {
      Alert.alert("Notice", "You are at this page number");
      return;
    } else {
      setMoviePage(parseInt(currentPage));
      setIsLoading(true);
    }
  };

  const GoNext = () => {
    setMoviePage((prev) => prev + 1);
    setIsLoading(true);
  };

  const GoBack = () => {
    setMoviePage((prev) => prev - 1);
    setIsLoading(true);
  };
  return isLoading ? (
    <Loading />
  ) : (
    <>
      <GridView
        data={movieResult}
        dataType={"movie"}
        navigationDestination={"MainMovieDetail"}
        origin={"moviemain"}
      />

      <View className="flex flex-row items-center justify-between px-4 py-2 bg-teal-500">
        {moviePage === 1 ? (
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

          <TouchableOpacity
            className="items-center justify-center w-10 rounded-md h-9 bg-violet-800"
            onPress={() => GoToPage()}
          >
            <Text className="font-extrabold text-center text-teal-500">Go</Text>
          </TouchableOpacity>
        </View>
        {moviePage === maxPage ? (
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

export default MovieStack;

// screenOptions={{
//   // headerShown: false,
//   // tabBarActiveTintColor: '#000',
//   // tabBarInactiveTintColor: '#fff',
//   // tabBarShowLabel: true,
//   tabBarStyle: {
//     // backgroundColor: '#327B5B',
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     elevation: 0,
//     // flex: 1,
//     height: 50,
//   },
// }}

//tabBarActiveTintColor: iconColorActive, // Change this to your desired active text color
//tabBarInactiveTintColor: iconColorActiveInactive, // Change this to your desired inactive text color
//tabBarActiveBackgroundColor: backgroundBottomNavColorActive,
//tabBarInactiveBackgroundColor: backgroundBottomNavColorInActive,
//headerShown: false,
//tabBarLabelStyle: { fontSize: fontSize },
