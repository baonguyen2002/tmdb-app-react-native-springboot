import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import Loading from "./Loading";
import GridView from "./GridView";
import { LinearGradient } from "expo-linear-gradient";
const DiscoverResults = ({ route }) => {
  const [currentPage, setcurrentPage] = useState(1);
  //const { moviePage, setMoviePage } = useContext(Context);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [maxPage, setMaxPage] = useState(0);

  const { url, origin, type, navigationDestination } = route.params;
  useEffect(() => {
    console.log("url:", url, "origin:", origin);
    fetchResults();
  }, [page]);
  const fetchResults = () => {
    axios
      .get(`${url}&page=${page}`)
      .then((response) => {
        //console.log("response:", response.data.results);
        setResult(response.data.results);
        setcurrentPage(page.toString());
        if (response.data.total_pages > 500) {
          setMaxPage(500);
        } else {
          setMaxPage(response.data.total_pages);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  function detectSpecialCharacters(str) {
    const regex = /[.,+\-\s]/g; // Regular expression to match commas, dots, plus signs, minus signs, and whitespace
    return regex.test(str);
  }
  const GoToPage = () => {
    if (detectSpecialCharacters(currentPage) || parseInt(currentPage) < 1) {
      Alert.alert("Invalid", "Invalid page number");
      return;
    } else if (parseInt(currentPage) > maxPage) {
      Alert.alert("Invalid", `Page number too high (<${maxPage})`);
      return;
    } else if (parseInt(currentPage) === page) {
      Alert.alert("Notice", "You are at this page number");
      return;
    } else {
      setPage(parseInt(currentPage));
      setIsLoading(true);
    }
  };

  const GoNext = () => {
    setPage((prev) => prev + 1);
    setIsLoading(true);
  };

  const GoBack = () => {
    setPage((prev) => prev - 1);
    setIsLoading(true);
  };
  return isLoading ? (
    <Loading />
  ) : (
    <>
      <GridView
        data={result}
        dataType={type}
        navigationDestination={navigationDestination}
        origin={origin}
      />
      <View className="flex flex-row items-center justify-between px-4 py-2 bg-teal-500">
        {page === 1 ? (
          <View></View>
        ) : (
          // <Button
          //   onPress={() => GoBack()}
          //   title="<<"
          //   color="#6b21a8"
          //   accessibilityLabel="Go back previous page"
          // />
          <TouchableOpacity
            className="items-center justify-center w-12 rounded-md h-9 bg-violet-800"
            onPress={() => GoBack()}
          >
            <Text className="font-extrabold text-center text-teal-500">
              {"<<"}
            </Text>
          </TouchableOpacity>
        )}
        <View className="flex flex-row items-center justify-between">
          <Text className="font-semibold text-blue-900">Page: </Text>
          <TextInput
            keyboardType="numeric"
            onChangeText={setcurrentPage}
            value={currentPage}
            className="w-12 font-semibold text-center text-blue-900"
          />
          {/* <Button
            onPress={() => GoToPage()}
            title="Go"
            color="#6b21a8"
            accessibilityLabel="Go to specified page"
          /> */}
          <TouchableOpacity
            className="items-center justify-center w-10 rounded-md h-9 bg-violet-800"
            onPress={() => GoToPage()}
          >
            <Text className="font-extrabold text-center text-teal-500">Go</Text>
          </TouchableOpacity>
        </View>
        {page === maxPage ? (
          <View></View>
        ) : (
          // <Button
          //   onPress={() => GoNext()}
          //   title=">>"
          //   color="#6b21a8"
          //   accessibilityLabel="Go to next page"
          // />
          <TouchableOpacity
            className="items-center justify-center w-12 rounded-md h-9 bg-violet-800"
            onPress={() => GoNext()}
          >
            <Text className="font-extrabold text-center text-teal-500">
              {">>"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default DiscoverResults;
