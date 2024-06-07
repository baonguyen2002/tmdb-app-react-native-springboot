import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MovieStack from "./Movies";
import ShowsStack from "./Shows";
import SearchStack from "./Search";
import SuggestionsStack from "./Suggestions";
import ProfileStack from "./Profile";
import { ContextProvider } from "./Context";
import { MaterialIcons, Entypo, FontAwesome } from "@expo/vector-icons";
const Tab = createBottomTabNavigator();
import { SafeAreaProvider } from "react-native-safe-area-context";
import LoginScreen from "./LoginScreen";
import { Context } from "./Context";
import { useContext, useState, useEffect, Suspense } from "react";
import SplashScreen from "./SplashScreen";
import DiscoverStack from "./Discover";
import {
  setUpDatabase,
  getGenreScoreTableRows,
  insertDefaultGenreData,
} from "./Database";
import { Loading } from "./Loading";
function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveBackgroundColor: "#14b8a6",
        tabBarInactiveBackgroundColor: "#5b21b6",
        tabBarActiveTintColor: "#1e40af",
        tabBarInactiveTintColor: "#14b8a6",
        tabBarLabelStyle: {
          fontWeight: "bold",
          fontSize: 13,
        },
      }}
    >
      <Tab.Screen
        name="MoviesStack"
        component={MovieStack}
        options={{
          headerShown: false,
          tabBarLabel: "Movies",
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="movie"
              size={24}
              color={focused ? "#1e40af" : "#14b8a6"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="SuggestionsStack"
        component={SuggestionsStack}
        options={{
          headerShown: false,
          tabBarLabel: "Suggestions",
          tabBarIcon: ({ focused }) => (
            // <MaterialIcons
            //   name="movie"
            //   size={24}
            //   color={focused ? "#1e40af" : "#14b8a6"}
            // />
            <MaterialIcons
              name="recommend"
              size={24}
              color={focused ? "#1e40af" : "#14b8a6"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="search"
              size={24}
              color={focused ? "#1e40af" : "#14b8a6"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          headerShown: false,
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="user"
              size={24}
              color={focused ? "#1e40af" : "#14b8a6"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const App = () => {
  const [rowCount, setRowCount] = useState(0);
  setUpDatabase();
  useEffect(() => {
    const getRowCount = async () => {
      try {
        const ListFromDB = await getGenreScoreTableRows();
        setRowCount(ListFromDB.length);
        console.log("fetched genreScore main: ", ListFromDB.length);
        if (ListFromDB.length == 0) {
          await insertDefaultGenreData();
        }
      } catch (error) {
        console.log("Error fetching genreScore list:", error);
      }
    };
    getRowCount();
  }, []);
  console.log(`The table "genreScore" has ${rowCount} rows.`);
  // if (rowCount == 0) {
  //   insertDefaultGenreData();
  // }

  return (
    <SafeAreaProvider>
      <ContextProvider>
        <NavigationContainer>
          <MyTabs />
        </NavigationContainer>
      </ContextProvider>
    </SafeAreaProvider>
  );
};

export default App;
