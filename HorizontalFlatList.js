import React, { useCallback, PureComponent } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { Badge } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { insertRecentMovie } from "./Database";
const HorizontalFlatList = ({
  data,
  level2Text,
  level3Text,
  level4Text,
  dataType,
  navigationDestination,
  origin,
  series_id,
  movie_id,
}) => {
  const navigation = useNavigation();
  const filteredData = data.filter((item) => item.tmdbId !== movie_id);
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
          level2Text={level2Text}
          level3Text={level3Text}
          level4Text={level4Text}
          navigation={navigation}
          navigationDestination={navigationDestination}
          origin={origin}
          series_id={series_id}
        />
      );
    },
    [
      dataType,
      navigation,
      navigationDestination,
      origin,
      level2Text,
      level3Text,
      level4Text,
      series_id,
    ]
  );

  return (
    <FlatList
      className="mb-4 bg-teal-500"
      data={filteredData}
      initialNumToRender={5}
      maxToRenderPerBatch={7}
      updateCellsBatchingPeriod={1000}
      horizontal // Set the horizontal prop to true
      showsHorizontalScrollIndicator={false} // Optional: hide the horizontal scroll indicator
      keyExtractor={(item) => {
        if (dataType.includes("person")) {
          return item.credit_id.toString();
        } else {
          return item.tmdbId.toString();
        }
      }}
      renderItem={renderItem}
    />
  );
};

class Item extends PureComponent {
  render() {
    const {
      item,
      dataType,
      navigation,
      navigationDestination,
      origin,
      series_id,
      level2Text,
      level3Text,
      level4Text,
    } = this.props;
    const seriesId = dataType === "show" ? item.id : series_id;
    const role = dataType.includes("cast") ? item.character : item.job;
    const header = dataType === "movie" ? item.title : item.name;
    const poster = dataType.includes("person")
      ? item.profile_path
      : dataType === "episode"
      ? item.still_path
      : item.poster_path;
    const human = dataType.includes("person") ? true : false;
    const date =
      dataType === "movie"
        ? item.release_date
        : dataType === "season"
        ? item.air_date
        : item.first_air_date;
    // let id;
    // switch (dataType) {
    //   case "person":
    //     // code block
    //     id = item.id;
    //     break;
    //   case "season":
    //     // code block
    //     id = series_id;
    //     break;
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
        className="items-center py-3  mx-1 border-2 border-violet-800 rounded-lg w-[180]"
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
            poster,
            header,
            date,
            item.vote_average
          );
          navigation.push(navigationDestination, {
            header: header,
            series_id: seriesId,
            season_number: item.season_number,
            origin: origin,
            person_id: dataType.includes("person") ? item.id : null,
            movie_id: item.tmdbId,
            // season_number: season_number,
            episode_number: item.episode_number,
          });
        }}
      >
        {poster ? (
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w185/${poster}`,
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
          {header}
        </Text>
        {level2Text ? (
          <Text className="text-sm font-bold text-center text-[#0d253f]">
            {role}
          </Text>
        ) : null}
        {level3Text ? (
          <View className="flex flex-row items-center justify-evenly">
            {date ? (
              <Text className="w-1/3 text-sm font-medium text-violet-800">
                {date.split("-")[0]}
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
        ) : null}
        {level4Text ? (
          <Text className="text-base font-bold">
            Episodes: {item.episode_count}
          </Text>
        ) : null}
      </TouchableOpacity>
    );
  }
}

export default HorizontalFlatList;
