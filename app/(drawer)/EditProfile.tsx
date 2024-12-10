import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ThemeContext } from "../../utils/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ProductionUrl } from "../../URL/URL";

const EditProfileScreen = () => {
  const router = useRouter();
  const { currentTheme } = useContext(ThemeContext);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [phone, setPhone] = useState("+92 317 8059528");
  const [password, setPassword] = useState("********");
  const url = process.env.NODE_ENV === "test" ? ProductionUrl : ProductionUrl;

  useEffect(() => {
    const profile_data = async () => {
      const Email = await AsyncStorage.getItem("Email");
      console.log(Email);
      const response = await axios.post(`${url}/profile`, {
        Email,
      });
      console.log(response.data);
      setUserName(response.data.name);
      setEmail(Email);
      setImageUrl(response.data.profile_img);
    };
    profile_data();
  }, []);

  const handleUpdateProfile = async () => {
    const email = await AsyncStorage.getItem("Email");

    const response = await axios.post(`${url}/updateProfile`, {
      email,
      name: userName,
      phone: phone,
      password: password,
    });
    if (response.data.success) {
      alert("Profile updated successfully!");
      router.replace("./Profile");
    } else {
      alert("Failed to update profile.");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: currentTheme.background },
      ]}
    >
      <StatusBar
        backgroundColor={currentTheme.theme == "light" ? "#FFFFFF" : "#000000"}
        barStyle={
          currentTheme.theme == "light" ? "dark-content" : "light-content"
        }
      />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("./Profile")}
        >
          <Ionicons name="arrow-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={[styles.title, { color: currentTheme.color }]}>
          Edit Profile
        </Text>
      </View>

      <View style={styles.profileImageContainer}>
        <Image
          source={{ uri: imageUrl, cache: "force-cache" }}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.cameraIconContainer}>
          <Icon name="camera-alt" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.inputContainer,
          { backgroundColor: currentTheme.profilebg },
        ]}
      >
        <Icon name="person" size={20} color="#FFD700" style={styles.icon} />
        <TextInput
          style={[styles.input, { color: currentTheme.color }]}
          placeholder="Full Name"
          placeholderTextColor="#999"
          value={userName}
          onChangeText={(text) => setUserName(text)}
        />
      </View>

      <View
        style={[
          styles.inputContainer,
          { backgroundColor: currentTheme.profilebg },
        ]}
      >
        <Icon name="email" size={20} color="#FFD700" style={styles.icon} />
        <TextInput
          style={[styles.input, { color: currentTheme.color }]}
          placeholder="E-Mail"
          placeholderTextColor="#999"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>

      <View
        style={[
          styles.inputContainer,
          { backgroundColor: currentTheme.profilebg },
        ]}
      >
        <Icon name="phone" size={20} color="#FFD700" style={styles.icon} />
        <TextInput
          style={[styles.input, { color: currentTheme.color }]}
          placeholder="Phone No"
          placeholderTextColor="#999"
          value={phone}
          onChangeText={(text) => setPhone(text)}
        />
      </View>

      <View
        style={[
          styles.inputContainer,
          { backgroundColor: currentTheme.profilebg },
        ]}
      >
        <Icon name="lock" size={20} color="#FFD700" style={styles.icon} />
        <TextInput
          style={[styles.input, { color: currentTheme.color }]}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <Icon
          name="visibility-off"
          size={20}
          color="#999"
          style={styles.visibilityIcon}
        />
      </View>

      <TouchableOpacity
        style={styles.editProfileButton}
        onPress={handleUpdateProfile}
      >
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: wp("5%"),
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: hp("2%"),
  },
  title: {
    fontSize: wp("6%"),
    fontWeight: "600",
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    left: wp("2%"),
  },
  profileImageContainer: {
    position: "relative",
    marginTop: hp("2%"),
    marginBottom: hp("2%"),
  },
  profileImage: {
    width: wp("30%"),
    height: wp("30%"),
    borderRadius: wp("15%"),
    borderColor: "#FFD700",
    borderWidth: 2,
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: hp("1%"),
    right: hp("1%"),
    backgroundColor: "#FFD700",
    borderRadius: wp("5%"),
    padding: wp("2%"),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: wp("8%"),
    paddingHorizontal: wp("4%"),
    marginVertical: hp("1%"),
    width: "100%",
    height: hp("7%"),
  },
  icon: {
    marginRight: wp("3%"),
  },
  input: {
    flex: 1,
    color: "#FFF",
    fontSize: wp("4%"),
    fontWeight: "500",
  },
  visibilityIcon: {
    marginLeft: wp("2%"),
  },
  editProfileButton: {
    backgroundColor: "#FFD700",
    borderRadius: wp("8%"),
    paddingVertical: hp("2%"),
    width: "100%",
    alignItems: "center",
    marginVertical: hp("2%"),
  },
  buttonText: {
    color: "#000",
    fontSize: wp("5%"),
    fontWeight: "bold",
  },
});

export default EditProfileScreen;
