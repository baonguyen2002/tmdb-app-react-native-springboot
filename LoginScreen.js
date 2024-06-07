import React, { useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Context } from "./Context";
import axios from "axios";
const windowHeight = Dimensions.get("window").height;
import { createStackNavigator } from "@react-navigation/stack";
import ConfirmPage from "./ConfirmPage";

import { useNavigation, useFocusEffect } from "@react-navigation/native";
const Stack = createStackNavigator();
const LoginScreen = () => {
  const navigation = useNavigation();
  const { setSessionId, approved, setApproved } = useContext(Context);
  const [requestToken, setRequestToken] = useState("");
  const [logInButtonDisabled, setLogInButtonDisabled] = useState(false);
  const [failedOnce, setFailedOnce] = useState(false);
  const fetchRequestToken = () => {
    setRequestToken("");
    axios
      .get(
        `https://api.themoviedb.org/3/authentication/token/new?api_key=841da308423b4b64ea4d57d052583683`
      )
      .then((response) => {
        console.log("request token: " + response.data.request_token);
        setRequestToken(response.data.request_token);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const gettingApprovalClick = () => {
    navigation.navigate("ConfirmPage", {
      requestToken: requestToken,
    });
  };
  useFocusEffect(
    useCallback(() => {
      if (!approved) {
        setApproved(false);
        setSessionId(null);
        setRequestToken(null);
        fetchRequestToken();
      }
    }, [approved])
  );
  const fetchSessionId = () => {
    axios
      .get(
        `https://api.themoviedb.org/3/authentication/session/new?api_key=841da308423b4b64ea4d57d052583683&request_token=${requestToken}`
      )
      .then((response) => {
        console.log("session id: " + response.data.session_id);
        setSessionId(response.data.session_id);
      })
      .catch((err) => {
        //console.error(err);
        Alert.alert("Error", "Log in failed, please try again");
        fetchRequestToken();
        setLogInButtonDisabled(false);
        setApproved(false);
        setFailedOnce(true);
      });
  };
  const buttonColor = !logInButtonDisabled
    ? "rgb(20, 184, 166)"
    : "rgb(115, 115, 115)";

  return (
    <View className="bg-violet-800 " style={{ height: windowHeight + 2000 }}>
      <View className="items-center justify-center w-full ">
        <Image source={require("./assets/tmdb.png")} className="mb-24 mt-52" />
        {requestToken ? (
          <>
            {failedOnce ? (
              <>
                {/* <Button
                  title="Retry authentication"
                  onPress={() => {
                    gettingApprovalClick();
                  }}
                /> */}
                <TouchableOpacity
                  className="items-center justify-center h-12 bg-teal-500 rounded-lg w-44"
                  onPress={() => {
                    gettingApprovalClick();
                  }}
                >
                  <Text className="text-base font-semibold text-blue-800">
                    Retry authentication
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* <Button
                  title="Log in via TMDB account"
                  onPress={() => {
                    gettingApprovalClick();
                  }}
                /> */}
                <TouchableOpacity
                  className="items-center justify-center w-56 h-12 bg-teal-500 rounded-lg"
                  onPress={() => {
                    gettingApprovalClick();
                  }}
                >
                  <Text className="text-base font-semibold text-blue-800 ">
                    Log in via TMDB account
                  </Text>
                </TouchableOpacity>
              </>
            )}
            {approved ? (
              <View className="mt-4">
                {/* <Button
                  disabled={logInButtonDisabled}
                  title="Enter app"
                  onPress={() => {
                    setLogInButtonDisabled(true);
                    fetchSessionId();
                  }}
                /> */}
                <TouchableOpacity
                  className="items-center justify-center w-32 h-12 bg-teal-500 rounded-lg"
                  onPress={() => {
                    setLogInButtonDisabled(true);
                    fetchSessionId();
                  }}
                  disabled={logInButtonDisabled}
                  style={{ backgroundColor: buttonColor }}
                >
                  <Text className="text-base font-semibold text-blue-800 ">
                    Enter app
                  </Text>
                </TouchableOpacity>
                {logInButtonDisabled ? (
                  <View className="h-5 mt-6">
                    <Loading />
                  </View>
                ) : null}
              </View>
            ) : null}
          </>
        ) : (
          <>
            <Text className="mb-10 text-lg font-extrabold text-white">
              Initializing. Please wait...
            </Text>
            <Loading />
          </>
        )}
      </View>
    </View>
  );
};

const LoginStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ConfirmPage"
        component={ConfirmPage}
        options={{
          headerTitleAlign: "center",
          headerTitle: "Approval Request",
          headerStyle: {
            backgroundColor: "#5b21b6",
          },
          headerTintColor: "#14b8a6",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </Stack.Navigator>
  );
};

const Loading = () => (
  <View style={[styles.container, styles.horizontal]}>
    <ActivityIndicator size="large" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});

export default LoginStack;
