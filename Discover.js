import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  ScrollView,
  Alert,
  Pressable,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { MultiSelect, Dropdown } from "react-native-element-dropdown";
import MovieGenre from "./MovieGenre";
import TVGenre from "./TVGenre";
import SortBy from "./SortBy";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import DiscoverResults from "./DiscoverResults";
import { useNavigation } from "@react-navigation/native";
import MovieDetail from "./MovieDetail";
import ShowDetails from "./ShowDetails";
import PersonProfileStack from "./PersonProfile";
const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const DiscoverStack = () => {
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
        name="DiscoverTabs"
        component={DiscoverTabs}
        options={{ headerTitle: "Discover" }}
      />
      <Stack.Screen
        name="DiscoverResults"
        component={DiscoverResults}
        options={{ headerTitle: "Results" }}
      />
      <Stack.Screen
        name="DiscoverMovie"
        component={MovieDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DiscoverTv"
        component={ShowDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DiscoverPerson"
        component={PersonProfileStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const DiscoverTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
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
      <Tab.Screen
        name="DiscoverMovie"
        component={Discover}
        options={{ tabBarLabel: "Movie" }}
        initialParams={{ type: "movie" }}
      />
      <Tab.Screen
        name="DiscoverTv"
        component={Discover}
        options={{ tabBarLabel: "TV Show" }}
        initialParams={{ type: "tv" }}
      />
    </Tab.Navigator>
  );
};

const Discover = ({ route }) => {
  const navigation = useNavigation();
  const { type } = route.params;
  const [selected, setSelected] = useState([]);
  const [sortValue, setSortValue] = useState("");
  useEffect(() => {
    //  console.log(type);
  }, [selected]);
  const renderItem2 = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.name}</Text>
        {item.value === sortValue && (
          <AntDesign
            name="checkcircle"
            size={24}
            color="black"
            style={styles.icon}
          />
        )}
      </View>
    );
  };
  const renderItem = (item) => {
    // Check if the item is selected
    const isSelected = selected.includes(item);

    return (
      <Pressable
        onPress={() => {
          // Toggle the selection of the item
          if (isSelected) {
            setSelected(selected.filter((i) => i !== item));
          } else {
            setSelected([...selected, item]);
          }
        }}
        style={[
          styles.item,
          isSelected && { backgroundColor: "yellow" }, // Apply different background color for selected item
        ]}
      >
        <Text
          style={[
            styles.textItem,
            isSelected && { color: "red" }, // Apply different text color for selected item
          ]}
        >
          {item.name}
        </Text>
      </Pressable>
    );
  };
  const renderItem1 = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.name}</Text>
        <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
      </View>
    );
  };
  const DiscoverItem = () => {
    if (selected.length === 0) {
      Alert.alert("Alert", "Select at least one (1) genre");
      return;
    }
    const joinedString = selected.join("%2C");
    let url = "";
    if (type === "movie") {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=841da308423b4b64ea4d57d052583683&sort_by=${sortValue}&include_adult=false&include_video=false&with_genres=${joinedString}&language=en-US`;
    } else {
      url = `https://api.themoviedb.org/3/discover/tv?api_key=841da308423b4b64ea4d57d052583683&sort_by=${sortValue}&include_adult=true&include_video=false&with_genres=${joinedString}`;
    }
    navigation.navigate("DiscoverResults", {
      url: url,
      origin: type === "movie" ? "moviediscover" : "tvdiscover",
      type: type,
      navigationDestination: type === "movie" ? "DiscoverMovie" : "DiscoverTv",
    });
  };

  const data = type === "movie" ? MovieGenre : TVGenre;
  return (
    <ScrollView style={styles.container} className="bg-teal-500">
      <View className="w-full ">
        <View className="w-full">
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={SortBy}
            maxHeight={300}
            labelField="name"
            valueField="value"
            placeholder="Order by"
            searchPlaceholder="Search..."
            value={sortValue}
            onChange={(item) => {
              setSortValue(item.value);
            }}
            renderLeftIcon={() => (
              <AntDesign
                style={styles.icon}
                color="black"
                name="Safety"
                size={20}
              />
            )}
            renderItem={renderItem2}
          />
        </View>
        <View className="w-full my-4">
          <MultiSelect
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={MovieGenre}
            labelField="name"
            valueField="id"
            placeholder="Select item"
            value={selected}
            //search
            searchPlaceholder="Search..."
            onChange={(item) => {
              setSelected(item);
            }}
            renderLeftIcon={() => (
              <AntDesign
                style={styles.icon}
                color="black"
                name="Safety"
                size={20}
              />
            )}
            renderItem={renderItem1}
            renderSelectedItem={(item, unSelect) => (
              <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                <View style={styles.selectedStyle}>
                  <Text style={styles.textSelectedStyle}>{item.name}</Text>
                  <AntDesign color="black" name="delete" size={17} />
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={DiscoverItem}
        className="items-center justify-center w-full h-10 rounded-lg bg-violet-800"
      >
        <Text className="text-lg font-bold text-center text-teal-500">
          Discover
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  dropdown: {
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "white",
    shadowColor: "#000",
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
  },
});
export default DiscoverStack;
