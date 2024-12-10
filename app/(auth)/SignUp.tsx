import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { TextInput } from "react-native-paper";
import { useNavigation, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProductionUrl } from "../../URL/URL";
import img from "../../assets/lightlogo.png";
import axios from "axios";
import { router } from "expo-router";
import { ThemeContext } from "../../utils/ThemeContext";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const verified = false;
  const [isFocused, setIsFocused] = useState(false);
  const navigator = useNavigation();
  const { currentTheme } = useContext(ThemeContext);

  const url =
    process.env.NODE_ENV === "production" ? ProductionUrl : ProductionUrl;

  console.log("API URL:", url);

  const handleGetStartedPress = async () => {
    try {
      const a = await axios.post(`${url}/signup`, { email, verified });
      if (a.data.signup) {
        alert("email send");
      } else {
        alert("already exist");
      }
    } catch (e) {
      console.log("error in sign up ", e);
    }
  };

  const handleLinkPress = () => {
    router.replace("/(auth)/SignIn");
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      const isLogged = await AsyncStorage.getItem("isLogged");
      if (isLogged === "true") {
        navigator.navigate("Home" as never);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <SafeAreaView style={[styles.container]}>
      <StatusBar
        backgroundColor={currentTheme.theme == "light" ? "#FFFFFF" : "#000000"}
        barStyle={
          currentTheme.theme == "light" ? "dark-content" : "light-content"
        }
      />
      <Image style={styles.image} source={img} />
      <Text style={[styles.header]}>Sign Up</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={[
          styles.mText,
          { fontSize: isFocused ? wp("3.5%") : wp("3.5%") },
        ]}
        theme={{ colors: { primary: "#3498db" } }}
      />

      <TouchableOpacity style={styles.button} onPress={handleGetStartedPress}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.link} onPress={handleLinkPress}>
        You already Logged in
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  image: {
    width: wp("60%"),
    height: hp("30%"),
    aspectRatio: 4,
    marginTop: hp("10%"),
    resizeMode: "contain",
  },
  mText: {
    width: wp("80%"),
    marginTop: hp("2%"),
    paddingLeft: hp("1%"),
  },
  header: {
    fontSize: wp("7%"),
    marginTop: wp("5%"),
    marginBottom: hp("5%"),
  },
  button: {
    textAlign: "center",
    backgroundColor: "#007bff",
    marginTop: hp("5%"),
    width: wp("80%"),
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("30%"),
    borderRadius: 5,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: wp("5%"),
    fontWeight: "bold",
  },
  link: {
    fontSize: wp("3%"),
    color: "#3498db",
    marginTop: hp("3%"),
  },
});
