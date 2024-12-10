import React, { useContext } from "react";
import { View, Text, Image, StyleSheet, StatusBar } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import imageUrl from "../../assets/images/no_internet-removebg-preview.png";
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
      <Image source={imageUrl} style={styles.image} />
      <Text style={styles.title}>OPPS! NO INTERNET</Text>
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
  },
  image: {
    width: wp("40%"), // 40% of screen width
    height: hp("20%"), // 20% of screen height
    marginBottom: hp("3%"),
  },
  title: {
    fontSize: wp("5%"), // Adjust based on screen width
    fontWeight: "bold",
    marginBottom: hp("2%"),
  },
  description: {
    fontSize: wp("4%"),
    textAlign: "center",
    lineHeight: hp("3%"),
  },
});

export default NoDataScreen;
