import React, { Component, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Button,
} from "react-native";
import {
  fetchMovieReview,
  insertMovieReview,
  updateMovieReview,
  deleteMovieReview,
  fetchTvReview,
  insertTvReview,
  updateTvReview,
  deleteTvReview,
} from "./Database";
import axios from "axios";
import Loading from "./Loading";
import { useFocusEffect } from "@react-navigation/native";
const Review = ({ route }) => {
  const { id, type } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [review, setreview] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [yourReview, setYourReview] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [inEdit, setInEdit] = useState(false);
  //const [showFullText, setShowFullText] = useState(false);
  const fetchYourReview = async () => {
    if (type === "movie") {
      try {
        const movieReviewFromDB = await fetchMovieReview(id);
        setYourReview(movieReviewFromDB);
        console.log("fetched movieReview: ", movieReviewFromDB);
      } catch (error) {
        console.log("Error fetching movieReview:", error);
      }
    } else {
      try {
        const tvReviewFromDB = await fetchTvReview(id);
        setYourReview(tvReviewFromDB);
        console.log("fetched tvReview: ", tvReviewFromDB);
      } catch (error) {
        console.log("Error fetching tvReview:", error);
      }
    }
  };
  const fetchReviewsFromAPI = () => {
    axios
      .get(
        `https://api.themoviedb.org/3/${type}/${id}/reviews?api_key=841da308423b4b64ea4d57d052583683&page=1`
      )
      .then((res) => {
        //console.log(res.data.results);
        setreview(res.data.results);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useFocusEffect(
    useCallback(() => {
      fetchReviewsFromAPI();
      fetchYourReview();
      if (foundReview) {
        setTextInput(foundReview.content);
      }
    }, [])
  );
  const handleDelete = () => {
    if (type === "movie") {
      const movieReviewDelete = async () => {
        try {
          await deleteMovieReview(id);
          fetchYourReview();
        } catch (error) {
          console.error("Error deleting movieReview", error);
        }
      };
      movieReviewDelete();
    } else {
      const tvReviewDelete = async () => {
        try {
          await deleteTvReview(id);
          fetchYourReview();
        } catch (error) {
          console.error("Error deleting tvReview", error);
        }
      };
      tvReviewDelete();
    }
    setTextInput("");
  };
  const handleSubmit = () => {
    if (type === "movie") {
      if (inEdit) {
        const movieReviewUpdate = async () => {
          try {
            await updateMovieReview(id, textInput);
            fetchYourReview();
          } catch (error) {
            console.error("Error updating movieReview", error);
          }
        };
        movieReviewUpdate();
      } else {
        const movieReviewAdd = async () => {
          try {
            await insertMovieReview(id, textInput);
            fetchYourReview(); // Fetch updated
          } catch (error) {
            console.error("Error adding movieReview", error);
          }
        };
        movieReviewAdd();
      }
    } else {
      if (inEdit) {
        const tvReviewUpdate = async () => {
          try {
            await updateTvReview(id, textInput);
            fetchYourReview();
          } catch (error) {
            console.error("Error updating tvReview", error);
          }
        };
        tvReviewUpdate();
      } else {
        const tvReviewAdd = async () => {
          try {
            await insertTvReview(id, textInput);
            fetchYourReview(); // Fetch updated
          } catch (error) {
            console.error("Error adding tvReview", error);
          }
        };
        tvReviewAdd();
      }
    }
  };
  const truncatedText = (text) => {
    return text.slice(0, 100);
  };
  function findReviewById(list, id) {
    if (type === "movie") {
      return list.find((obj) => obj.movieId === id);
    } else {
      return list.find((obj) => obj.tvID === id);
    }
  }
  const foundReview = findReviewById(yourReview, id);

  // const displayText = (text) => {
  //   return showFullText ? text : truncatedText(text);
  // };
  const displayText = (text, itemId) => {
    return expandedItems[itemId] ? text : truncatedText(text);
  };
  // const toggleReadMore = () => {
  //   setShowFullText(!showFullText);
  // };
  const toggleReadMore = (itemId) => {
    setExpandedItems((prevExpandedItems) => ({
      ...prevExpandedItems,
      [itemId]: !prevExpandedItems[itemId],
    }));
  };
  return (
    <FlatList
      className="bg-teal-500"
      ListHeaderComponent={
        <View className="mb-3">
          {foundReview ? (
            <View>
              <Text className="text-lg font-extrabold text-center">
                {inEdit ? "Editing:" : "Your review:"}
              </Text>
              <View className="w-[80%] self-center py-2 px-3 border-2 border-black rounded-lg">
                {!inEdit ? (
                  <>
                    <Text>{foundReview.content}</Text>
                    <View className="flex flex-row mt-3 justify-evenly">
                      <Button
                        //disabled={textInput ? false : true}
                        title="Edit"
                        color="gold"
                        onPress={() => {
                          setInEdit(true);
                          setTextInput(foundReview.content);
                        }}
                      />
                      <Button
                        title="Delete"
                        color="red"
                        //disabled={textInput ? false : true}
                        onPress={handleDelete}
                      />
                    </View>
                  </>
                ) : (
                  <>
                    <TextInput
                      onChangeText={setTextInput}
                      value={textInput}
                      placeholder="Your review...."
                      className="mb-4"
                    />
                    <View className="flex flex-row justify-evenly">
                      <Button
                        //disabled={textInput ? false : true}
                        title="Cancel"
                        color="red"
                        onPress={() => {
                          setInEdit(false);
                        }}
                      />
                      <Button
                        title="Submit"
                        color="green"
                        disabled={textInput ? false : true}
                        onPress={() => {
                          handleSubmit();
                          setInEdit(false);
                        }}
                      />
                    </View>
                  </>
                )}
              </View>
            </View>
          ) : (
            <View>
              <Text className="text-lg font-extrabold text-center">
                Add your review here:
              </Text>
              <View className="w-[80%] self-center py-2 px-3 border-2 border-black rounded-lg">
                <TextInput
                  onChangeText={setTextInput}
                  value={textInput}
                  placeholder="Your review...."
                  className="mb-4"
                />
                <View className="flex flex-row justify-evenly">
                  <Button
                    disabled={textInput ? false : true}
                    title="Cancel"
                    color="red"
                    onPress={() => {
                      setTextInput("");
                    }}
                  />
                  <Button
                    title="Submit"
                    color="green"
                    disabled={textInput ? false : true}
                    onPress={handleSubmit}
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      }
      data={review}
      renderItem={({ item }) => (
        <View className="mb-3">
          <View className="flex flex-row justify-evenly">
            <View className="flex flex-row w-[18%] justify-center mt-3">
              {item.author_details.avatar_path ? (
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w154/${item.author_details.avatar_path}`,
                  }}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <Image
                  source={require("./assets/blank_avatar.jpg")}
                  className="w-8 h-8 rounded-full"
                />
              )}
            </View>
            <View className="border-2 border-black rounded-md w-[80%] self-end px-3 py-2">
              <View>
                <Text className="font-extrabold">{item.author}:</Text>
              </View>
              {/* <Text>{displayText(item.content)}</Text>
              {item.content.length > 100 && (
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
              )} */}
              <Text>{displayText(item.content, item.id)}</Text>
              {item.content.length > 100 && (
                <TouchableOpacity
                  onPress={() => {
                    toggleReadMore(item.id);
                  }}
                  className="self-center w-24 border-2 border-teal-500 rounded-xl"
                >
                  <Text className="text-center">
                    {expandedItems[item.id] ? "Show Less" : "Show More"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}
      keyExtractor={(item) => item.id}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
});

export default Review;
