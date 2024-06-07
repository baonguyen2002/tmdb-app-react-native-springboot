import React, { useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import axios from "axios";
import Slider from "@react-native-community/slider";
import { Context } from "./Context";
//import { insertFlaggedMovie, fetchFlaggedMovie } from "./Database";
import {
  insertRatedMovie,
  deleteRatedMovie,
  updateRatedMovie,
} from "./Database";
const RatingModal = ({
  modalVisible,
  setModalVisible,
  isRated,
  id,
  setIsRated,
  sliderValue,
  setSliderValue,
  type,
  setLocalRatings,
  season_number,
  episode_number,
  poster,
  name,
  date,
  genreId,
  fetchScoreFromDatabase,
  updateScoreInDatabase,
  oldRating,
  //setList,
}) => {
  const { sessionId, setFlaggedMovieList } = useContext(Context);
  // const fetchFlaggedFromDatabase = async () => {
  //   try {
  //     const flaggedMovieListFromDB = await fetchFlaggedMovie();
  //     setFlaggedMovieList(flaggedMovieListFromDB);
  //     setList(flaggedMovieListFromDB);

  //     console.log("fetched movie: ", flaggedMovieListFromDB);
  //   } catch (error) {
  //     console.log("Error fetching movie list:", error);
  //   }
  // };
  const handleInsertRatedMovie = async (
    movieId,
    posterImageUrl,
    name,
    date,
    value
  ) => {
    try {
      await insertRatedMovie(movieId, posterImageUrl, name, date, value);
      //fetchFavMovieFromDatabase(); // Fetch updated after deleting
    } catch (error) {
      console.error("Error inserting rated movie", error);
    }
  };
  const handleUpdateRatedMovie = async (movieId, value) => {
    try {
      await updateRatedMovie(movieId, value);
      //fetchFavMovieFromDatabase(); // Fetch updated after deleting
    } catch (error) {
      console.error("Error updating rated movie", error);
    }
  };
  const handleDeleteRatedMovie = async (movieId) => {
    try {
      await deleteRatedMovie(movieId);
      // fetchFavMovieFromDatabase(); // Fetch updated after deleting
    } catch (error) {
      console.error("Error delete rated movie", error);
    }
  };

  const handleDeletePress = async (id) => {
    handleDeleteRatedMovie(id);
    for (let genreItem of genreId) {
      const genre_id = genreItem.genreId;
      const score = await fetchScoreFromDatabase(genre_id);

      if (oldRating <= 2) {
        await updateScoreInDatabase(genre_id, score, 2, true);
      } else if (oldRating <= 4) {
        await updateScoreInDatabase(genre_id, score, 1, true);
      } else if (oldRating <= 6) {
        await updateScoreInDatabase(genre_id, score, 1, false);
      } else if (oldRating <= 8) {
        await updateScoreInDatabase(genre_id, score, 2, false);
      } else if (oldRating <= 10) {
        await updateScoreInDatabase(genre_id, score, 3, false);
      }
    }
    setIsRated(false);
    setModalVisible(false);
    setLocalRatings(false);
  };
  // useEffect(() => {
  //   fetchFlaggedFromDatabase();
  // }, []);
  // const handleInsertMovie = async () => {
  //   try {
  //     await insertFlaggedMovie(id);
  //     fetchFlaggedFromDatabase(); // Fetch updated notes after deleting a note
  //   } catch (error) {
  //     console.error("Error inserting movie:", error);
  //   }
  // };
  const handleOkPress = async (id, poster, name, date, sliderValue) => {
    // if (isRated) {
    //   handleUpdateRatedMovie(id, sliderValue);
    //   for (let genreItem of genreId) {
    //     const genre_id = genreItem.genreId;
    //     const score = await fetchScoreFromDatabase(genre_id);
    //     if (oldRating) {
    //       if (
    //         (oldRating == 2 && sliderValue == 2.5) ||
    //         (oldRating == 4 && sliderValue == 4.5) ||
    //         (oldRating == 6 && sliderValue == 6.5) ||
    //         (oldRating == 8 && sliderValue == 8.5)
    //       ) {
    //         console.log("condition 1");
    //         await updateScoreInDatabase(genre_id, score, 1, true);
    //         setIsRated(true);
    //         setModalVisible(false);
    //         setLocalRatings(sliderValue);
    //         return;
    //       }
    //       if (
    //         (oldRating == 2.5 && sliderValue == 2) ||
    //         (oldRating == 4.5 && sliderValue == 4) ||
    //         (oldRating == 6.5 && sliderValue == 6) ||
    //         (oldRating == 8.5 && sliderValue == 8)
    //       ) {
    //         console.log("condition 2");
    //         await updateScoreInDatabase(genre_id, score, 1, false);
    //         setIsRated(true);
    //         setModalVisible(false);
    //         setLocalRatings(sliderValue);
    //         return;
    //       }
    //       let diffence = sliderValue - oldRating;
    //       await updateScoreInDatabase(
    //         genre_id,
    //         score,
    //         Math.round(Math.abs(diffence) / 2),
    //         diffence > 0
    //       );
    //     } else {
    //       if (sliderValue <= 2) {
    //         await updateScoreInDatabase(genre_id, score, 2, false);
    //       } else if (sliderValue <= 4) {
    //         await updateScoreInDatabase(genre_id, score, 1, false);
    //       } else if (sliderValue <= 6) {
    //         await updateScoreInDatabase(genre_id, score, 0, true);
    //       } else if (sliderValue <= 8) {
    //         await updateScoreInDatabase(genre_id, score, 1, true);
    //       } else if (sliderValue <= 10) {
    //         await updateScoreInDatabase(genre_id, score, 2, true);
    //       }
    //     }
    //   }
    // } else {
    handleInsertRatedMovie(id, poster, name, date, sliderValue);
    for (let genreItem of genreId) {
      const genre_id = genreItem.genreId;
      const score = await fetchScoreFromDatabase(genre_id);

      if (sliderValue <= 2) {
        await updateScoreInDatabase(genre_id, score, 2, false);
      } else if (sliderValue <= 4) {
        await updateScoreInDatabase(genre_id, score, 1, false);
      } else if (sliderValue <= 6) {
        await updateScoreInDatabase(genre_id, score, 1, true);
      } else if (sliderValue <= 8) {
        await updateScoreInDatabase(genre_id, score, 2, true);
      } else if (sliderValue <= 10) {
        await updateScoreInDatabase(genre_id, score, 3, true);
      }
    }

    setIsRated(true);
    setModalVisible(false);
    setLocalRatings(sliderValue);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        //Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      <View className="flex items-center justify-center w-full h-full ">
        <View className="w-3/4 h-40 p-4 bg-green-200 ">
          <Text className="text-2xl font-bold text-center">
            Set your rating:
          </Text>
          <Text className="text-2xl font-bold text-center">{sliderValue}</Text>
          <View className="flex flex-row items-center mb-2 justify-evenly">
            <Text className="text-base">0.5</Text>
            <View className="w-4/5">
              <Slider
                minimumValue={0.5}
                maximumValue={10}
                step={0.5}
                onValueChange={(value) => {
                  setSliderValue(value);
                }}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
                value={sliderValue ? sliderValue : 5}
              />
            </View>
            <Text className="text-base">10</Text>
          </View>

          <View className="flex flex-row w-full h-8 justify-evenly">
            {isRated ? (
              <TouchableOpacity
                disabled={!isRated}
                className="items-center justify-center w-1/4 h-full"
                style={{ backgroundColor: isRated ? "red" : "#9e9e9e" }}
                onPress={() => handleDeletePress(id)}
              >
                <Text className="text-center text-white">Delete</Text>
              </TouchableOpacity>
            ) : null}

            <View className="flex-row w-2/3 justify-evenly">
              <TouchableOpacity
                className="items-center justify-center w-2/5 h-full bg-amber-400"
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text className="text-center ">Cancel</Text>
              </TouchableOpacity>
              {isRated ? null : (
                <TouchableOpacity
                  className="items-center justify-center w-2/5 h-full bg-cyan-500 "
                  onPress={() =>
                    handleOkPress(id, poster, name, date, sliderValue)
                  }
                >
                  <Text className="text-center text-white">OK</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RatingModal;
