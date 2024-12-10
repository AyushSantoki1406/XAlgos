import { View, Text, SafeAreaView, StyleSheet, StatusBar } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ProductionUrl } from "../../../../URL/URL";
import { ThemeContext } from "../../../../utils/ThemeContext";
import NetInfo from "@react-native-community/netinfo";
import NoInternet from "../../../_root/NoInternet";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const Deploy = () => {
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
        Deploy
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

export default Deploy;
