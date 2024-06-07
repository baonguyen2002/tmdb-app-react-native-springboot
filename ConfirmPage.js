import React from "react";
import { WebView } from "react-native-webview";
import { Context } from "./Context";
import { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
const ConfirmPage = ({ route }) => {
  const navigation = useNavigation();
  const { setApproved } = useContext(Context);
  const { requestToken } = route.params;
  //   useEffect(() => {
  //     console.log(requestToken);
  //   }, []);

  const handleWebViewNavigation = (event) => {
    // Extract the URL from the event
    const { url } = event;

    // Check if the URL matches the confirmation page
    if (url.includes("authenticate")) {
      //console.log("Got there");
      // Perform actions based on user interaction
      if (url.includes("allow")) {
        //console.log("User approved");
        setApproved(true);
        navigation.navigate("LoginScreen");
        // Handle the user's approval action
      } else if (url.includes("deny")) {
        //console.log("User denied");
        setApproved(false);
        navigation.navigate("LoginScreen");
        // Handle the user's denial action
      }
    }
  };

  return (
    <WebView
      source={{
        uri: ` https://www.themoviedb.org/authenticate/${requestToken}`,
      }}
      onLoad={() => {
        //  console.log("Loaded")
      }}
      onNavigationStateChange={handleWebViewNavigation}
      style={{
        width: "100%",

        flex: 1,
        alignSelf: "center",
      }}
    />
  );
};

export default ConfirmPage;
