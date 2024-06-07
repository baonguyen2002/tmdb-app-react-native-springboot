import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import axios from "axios";
import Loading from "./Loading";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ListView from "./ListView";
const Tabs = createMaterialTopTabNavigator();
const OtherCreditsTabs = ({ route }) => {
  const { id, origin, type } = route.params;
  return (
    <Tabs.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        tabBarLabelStyle: {
          textTransform: "none",
          fontSize: 16,
          fontWeight: "bold",
          color: "#14b8a6",
        },

        tabBarStyle: {
          backgroundColor: "#5b21b6",
        }, // Background color for the tab bar
        //tabStyle: { backgroundColor: "orange" },
        // tabBarActiveTintColor: "#14b8a6",
        // tabBarInactiveTintColor: "#14b8a6",
        tabBarIndicatorStyle: { backgroundColor: "#14b8a6" },
      }}
    >
      <Tabs.Screen
        name="OtherCastCredits"
        component={OtherCredits}
        initialParams={{
          screenType: "personcast",
          id: id,
          origin: origin,
          type: type,
        }}
        options={{ headerTitle: "Cast", tabBarLabel: "Cast" }}
      />
      <Tabs.Screen
        name="OtherCrewCredits"
        component={OtherCredits}
        initialParams={{
          screenType: "personcrew",
          id: id,
          origin: origin,
          type: type,
        }}
        options={{ headerTitle: "Crew", tabBarLabel: "Crew" }}
      />
    </Tabs.Navigator>
  );
};
const OtherCredits = ({ route }) => {
  function truncateString(str) {
    if (str.length > 35) {
      return str.slice(0, 35) + "...";
    }
    return str;
  }
  const { id, origin, type, screenType } = route.params;
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  //const [endReached, setEndReached] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // let location = "";
  // switch (origin) {
  //   case "moviemain":
  //     location = "MainMovieDetail";
  //     break;
  //   case "moviesearch":
  //     location = "SearchMovieDetails";
  //     break;
  //   case "moviemy":
  //     location = "MyMovieDetails";
  //     break;
  //   case "tvmain":
  //     location = "MainShowDetail";
  //     break;
  //   case "tvsearch":
  //     location = "SearchTvDetails";
  //     break;
  //   case "tvmy":
  //     location = "MyTvDetails";
  //     break;
  // }
  const list = screenType === "personcast" ? cast : crew;

  const fetchList = () => {
    axios
      .get(
        `https://api.themoviedb.org/3/person/${id}/${
          type === "movies" ? "movie_credits" : "tv_credits"
        }?api_key=841da308423b4b64ea4d57d052583683`
      )
      .then((res) => {
        // console.log(res.data.cast);
        setCast(res.data.cast);
        setCrew(res.data.crew);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    console.log(id, "origin:", origin, type);
    fetchList();
  }, []);
  return !isLoading ? (
    list && list.length > 0 ? (
      <>
        {/* <FlatList
          data={list}
          initialNumToRender={5}
          maxToRenderPerBatch={7}
          updateCellsBatchingPeriod={1000}
          ListFooterComponent={() => {
            if (!endReached) {
              return <Loading />;
            } else {
              return null;
            }
          }}
          onEndReached={() => {
            setEndReached(true);
          }}
          renderItem={({ item }) => (
            <>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  height: 140,
                  padding: 1,
                  marginVertical: 1,
                  borderRadius: 4,
                  borderColor: "indigo",
                  borderWidth: 4,
                }}
                onPress={() => {
                  navigation.push(location, {
                    id: item.id,
                    header: type === "movies" ? item.title : item.name,
                    origin: origin,
                  });
                }}
              >
                <View style={{ width: "fit-content" }}>
                  {item.poster_path ? (
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w154/${item.poster_path}`,
                      }}
                      style={{
                        width: 100,
                        height: "100%",
                        marginRight: 1,
                        borderRadius: 8,
                      }}
                    />
                  ) : (
                    <Image
                      source={require("./assets/blank.png")}
                      style={{
                        width: 24,
                        height: "100%",
                        marginRight: 1,
                        borderRadius: 8,
                      }}
                    />
                  )}
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: "flex-start",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                    {truncateString(type === "movies" ? item.title : item.name)}
                  </Text>

                  <Text style={{ fontSize: 14, fontWeight: "normal" }}>
                    {type === "movies"
                      ? `Release date: ${item.release_date}`
                      : `First aired: ${item.first_air_date}`}
                  </Text>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                      Rating:{" "}
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
                  {screenType === "cast" ? (
                    item.character && item.character.length > 0 ? (
                      <Text style={{ fontSize: 14, fontWeight: "normal" }}>
                        As:{" "}
                        <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                          {truncateString(item.character)}
                        </Text>
                      </Text>
                    ) : (
                      <Text style={{ fontSize: 14, fontWeight: "normal" }}>
                        As:{" "}
                        <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                          To be updated
                        </Text>
                      </Text>
                    )
                  ) : item.job && item.job.length > 0 ? (
                    <Text style={{ fontSize: 14, fontWeight: "normal" }}>
                      Role:{" "}
                      <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                        {truncateString(item.job)}
                      </Text>
                    </Text>
                  ) : (
                    <Text style={{ fontSize: 14, fontWeight: "normal" }}>
                      Role:{" "}
                      <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                        To be updated
                      </Text>
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </>
          )}
          keyExtractor={(item) => item.credit_id}
        /> */}
        <ListView
          role={screenType}
          results={list}
          type={type}
          setPage={false}
          origin={origin}
          isNewDataEmpty={false}
        />
      </>
    ) : (
      <View className="flex items-center justify-center w-full h-full bg-teal-500">
        <Text className="px-4 text-2xl font-extrabold text-center text-blue-800">
          Seems like this person has not taken part in any other works...
        </Text>
      </View>
    )
  ) : (
    <Loading />
  );
};

export default OtherCreditsTabs;
