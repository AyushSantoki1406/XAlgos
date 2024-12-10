import { View, StyleSheet, Image, StatusBar } from "react-native";
import React, { useEffect, useContext, useState } from "react";
import { useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { router } from "expo-router";
import { ThemeContext } from "../utils/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [isLogged, setIsLogged] = useState<boolean | null>(null);
  const { currentTheme } = useContext(ThemeContext);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const loggedIn = await AsyncStorage.getItem("isLogged");
        setTimeout(() => {
          if (loggedIn === "true") {
            router.replace("/(drawer)/(tabs)/Dashboard");
          } else {
            router.replace("/SignUp");
          }
        }, 2000);
      } catch (error) {
        console.error("Error reading login status:", error);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <StatusBar
        backgroundColor={currentTheme.theme == "light" ? "#FFFFFF" : "#000000"}
        barStyle={
          currentTheme.theme == "light" ? "dark-content" : "light-content"
        }
      />
      <Image style={styles.image} source={currentTheme.splashLogo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: wp("70%"),
    height: hp("40%"),
    resizeMode: "contain",
  },
});
