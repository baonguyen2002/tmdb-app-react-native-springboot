import React, { useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import axios from "axios";
import Slider from "@react-native-community/slider";
import { Context } from "./Context";
import { apiBaseUrl } from "./API";
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
  updateGenreScore,
  oldRating,
  //setList,
}) => {
  const { username } = useContext(Context);

  const handleDeletePress = async (id) => {
    axios
      .delete(`${apiBaseUrl}/user/${username}/rating/${id}`)
      .then(() => {
        console.log("Delete rating movie success:", id);
      })
      .catch((err) => {
        console.error("Error delete rating movie:", err);
      });
    let genreDict = {};
    for (let genreItem of genreId) {
      const genre_id = genreItem.genreId;

      if (oldRating <= 2) {
        genreDict[`${genre_id}`] = 2;
      } else if (oldRating <= 4) {
        genreDict[`${genre_id}`] = 1;
      } else if (oldRating <= 6) {
        genreDict[`${genre_id}`] = -1;
      } else if (oldRating <= 8) {
        genreDict[`${genre_id}`] = -2;
      } else if (oldRating <= 10) {
        genreDict[`${genre_id}`] = -3;
      }
    }
    //console.log(genreDict);
    updateGenreScore(genreDict, username);
    setIsRated(false);
    setModalVisible(false);
    setLocalRatings(false);
  };

  const handleOkPress = async (id, poster, name, date, sliderValue) => {
    axios
      .post(`${apiBaseUrl}/user/${username}/rating`, {
        id: id,
        name: name,
        date: date,
        poster: poster,
        score: sliderValue,
      })
      .then(() => {
        console.log("Added rating movie", id);
      })
      .catch((err) => {
        console.error("Error adding rating movie", err);
      });
    let genreDict = {};
    for (let genreItem of genreId) {
      const genre_id = genreItem.genreId;

      if (sliderValue <= 2) {
        genreDict[`${genre_id}`] = -2;
      } else if (sliderValue <= 4) {
        genreDict[`${genre_id}`] = -1;
      } else if (sliderValue <= 6) {
        genreDict[`${genre_id}`] = 1;
      } else if (sliderValue <= 8) {
        genreDict[`${genre_id}`] = 2;
      } else if (sliderValue <= 10) {
        genreDict[`${genre_id}`] = 3;
      }
    }
    //console.log(genreDict);
    updateGenreScore(genreDict, username);
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
