import { View, Text, SafeAreaView, StyleSheet, StatusBar } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ProductionUrl } from "../../../URL/URL";
import { ThemeContext } from "../../../utils/ThemeContext";
import NetInfo from "@react-native-community/netinfo";
import NoInternet from "../../_root/NoInternet";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ActiveTrade = () => {
  const [isConnected, setIsConnected] = useState(true);
  const { currentTheme } = useContext(ThemeContext);

  const url =
    process.env.NODE_ENV === "production" ? ProductionUrl : ProductionUrl;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!isConnected) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: currentTheme.background }]}
      >
        <NoInternet />
      </SafeAreaView>
    );
  }

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
      <Text style={[{ color: currentTheme.color, paddingTop: hp("5%") }]}>
        <Skeleton
          customHighlightBackground={
            currentTheme.theme === "light"
              ? "linear-gradient(90deg, rgba(150, 150, 150, 0.1) 20%, rgba(200, 200, 200, 0.3) 50%, rgba(150, 150, 150, 0.1) 80%)"
              : "linear-gradient(90deg, rgba(20, 20, 20, 0.1) 40%, rgba(0, 0, 0, 0.1) 60%)"
          }
          baseColor={currentTheme.secondbackground}
          style={{
            borderRadius: 12,
            height: hp(3),
            width: "95%",
            alignSelf: "center",
            boxShadow:
              currentTheme.theme === "light"
                ? "0px 4px 8px rgba(0, 0, 0, 0.1)"
                : "0px 4px 8px rgba(0, 0, 0, 0.3)",
            borderWidth: 1,
            borderColor: currentTheme.theme === "light" ? "#F0F0F0" : "#333333",
          }}
        />
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default ActiveTrade;
