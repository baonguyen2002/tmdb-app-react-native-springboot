import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect } from "react";
const VideoWebView = ({ route }) => {
  const navigation = useNavigation();
  const { item, header } = route.params;
  useLayoutEffect(() => {
    navigation.setOptions({ title: header });
  }, [navigation, header]);
  return (
    <WebView
      source={{ uri: `https://www.youtube.com/watch?v=${item.key}` }}
      style={{ flex: 1 }}
    />
  );
};

export default VideoWebView;
