import React, { useCallback, useEffect, useState, useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import MovieDetail from "./MovieDetail";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { Context } from "./Context";
import { Badge } from "@rneui/themed";
import { apiBaseUrl } from "./API";
import { FlatList } from "react-native-gesture-handler";
import Loading from "./Loading";
import { insertRecentMovie } from "./Database";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const Stack = createStackNavigator();

function SuggestionsStack() {
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
        name="Suggestions"
        component={Suggestions}
        options={{ headerTitle: "Suggestions" }}
      />
      <Stack.Screen
        name="SuggestionsMovieDetail"
        component={MovieDetail}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const Suggestions = () => {
  const { suggestedMovieList, setSuggestedMovieList, username } =
    useContext(Context);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [genreList, setGenreList] = useState([]);
  // const [genreUsedForSearching, setGenreUsedForSearching] = useState([]);
  // const [isAllTwos, setIsAllTwos] = useState(true);
  // const [isGenreListSorted, setIsGenreListSorted] = useState(false);
  // const [isGenreScoreFetched, setIsGenreScoreFetched] = useState(false);
  const [movieList, setMovieList] = useState([]);
  useEffect(() => {
    if (isFocused && !suggestedMovieList) {
      getGenres();
      //getMovies();
    }
    if (!isFocused && !suggestedMovieList) {
      setGenreList([]);
      // setIsGenreScoreFetched(false);
      // setIsAllTwos(true);
      // setIsGenreListSorted(false);
    }
  }, [isFocused]);
  useEffect(() => {
    if (genreList.length > 0) {
      getMovies();
    }
  }, [genreList]);
  // useFocusEffect(
  //   useCallback(() => {
  //     if (true) {
  //       getMovies();
  //     }
  //     return () => {
  //       setGenreScoreList([]);
  //       setIsGenreScoreFetched(false);
  //       setIsAllTwos(true);
  //       setIsGenreListSorted(false);
  //     };
  //   }, [])
  // );

  // const fetchGenreScoreFromDB = async () => {
  //   try {
  //     const list = await fetchGenreScore();
  //     return list;
  //   } catch (error) {
  //     console.error("Error fetching genre score for suggestion: " + error);
  //   }
  // };

  // const checkIfAllTwosFromDB = async () => {
  //   try {
  //     const isTwos = await checkIfAllTwos();
  //     return isTwos;
  //   } catch (error) {
  //     console.error("Error checking zeroes: " + error);
  //   }
  // };
  // const sortGenreList = (list) => {
  //   let sortedGenres = list.sort((a, b) => b.score - a.score);
  //   return sortedGenres;
  // };
  // const getGenresForSearching = (arr, zeroCondition) => {
  //   //console.log("trigger3");c
  //   if (zeroCondition === true) {
  //     console.log("whoops");
  //     return;
  //   }
  //   if (zeroCondition === false) {
  //     //console.log("ye");
  //     const b = arr.filter((genre) => genre.score < 2);
  //     //console.log("b length:", b.length);
  //     if (b.length == 19) {
  //       console.log("y2");
  //       const c = randomizeList(arr);
  //       //console.log(c);
  //       const d = c.splice(0, 3);
  //       //setGenreUsedForSearching(d);
  //       console.log("genres used for search:", d);
  //       return d;
  //     } else {
  //       let listWillUse = [];
  //       let listToSplice = arr.slice();
  //       for (let i = 0; i < 3; i++) {
  //         if (arr[i].score != 2) {
  //           //console.log(genreScoreList[i]);
  //           //console.log("list before:", listToSplice);
  //           listWillUse.push(arr[i]);
  //           listToSplice.splice(0, 1);
  //           //console.log("list left:", listToSplice);
  //         } else if (arr[i].score === 2) {
  //           //console.log("y3");
  //           listToSplice = randomizeList(listToSplice);
  //           const c = listToSplice.splice(0, 1);
  //           listWillUse.push(c[0]);
  //           //console.log("listWillUse:", listWillUse);
  //         }
  //       }
  //       //setGenreUsedForSearching(listWillUse);
  //       console.log("genres used for search:", listWillUse);
  //       return listWillUse;
  //     }
  //   }
  // };
  // const randomizeList = (list) => {
  //   for (let i = list.length - 1; i > 0; i--) {
  //     let j = Math.floor(Math.random() * (i + 1));
  //     let k = list[i];
  //     list[i] = list[j];
  //     list[j] = k;
  //   }
  //   return list;
  // };
  const getGenres = () => {
    axios
      .get(`${apiBaseUrl}/user/${username}/top-genres`)
      .then((response) => {
        console.log(response.data);
        setGenreList(response.data);
      })
      .catch((error) => {
        console.error("Error getting genres:", error);
      });
  };
  const getMovies = () => {
    axios
      .get(`${apiBaseUrl}/movie/search-by-genre?genreIds=${genreList}`)
      .then((res) => {
        //console.log(res.data);
        setMovieList(res.data);
        setSuggestedMovieList(res.data);
        //setIsAllZeroes(false);
        //console.log("geting Movies now");
      })
      .catch((err) => {
        console.error("Error getting suggested movie:", err);
      });
  };

  const handleInsertRecentMovie = async (
    movieId,
    posterImageUrl,
    name,
    date,
    popularity
  ) => {
    try {
      await insertRecentMovie(movieId, posterImageUrl, name, date, popularity);
      //fetchFavMovieFromDatabase(); // Fetch updated after deleting
    } catch (error) {
      //console.error("Error inserting recent movie", error);
    }
  };
  return (
    <View className="w-full h-full bg-teal-500">
      {genreList.length === 0 ? (
        <View className="flex items-center justify-center w-full h-full bg-teal-500">
          <Text className="px-4 text-2xl font-extrabold text-center text-blue-800">
            Mark movies as Favorite, or rate movies to see your personalized
            recommendations!
          </Text>
        </View>
      ) : movieList && movieList.length > 0 ? (
        <FlatList
          className="bg-teal-500"
          columnWrapperStyle={{
            justifyContent: "space-evenly",
          }}
          ListHeaderComponent={
            <Text className="text-2xl font-extrabold ">You might like:</Text>
          }
          data={movieList}
          numColumns={2}
          // maxToRenderPerBatch={6}
          // initialNumToRender={4}
          updateCellsBatchingPeriod={2000}
          keyExtractor={(item) => {
            return item.tmdbId.toString();
          }}
          renderItem={({ item }) => (
            <>
              <TouchableOpacity
                className="w-[48%] bg-teal-500 mb-0.5 rounded-2xl items-center p-2 border-2 border-violet-800"
                //className="items-center py-3  mx-1 border-2 border-violet-800 rounded-lg w-[180]"
                onPress={async () => {
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
                  await handleInsertRecentMovie(
                    item.tmdbId,
                    item.poster_path,
                    item.title,
                    item.release_date,
                    item.vote_average
                  );
                  navigation.push("SuggestionsMovieDetail", {
                    header: item.title,
                    origin: "moviesuggestions",
                    movie_id: item.tmdbId,
                  });
                }}
              >
                {item.poster_path ? (
                  <Image
                    source={{
                      uri: `https://image.tmdb.org/t/p/w185/${item.poster_path}`,
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
                  {item.title}
                </Text>

                <View className="flex flex-row items-center justify-evenly">
                  {item.release_date ? (
                    <Text className="w-1/3 text-sm font-medium text-violet-800">
                      {item.release_date.split("-")[0]}
                    </Text>
                  ) : null}
                  <Badge
                    value={item.vote_average}
                    status={
                      item.vote_average > 8
                        ? "success"
                        : item.vote_average > 4
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
            </>
          )}
        />
      ) : (
        <Loading />
      )}
    </View>

    // <View className="w-full h-full bg-teal-500">
    //   {isAllZeroes.length == 0 ? (
    //     <View className="flex items-center justify-center w-full h-full bg-teal-500">
    //       <Text className="px-4 text-2xl font-extrabold text-center text-blue-800 ">
    //         Mark movies as Favorite, or rate movies to see your personalized
    //         recommendations!
    //       </Text>
    //     </View>
    //   ) : genreUsedForSearching && genreUsedForSearching.length > 0 ? (
    //     <View
    //       style={{
    //         padding: 16,
    //         //backgroundColor: "rgba(255, 255, 255, 0.5)", // Set the desired background color with opacity
    //       }}
    //       className="backdrop-blur-3xl"
    //     >
    // <FlatList
    //   className="bg-teal-500"
    //   columnWrapperStyle={{
    //     justifyContent: "space-evenly",
    //   }}
    //   ListHeaderComponent={
    //     <Text className="text-2xl font-extrabold ">You might like:</Text>
    //   }
    //   data={movieList}
    //   numColumns={2}
    //   // maxToRenderPerBatch={6}
    //   // initialNumToRender={4}
    //   updateCellsBatchingPeriod={2000}
    //   keyExtractor={(item) => {
    //     return item.tmdbId.toString();
    //   }}
    //   renderItem={({ item }) => (
    //     <>
    //       <TouchableOpacity
    //         className="w-[48%] bg-teal-500 mb-0.5 rounded-2xl items-center p-2 border-2 border-violet-800"
    //         //className="items-center py-3  mx-1 border-2 border-violet-800 rounded-lg w-[180]"
    //         onPress={async () => {
    //           // console.log(
    //           //   "navigationDestination:",
    //           //   navigationDestination,
    //           //   "origin:",
    //           //   origin,
    //           //   "person_id: ",
    //           //   dataType.includes("person") ? item.id : null,
    //           //   "header: ",
    //           //   header
    //           // );
    //           await handleInsertRecentMovie(
    //             item.tmdbId,
    //             item.poster_path,
    //             item.title,
    //             item.release_date,
    //             item.vote_average
    //           );
    //           navigation.push("SuggestionsMovieDetail", {
    //             header: item.title,
    //             origin: "moviesuggestions",
    //             movie_id: item.tmdbId,
    //           });
    //         }}
    //       >
    //         {item.poster_path ? (
    //           <Image
    //             source={{
    //               uri: `https://image.tmdb.org/t/p/w185/${item.poster_path}`,
    //             }}
    //             className="w-5/6 h-60"
    //           />
    //         ) : !human ? (
    //           <Image
    //             source={require("./assets/blank.png")}
    //             className="w-5/6 h-60"
    //           />
    //         ) : (
    //           <Image
    //             source={require("./assets/blank_avatar.jpg")}
    //             className="w-5/6 h-60"
    //           />
    //         )}

    //         <Text className="text-base font-bold text-center text-blue-800">
    //           {item.title}
    //         </Text>

    //         <View className="flex flex-row items-center justify-evenly">
    //           {item.release_date ? (
    //             <Text className="w-1/3 text-sm font-medium text-violet-800">
    //               {item.release_date.split("-")[0]}
    //             </Text>
    //           ) : null}
    //           <Badge
    //             value={item.vote_average}
    //             status={
    //               item.vote_average > 8
    //                 ? "success"
    //                 : item.vote_average > 4
    //                 ? "warning"
    //                 : "error"
    //             }
    //             badgeStyle={{ height: 22 }}
    //             textStyle={{
    //               fontSize: 15,
    //               fontWeight: "bold",
    //               color: "black",
    //             }}
    //             className="w-1/3"
    //           />
    //         </View>
    //       </TouchableOpacity>
    //     </>
    //   )}
    // />
    //     </View>
    //   ) : (
    //     <Loading />
    //   )}
    // </View>
  );
};

export default SuggestionsStack;

// useEffect(() => {
//   if (isGenreScoreFetched) {
//     sortGenreList(genreScoreList);
//     setIsGenreListSorted(true);
//     console.log("trigger1");
//   }
// }, [isGenreScoreFetched]);
// useEffect(() => {
//   if (isGenreListSorted) {
//     console.log("trigger2");
//     getGenresForSearching(genreScoreList, isAllZeroes);
//   }
// }, [isGenreListSorted]);
// useFocusEffect(
//   useCallback(() => {
//     const fetchAndSortGenreScore = async () => {
//       await fetchGenreScoreFromDB();
//       setIsGenreScoreFetched(true);
//     };
//     fetchAndSortGenreScore();
//     //let clone = genreScoreList.slice();
//     //console.log(genreScoreList);
//     // c
//     //console.log(genreScoreList);
//   }, [])
// );

// useFocusEffect(
//   useCallback(() => {
//     fetchGenreScoreFromDB();
//   }, [])
// );
// // useEffect(() => {
// //   sortGenreList(genreScoreList);
// //   getMovies();
// // }, [genreScoreList]);
// // useEffect(() => {
// //   const sortGenreList = (list) => {
// //     // Sort the list here
// //     const sortedList = list.sort((a, b) => b.score - a.score);
// //     setGenreScoreList(sortedList);
// //     setIsGenreListSorted(true);
// //   };

// //   sortGenreList(genreScoreList);
// // }, [genreScoreList]);
// useEffect(() => {
//   console.log("isAllZeros:", isAllZeroes);
// }, [isAllZeroes]);

// useEffect(() => {
//   if (genreScoreList && genreScoreList.length > 0 && isAllZeroesChecked) {
//     const sortGenreList = (list) => {
//       // Sort the list here
//       const sortedList = list.sort((a, b) => b.score - a.score);
//       setGenreScoreList(sortedList);
//       setIsGenreListSorted(true);
//     };
//     sortGenreList(genreScoreList);
//   }
// }, [isAllZeroesChecked]);
// useEffect(() => {
//   if (isGenreListSorted && genreScoreList.length > 0) {
//     getGenresForSearching();
//   }
// }, [isGenreListSorted]);
// useEffect(() => {
//   console.log("Will use these genres:", genreUsedForSearching);
//   if (genreUsedForSearching.length > 0) {
//     getMovies();
//   }
// }, [genreUsedForSearching]);
