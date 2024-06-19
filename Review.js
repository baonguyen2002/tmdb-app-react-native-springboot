import React, { Component, useState, useCallback, useContext } from "react";
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
import { apiBaseUrl } from "./API";
import { Context } from "./Context";
import axios from "axios";
import Loading from "./Loading";
import { updateGenreScore } from "./updateGenreScore";
import { useFocusEffect } from "@react-navigation/native";
const Review = ({ route }) => {
  const { id, type, genreIdList } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [review, setreview] = useState([]);
  const [mongoReview, setMongoReview] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [yourReview, setYourReview] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [inEdit, setInEdit] = useState(false);
  const { username } = useContext(Context);
  //const [showFullText, setShowFullText] = useState(false);
  const fetchYourReview = async () => {
    if (type === "movie") {
      axios
        .get(`${apiBaseUrl}/comment/user/${username}`)
        .then((response) => {
          //console.log(response.data);
          if (response.data.length > 0) {
            setYourReview(response.data[0]);
          }
        })
        .catch((error) => {
          console.log(`Error getting user ${username} review:`, error);
        });
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
  const fetchCommentFromMongoDB = () => {
    axios
      .get(`${apiBaseUrl}/comment/id/${id}`)
      .then((response) => {
        console.log(response.data);
        setMongoReview(response.data);
      })
      .catch((err) => {
        console.error("Error fetching comments from mongo:", err);
      });
  };
  const fetchReviewsFromAPI = () => {
    fetchCommentFromMongoDB();
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
      if (yourReview) {
        setTextInput(yourReview.comment);
      }
    }, [])
  );
  const handleDelete = (sentiment) => {
    if (type === "movie") {
      axios
        .delete(`${apiBaseUrl}/comment/${username}/${id}`)
        .then((res) => {
          console.log("delete comment successfully");
        })
        .catch((err) => {
          console.error("Error deleting review of user :", err);
        });
      const idArray = genreIdList.split(",");
      let gerneIdDict = {};
      for (item of idArray) {
        if (sentiment === "positive") {
          gerneIdDict[`${item.trim()}`] = -2;
        }
        if (sentiment === "negative") {
          gerneIdDict[`${item.trim()}`] = 2;
        }
      }
      //console.log(gerneIdDict);
      updateGenreScore(gerneIdDict, username);
      setYourReview(null);
      const newData = mongoReview.filter((obj) => obj.username !== username);
      setMongoReview(newData);
    } else {
      const tvReviewDelete = async () => {
        try {
          await deleteTvReview(id);
          //fetchYourReview();
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
            //fetchYourReview();
          } catch (error) {
            console.error("Error updating movieReview", error);
          }
        };
        movieReviewUpdate();
      } else {
        axios
          .post(`https://7577-58-186-196-178.ngrok-free.app/comment`, {
            comment: textInput,
            tmdb_id: id,
            username: username,
          })
          .then((response) => {
            console.log("added comment successfully:", response.data);
            setYourReview(response.data);
            const idArray = genreIdList.split(",");
            let gerneIdDict = {};
            for (item of idArray) {
              if (response.data.sentiment === "positive") {
                gerneIdDict[`${item.trim()}`] = 2;
              }
              if (response.data.sentiment === "negative") {
                gerneIdDict[`${item.trim()}`] = -2;
              }
            }
            //console.log(gerneIdDict);
            updateGenreScore(gerneIdDict, username);
            // Adding a new object to the array
            const newObject = {
              username: username,
              tmdbId: id,
              sentiment: response.data.sentiment,
              comment: textInput,
            };
            const updatedData = [...mongoReview, newObject];
            setMongoReview(updatedData);
          })
          .catch((error) => {
            console.error("Error posting comment: ", error);
          });
      }
    } else {
      if (inEdit) {
        const tvReviewUpdate = async () => {
          try {
            await updateTvReview(id, textInput);
            //fetchYourReview();
          } catch (error) {
            console.error("Error updating tvReview", error);
          }
        };
        tvReviewUpdate();
      } else {
        const tvReviewAdd = async () => {
          try {
            await insertTvReview(id, textInput);
            //fetchYourReview(); // Fetch updated
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
  // function findReviewById(list, id) {
  //   if (type === "movie") {
  //     return list.find((obj) => obj.movieId === id);
  //   } else {
  //     return list.find((obj) => obj.tvID === id);
  //   }
  // }
  // const foundReview = findReviewById(yourReview, id);

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
    <>
      <FlatList
        className="bg-teal-500"
        ListHeaderComponent={
          <>
            <View className="mb-3">
              {yourReview ? (
                <View>
                  <Text className="text-lg font-extrabold text-center">
                    {inEdit ? "Editing:" : "Your review:"}
                  </Text>
                  <View className="w-[80%] self-center py-2 px-3 border-2 border-black rounded-lg">
                    {!inEdit ? (
                      <>
                        <Text>{yourReview.comment}</Text>
                        <View className="flex flex-row mt-3 justify-evenly">
                          {/* <Button
                    //disabled={textInput ? false : true}
                    title="Edit"
                    color="gold"
                    onPress={() => {
                      setInEdit(true);
                      setTextInput(yourReview.comment);
                    }}
                  /> */}
                          <Button
                            title="Delete"
                            color="red"
                            //disabled={textInput ? false : true}
                            onPress={() => {
                              handleDelete(yourReview.sentiment);
                            }}
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
            <Text>From My MongoDB</Text>
            <FlatList
              className="bg-teal-500"
              data={mongoReview}
              keyExtractor={(item) => item.username}
              renderItem={({ item }) => (
                <View className="mb-3">
                  <View className="flex flex-row justify-evenly">
                    <View className="flex flex-row w-[18%] justify-center mt-3">
                      <Image
                        source={require("./assets/blank_avatar.jpg")}
                        className="w-8 h-8 rounded-full"
                      />
                    </View>
                    <View className="border-2 border-black rounded-md w-[80%] self-end px-3 py-2">
                      <View>
                        <Text className="font-extrabold">{item.username}:</Text>
                      </View>

                      <Text>{displayText(item.comment, item.username)}</Text>
                      {item.comment.length > 100 && (
                        <TouchableOpacity
                          onPress={() => {
                            toggleReadMore(item.username);
                          }}
                          className="self-center w-24 border-2 border-teal-500 rounded-xl"
                        >
                          <Text className="text-center">
                            {expandedItems[item.username]
                              ? "Show Less"
                              : "Show More"}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              )}
            />
            <Text>From TMDB</Text>
          </>
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
    </>
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
