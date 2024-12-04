import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { TextInput } from "react-native-paper";
import { useNavigation } from "expo-router";
import { ThemeContext } from "../../utils/ThemeContext";
import axios from "axios";
import img from "../../assets/lightlogo.png";
import { router } from "expo-router";
import { ProductionUrl } from "../../URL/URL";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPassword] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { currentTheme } = useContext(ThemeContext);

  const handleGetStartedPress = async () => {
    const url =
      process.env.NODE_ENV === "production" ? ProductionUrl : ProductionUrl;

    try {
      const response = await axios.post(`${url}/signin`, {
        email,
        pass,
      });

      if (!response.data.email) {
        console.log("Email does not exist");
      } else if (response.data.password === false) {
        console.log("Password is not correct");
      } else if (response.data.verification === false) {
        console.log("Email is not verified");
      } else {
        console.log("Login successfully");
        await AsyncStorage.setItem("isLogged", "true");
        await AsyncStorage.setItem("Email", email);
        router.replace("/(drawer)/(tabs)/Dashboard");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleLinkPress = () => {
    router.replace("/(auth)/SignUp");
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <Image style={styles.image} source={img} />
      <Text style={[styles.header]}>Log In</Text>

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

      <TextInput
        label="Password"
        value={pass}
        onChangeText={setPassword}
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
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <Text style={styles.link} onPress={handleLinkPress}>
        Create new account
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: wp("60%"),
    height: hp("30%"),
    aspectRatio: 4,
    marginTop: hp("5%"),
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
