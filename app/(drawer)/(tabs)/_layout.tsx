import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React, { useRef, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Animated,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ThemeContext } from "../../../utils/ThemeContext";

export default function TabLayout() {
  const { currentTheme } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    tabBarStyle: {
      position: "absolute",
      left: wp("3%"),
      right: wp("3%"),
      elevation: 5,
      color: "#FCD535",
      fontWeight: "900",
      justifyContent: "center",
      borderRadius: Platform.OS === "ios" ? hp("4%") : hp("3%"),
      backgroundColor: currentTheme.theme === "light" ? "#FFFFFF" : "#1e1e1e",
      borderColor: "#000000",
      height: hp("9%"),
      marginBottom: hp("2%"),
      borderTopWidth: 0,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      marginHorizontal: hp("1%"),
    },
    tabBarLabelStyle: {
      color: currentTheme.color,
      fontWeight: "bold",
      fontSize: 12,
      paddingBottom: hp("0%"),
      marginTop: hp("1.5%"),
      marginBottom: Platform.OS === "ios" ? hp("-3%") : hp("1%"),
    },
    iconContainer: {
      color: currentTheme.color,
      justifyContent: "center",
      alignItems: "center",
      marginTop: hp("1.5%"),
      width: wp("13%"),
      height: hp("6%"),
    },
  });

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, size }) => {
          const scaleValue = useRef(new Animated.Value(1)).current;

          useEffect(() => {
            Animated.spring(scaleValue, {
              toValue: focused ? 1.1 : 1,
              friction: 1,
              useNativeDriver: true,
            }).start();
          }, [focused]);

          let iconName;
          if (route.name === "Dashboard") {
            iconName = "analytics-outline";
          } else if (route.name === "PaperTrade") {
            iconName = "cog-outline";
          } else if (route.name === "ActiveTrade") {
            iconName = "cog-outline";
          } else {
            iconName = "file-tray-stacked-sharp";
          }

          return (
            <SafeAreaView>
              <Animated.View
                style={[
                  styles.iconContainer,
                  { transform: [{ scale: scaleValue }] },
                ]}
              >
                <Ionicons
                  name={iconName}
                  size={focused ? size * 1 : size}
                  color={currentTheme.iconColor}
                />
              </Animated.View>
            </SafeAreaView>
          );
        },
        tabBarStyle: styles.tabBarStyle,
        tabBarLabelStyle: styles.tabBarLabelStyle,
      })}
    >
      <Tabs.Screen
        name="Dashboard"
        options={{
          title: "Dashboard",
        }}
      />
      <Tabs.Screen
        name="PaperTrade"
        options={{
          title: "PaperTrade",
        }}
      />
      <Tabs.Screen
        name="ActiveTrade"
        options={{
          title: "ActiveTrade",
        }}
      />
    </Tabs>
  );
}
