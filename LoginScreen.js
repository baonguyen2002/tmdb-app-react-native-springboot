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
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
} from "react-native";
import { Context } from "./Context";
import axios from "axios";
import Toast from "react-native-toast-message";
const windowHeight = Dimensions.get("window").height;
import { createStackNavigator } from "@react-navigation/stack";
import ConfirmPage from "./ConfirmPage";
import { apiBaseUrl } from "./API";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
const Stack = createStackNavigator();
const LoginScreen = () => {
  const navigation = useNavigation();
  const { setUsername } = useContext(Context);
  const [username1, setUsername1] = useState("");
  const [password, setPassword] = useState("");
  const toRegister = () => {
    navigation.navigate("RegisterScreen");
  };
  const handleLogin = () => {
    console.log(username1);
    console.log(password);
    axios
      .post(`${apiBaseUrl}/user/login`, {
        username: username1,
        password: password,
      })
      .then((response) => {
        setUsername(response.data.username);
      })
      .catch((error) => {
        console.error(error);
        Toast.show({
          type: "error",
          text1: "Error logging in",
        });
      });
  };

  return (
    <View className="bg-violet-800 " style={{ height: windowHeight + 2000 }}>
      <KeyboardAvoidingView
        className="items-center justify-center w-full "
        behavior={Platform.OS === "ios" ? "padding" : "position"}
      >
        <Image source={require("./assets/tmdb.png")} className="mb-24 mt-52" />
        <TextInput
          style={{
            padding: 10,
            marginBottom: 10,
            backgroundColor: "rgb(20, 184, 166)",
            borderRadius: 10,
          }}
          inputMode="text"
          placeholder="Enter username"
          value={username1}
          onChangeText={setUsername1}
        />
        <TextInput
          style={{
            padding: 10,
            marginBottom: 10,
            backgroundColor: "rgb(20, 184, 166)",
            borderRadius: 10,
          }}
          inputMode="text"
          placeholder="Enter password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          className="items-center justify-center w-56 h-12 mb-20 bg-teal-500 rounded-lg"
          onPress={handleLogin}
        >
          <Text className="text-base font-semibold text-blue-800 ">Log in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center justify-center w-56 h-12 my-2 bg-teal-500 rounded-lg"
          onPress={toRegister}
        >
          <Text className="text-base font-semibold text-blue-800 ">
            Register
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};
const RegisterScreen = () => {
  const navigation = useNavigation();
  const { username, setUsername } = useContext(Context);
  const [username1, setUsername1] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [email, setEmail] = useState("");
  const handleRegistration = () => {
    if (!(username1 && password && repassword && email)) {
      Toast.show({
        type: "error",
        text1: "Please fill in all required fields",
      });
      return;
    }
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\W)[\w\W]{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    axios
      .get(`${apiBaseUrl}/user/${username1}`)
      .then(() => {
        Toast.show({
          type: "error",
          text1: "Username already in use",
        });
        return;
      })
      .catch((err) => {
        //console.error(err);
        if (!emailRegex.test(email)) {
          Toast.show({
            type: "error",
            text1: "Please enter a valid email address",
          });
          return;
        }
        if (!passwordRegex.test(password)) {
          Toast.show({
            type: "error",
            text1:
              "Password: at least 8 characters, with 1 letter and 1 special character",
          });
          return;
        }
        if (
          password.length === 0 ||
          repassword.length === 0 ||
          !(password === repassword)
        ) {
          Toast.show({
            type: "error",
            text1: "Passwords do not match",
          });
          return;
        }
        axios
          .post(`${apiBaseUrl}/user`, {
            username: username1,
            password: password,
            email: email,
          })
          .then((response) => {
            console.log(response.data);
            Toast.show({
              type: "success",
              text1: "User added successfully",
            });
          })
          .catch((error) => {
            console.error(error);
            Toast.show({
              type: "error",
              text1: "Error adding user",
            });
          });
      });
  };
  return (
    <View className="flex flex-row w-full h-full bg-violet-800">
      <View className="items-center justify-center w-full">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TextInput
            style={{
              padding: 10,
              marginBottom: 10,
              backgroundColor: "rgb(20, 184, 166)",
              borderRadius: 10,
            }}
            inputMode="text"
            placeholder="Enter username"
            value={username1}
            onChangeText={setUsername1}
          />
          <TextInput
            style={{
              padding: 10,
              marginBottom: 10,
              backgroundColor: "rgb(20, 184, 166)",
              borderRadius: 10,
            }}
            inputMode="text"
            placeholder="Enter email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={{
              padding: 10,
              marginBottom: 10,
              backgroundColor: "rgb(20, 184, 166)",
              borderRadius: 10,
            }}
            inputMode="text"
            placeholder="Enter password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={{
              padding: 10,
              marginBottom: 10,
              backgroundColor: "rgb(20, 184, 166)",
              borderRadius: 10,
            }}
            inputMode="text"
            placeholder="Re-enter password"
            secureTextEntry
            value={repassword}
            onChangeText={setRepassword}
          />
          <TouchableOpacity
            className="items-center justify-center w-56 h-12 bg-teal-500 rounded-lg"
            onPress={handleRegistration}
          >
            <Text className="text-base font-semibold text-blue-800 ">
              Register
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
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
        name="RegisterScreen"
        component={RegisterScreen}
        //options={{ headerShown: false }}
        options={{
          headerTitleAlign: "center",
          headerTitle: "Register",
          headerStyle: {
            backgroundColor: "#5b21b6",
          },
          headerTintColor: "#14b8a6",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      {/* <Stack.Screen
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
      /> */}
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
