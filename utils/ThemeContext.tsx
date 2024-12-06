import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import lightLogo from "../assets/lightlogo.png";
import darkLogo from "../assets/darklogo.png";
import { ImageSourcePropType } from "react-native";
import lightAdd from "../assets/images/light_add.png";
import darladd from "../assets/images/dark_add.png";
// Define the Theme type
export type Theme = {
  theme: "light" | "dark";
  color: string;
  background: string;
  secondbackground: string;
  shadowColor: string;
  subscribeButton: string;
  subscribedButtonBackground: string;
  subscribedText: string;
  subscribeText: string;
  DeployButton: string;
  DeployText: string;
  deployButtonDisabledBackground: string;
  deployButtonDisabledText: string;
  splashLogo: ImageSourcePropType;
  addLogo: ImageSourcePropType;
  iconColor: string;
  profilebg: string;
  card:string;
};

// Define the themes
const theme = {
  light: {
    theme: "light" as const,
    color: "#000000",
    background: "#F4F4F4",
    secondbackground:"#F5F5F5",
    shadowColor: "#000000",
    subscribeButton: "#1a1a1a",
    subscribedButtonBackground: "#BDBDBD",
    subscribedText: "#FFFFFF",
    subscribeText: "#FFFFFF",
    DeployButton: "#0056B3",
    DeployText: "#FFFFFF",
    deployButtonDisabledBackground: "#BDBDBD",
    deployButtonDisabledText: "#757575",
    splashLogo: lightLogo,
    addLogo: lightAdd,
    iconColor: "#000000",
    profilebg: "gray",
    card:"#FFFFFF",
  },
  dark: {
    theme: "dark" as const,
    color: "#FFFFFF",
    background: "#000000",
    secondbackground:"#121212",
    shadowColor: "#FFFFFF",
    subscribeButton: "#fff",
    subscribeText: "#000000",
    subscribedButtonBackground: "#757575",
    subscribedText: "#FFFFFF",
    DeployButton: "#0056B3",
    DeployText: "#FFFFFF",
    deployButtonDisabledBackground: "#757575",
    deployButtonDisabledText: "#BDBDBD",
    splashLogo: darkLogo,
    addLogo: darladd,
    iconColor: "#FFFFFF",
    profilebg: "#1e1e1e",
    card:"#1a1a1a",
  },
};

// Define the context type
export interface ThemeContextType {
  currentTheme: Theme;
  toggleTheme: () => void;
}

// Create the context with default values
export const ThemeContext = createContext<ThemeContextType>({
  currentTheme: theme.light,
  toggleTheme: () => {},
});

// Define the ThemeProvider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(theme.light);

  // Load theme from AsyncStorage when app loads
  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem("theme");
      if (storedTheme) {
        setCurrentTheme(storedTheme === "dark" ? theme.dark : theme.light);
      }
    };
    loadTheme();
  }, []);

  // Toggle theme function with AsyncStorage
  const toggleTheme = async () => {
    const newTheme = currentTheme.theme === "light" ? theme.dark : theme.light;
    setCurrentTheme(newTheme);
    await AsyncStorage.setItem("theme", newTheme.theme);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
