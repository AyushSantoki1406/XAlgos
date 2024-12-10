import React, { useContext } from "react";
import { View, Text, Image, StyleSheet, StatusBar } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import imageUrl from "../../assets/images/nodata-removebg-preview.png";
import { ThemeContext } from "../../utils/ThemeContext";

const NoDataScreen = () => {
  const { currentTheme } = useContext(ThemeContext);
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
      {/* Replace the URI with your actual image path */}
      <Image source={imageUrl} style={styles.image} />
      <Text style={[styles.title, { color: currentTheme.color }]}>
        OPPS! NO DATA FOUND
      </Text>
      <Text style={styles.description}>
        It seems like there’s nothing to display here at the moment. Check back
        later or try refreshing the page!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: wp("4%"),
    height: hp("100%"),
    width: wp("100%"),
  },
  image: {
    width: wp("40%"),
    height: hp("20%"),
    marginBottom: hp("3%"),
  },
  title: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    marginBottom: hp("2%"),
  },
  description: {
    fontSize: wp("4%"),
    color: "#7C7C7C",
    textAlign: "center",
    lineHeight: hp("3%"),
  },
});

export default NoDataScreen;
