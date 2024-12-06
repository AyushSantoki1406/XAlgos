import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import React, { useState, useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, Switch, Image } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { router } from "expo-router";
import {
  ThemeProvider,
  ThemeContext,
  ThemeContextType,
} from "../../utils/ThemeContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import axios from "axios";
import { ProductionUrl } from "../../URL/URL";

function CustomDrawerContent(props) {
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const { toggleTheme, currentTheme } = useContext(
    ThemeContext
  ) as ThemeContextType;

  const router = useRouter();

  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: currentTheme.background }}
    >
      <DrawerItem
        label="📊 Dashboard"
        labelStyle={{ color: currentTheme.color }}
        onPress={() => router.replace("/(drawer)/(tabs)/Dashboard")}
      />
      <DrawerItem
        label="🤝 Manage Broker"
        labelStyle={{ color: currentTheme.color }}
        onPress={() => router.replace("/(drawer)/Broker")}
      />

      {/* Settings Header with Arrow Toggle */}
      <TouchableOpacity onPress={() => setSettingsExpanded(!settingsExpanded)}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: wp("4%"),
            paddingVertical: hp("2%"),
          }}
        >
          <Text style={{ fontSize: 16, color: currentTheme.color }}>
            ⚙️ Settings
          </Text>
        </View>
      </TouchableOpacity>

      {/* Conditionally Render Sub-items */}
      {settingsExpanded && (
        <View
          style={{
            marginBottom: hp("2%"),
            marginLeft: wp("5%"),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: wp("5%"),
            }}
          >
            <Text style={{ marginRight: wp("2%"), color: currentTheme.color }}>
              🎨 Dark Mode
            </Text>
            <Switch
              onValueChange={toggleTheme}
              value={currentTheme.theme === "dark"}
              trackColor={{ false: "#767577", true: "#ffffff" }}
              thumbColor={currentTheme.theme === "dark" ? "#f5dd4b" : "#f4f3f4"}
            />
          </View>
        </View>
      )}
    </DrawerContentScrollView>
  );
}

export default function Layout() {
  
  const [imageUrl, setImageUrl] = useState("");
  const url = process.env.NODE_ENV === "test" ? ProductionUrl : ProductionUrl;

  useEffect(() => {
    const profile_img = async () => {
      try {
        const response = await axios.post(`${url}/navbar`, {
          userEmail: "harshdvadhavana26@gmail.com",
        });
        console.log(response.data);
        setImageUrl(response.data.img);
      } catch (e) {
        console.error("Error fetching profile image:", e);
      }
    };
    profile_img();
  }, []);

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          screenOptions={({ navigation }) => {
            const { currentTheme } = useContext(ThemeContext);
            return {
              headerTitleAlign: "center",
              title: "X-Algos",
              headerStyle: {
                backgroundColor: currentTheme.background,
              },
              headerTintColor: currentTheme.color,
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => router.replace("/(drawer)/Profile")}
                  style={{ marginRight: wp("4%") }}
                >
                  <Image
                    source={{
                      uri: imageUrl,
                      cache: "force-cache",
                    }}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                    defaultSource={require("../../assets/images/user.png")} // Add a local default image
                  />
                </TouchableOpacity>
              ),
            };
          }}
          drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
          <Drawer.Screen name="Dashboard" />
          <Drawer.Screen name="Broker" />
          <Drawer.Screen name="Profile" />
          <Drawer.Screen name="EditProfile" options={{ headerShown: false }} />
        </Drawer>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
