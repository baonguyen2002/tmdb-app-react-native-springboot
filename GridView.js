import React, { PureComponent, useCallback } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { insertRecentMovie } from "./Database";
import { Badge } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
const GridView = ({ data, dataType, navigationDestination, origin }) => {
  const navigation = useNavigation();
  const renderItem = useCallback(
    ({ item }) => {
      if (item.adult) {
        // If item.adult is true, return null to skip rendering the item
        return null;
      }
      return (
        <Item
          item={item}
          dataType={dataType}
          navigation={navigation}
          navigationDestination={navigationDestination}
          origin={origin}
        />
      );
    },
    [dataType, navigation, navigationDestination, origin]
  );

  return (
    <FlatList
      className="bg-teal-500"
      columnWrapperStyle={{
        justifyContent: "space-evenly",
      }}
      data={data}
      numColumns={2}
      maxToRenderPerBatch={6}
      initialNumToRender={4}
      updateCellsBatchingPeriod={2000}
      renderItem={renderItem}
      keyExtractor={(item) => item.tmdb_id}
    />
  );
};

class Item extends PureComponent {
  render() {
    const { item, dataType, navigation, navigationDestination, origin } =
      this.props;

    const header = dataType === "movie" ? item.title : item.name;
    const date = dataType === "movie" ? item.release_date : item.first_air_date;
    const handleInsertRecentMovie = async (
      movieId,
      posterImageUrl,
      name,
      date,
      popularity
    ) => {
      try {
        await insertRecentMovie(
          movieId,
          posterImageUrl,
          name,
          date,
          popularity
        );
        //fetchFavMovieFromDatabase(); // Fetch updated after deleting
      } catch (error) {
        //console.error("Error inserting recent movie", error);
      }
    };
    return (
      <TouchableOpacity
        onPress={async () => {
          await handleInsertRecentMovie(
            item.tmdb_id,
            item.poster_path,
            header,
            date,
            item.vote_average
          );
          //console.log("series_id:", item.id, "movie_id:", item.id);
          navigation.navigate(navigationDestination, {
            series_id: item.id,
            movie_id: item.tmdb_id,
            header: header,
            origin: origin,
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
          {header}
        </Text>
        <View className="flex flex-row items-center w-full justify-evenly">
          {date ? (
            <Text className="font-medium text-violet-800">
              Year: {date.split("-")[0]}
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
    );
  }
}

export default GridView;
