import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import React, { useRef, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Animated,
  Platform,
  StatusBar,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ThemeContext } from "../../../../utils/ThemeContext";

export default function TabLayout() {
  const { currentTheme } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    tabBarStyle: {
      marginTop: hp("2%"),
      position: "absolute",
      top: 0,
      paddingHorizontal: 10,
      elevation: 5,
      fontWeight: "900",
      backgroundColor:
        (currentTheme.theme as unknown as string) === "light"
          ? "#FFFFFF"
          : "#1e1e1e",
      borderRadius: Platform.OS == "ios" ? hp("4%") : hp("3%"),
      borderColor: "#000000",
      height: hp("5%"),
      borderTopWidth: 0,
      shadowColor: currentTheme.theme === "dark" ? "#000" : "#333",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      marginHorizontal: hp("1%"),
    },
    tabBarLabelStyle: {
      fontWeight: "bold",
      fontSize: 12,
      color: currentTheme.color,
      textAlign: "center",
      flex: 1,
      paddingTop: hp("0.9%"),
    },
  });

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: styles.tabBarStyle,
          tabBarLabelStyle: styles.tabBarLabelStyle,
          tabBarIconStyle: { display: "none" }, // Disable the icon style
          tabBarIcon: () => null, // Completely remove the icon
        })}
      >
        <Tabs.Screen
          name="Deploy"
          options={{
            title: "Deploy",
          }}
        />
        <Tabs.Screen
          name="MyStrategies"
          options={{
            title: "My Strategies",
          }}
        />
        <Tabs.Screen
          name="MarketPlace"
          options={{
            title: "Market Place",
          }}
        />
      </Tabs>
    </View>
  );
}
