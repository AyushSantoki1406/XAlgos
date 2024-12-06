import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ThemeContext } from "../../utils/ThemeContext";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router, useNavigation } from "expo-router";
import { ProductionUrl } from "../../URL/URL";

const ProfileScreen = () => {
  const { currentTheme } = useContext(ThemeContext);
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const url = process.env.NODE_ENV === "test" ? ProductionUrl : ProductionUrl;

  type MenuItemProps = {
    icon: string;
    text: string;
    color?: string;
    onPress: () => void;
  };

  const MenuItem: React.FC<MenuItemProps> = ({
    icon,
    text,
    color = "#FFD700",
    onPress,
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Icon name={icon} size={24} color={color} style={styles.menuIcon} />
      <Text style={[styles.menuText, { color: currentTheme.color }]}>
        {text}
      </Text>
      <Icon name="chevron-right" size={24} color="#888" />
    </TouchableOpacity>
  );

  const handlepress = () => {
    router.replace("/(drawer)/EditProfile");
  };

  const handlepressLogout = async () => {
    try {
      await AsyncStorage.removeItem("isLogged");
      router.replace("/(auth)/SignIn");
    } catch (e) {
      console.log(e);
    }
  };

  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const profile_img = async () => {
      try {
        const email = await AsyncStorage.getItem("Email");
        const response = await axios.post(`${url}/navbar`, {
          userEmail: email,
        });
        console.log(response.data);
        setImageUrl(response.data.img);
        setEmail(email);
      } catch (e) {
        console.error("Error fetching profile image:", e);
      }
    };
    profile_img();
  }, []);

  useEffect(() => {
    const profile_data = async () => {
      const email = await AsyncStorage.getItem("Email");
      const response = await axios.post(`${url}/profile`, {
        email,
      });
      setUserName(response.data.name);
    };
    profile_data();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: currentTheme.background },
      ]}
    >
      <View style={styles.profileSection}>
        <Image
          source={{
            uri: imageUrl,
            cache: "force-cache",
          }}
          style={styles.profileImage}
          defaultSource={require("../../assets/images/user.png")} // Add a local default image
        />
        <TouchableOpacity
          style={styles.editIconContainer}
          onPress={handlepress}
        >
          <Icon name="edit" size={21} color="#333333" />
        </TouchableOpacity>
        <Text style={[styles.profileName, { color: currentTheme.color }]}>
          {userName}
        </Text>
        <Text style={[styles.profileEmail, { color: currentTheme.color }]}>
          {email}
        </Text>
      </View>

      {/* Menu Options */}
      <View style={[styles.menuSection]}>
        <MenuItem
          icon="settings"
          text="Settings"
          onPress={() => console.log("Settings clicked")}
        />
        <MenuItem
          icon="credit-card"
          text="Billing Details"
          onPress={() => router.replace("/_root/NoInternet")}
        />
        <MenuItem
          icon="people"
          text="User Management"
          onPress={() => console.log("User clicked")}
        />
        <MenuItem
          icon="info"
          text="Information"
          onPress={() => console.log("Information clicked")}
        />
        <MenuItem icon="logout" text="Logout" onPress={handlepressLogout} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: hp("4%"),
    alignItems: "center",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: hp("2%"),
  },
  profileImage: {
    width: wp("21%"),
    height: hp("10%"),
    borderRadius: 50,
    borderWidth: wp("0.5%"),
    borderColor: "#FFD700",
  },
  editIconContainer: {
    position: "absolute",
    right: wp("10%"),
    bottom: hp("7%"),
    backgroundColor: "#FFD700",
    borderColor: "#333333",
    borderWidth: 2,
    borderRadius: 15,
    padding: wp("0.5%"),
  },
  profileName: {
    fontSize: hp("2%"),
    fontWeight: "bold",
    marginTop: hp("1%"),
  },
  profileEmail: {
    fontSize: hp("1.5%"),
    marginBottom: hp("1%"),
  },
  editProfileButton: {
    backgroundColor: "#FFD700",
    borderRadius: 25,
    paddingVertical: wp("1%"),
    paddingHorizontal: hp("3%"),
    marginTop: hp("1%"),
  },
  menuSection: {
    width: wp("90%"),
    marginTop: hp("2%"),
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  menuIcon: {
    marginRight: hp("1.5%"),
  },
  menuText: {
    flex: 1,
    fontSize: hp("2%"),
  },
  logoutText: {
    color: "#D11A2A",
  },
});

export default ProfileScreen;
