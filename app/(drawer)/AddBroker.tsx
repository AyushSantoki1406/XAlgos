import React, { useContext } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "expo-router";
import Broker from "./Broker";
import { router } from "expo-router";
import { ThemeContext } from "../../utils/ThemeContext";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProductionUrl } from "../../URL/URL";

export default function App() {
  const navigator = useNavigation();
  const { currentTheme } = useContext(ThemeContext);

  const textColor =
    (currentTheme as unknown as string) === "light" ? "#ffffff" : "#000000";

  const [selected, setSelected] = React.useState<string>("AngleOne");
  const [clientId, setClientId] = React.useState<string>("");
  const [pin, setPin] = React.useState<string>("");
  const [toptKey, setToptKey] = React.useState<string>("");
  const [apiKey, setApiKey] = React.useState<string>("");
  const [deltaApiSecret, setDeltaApiSecret] = React.useState<string>("");
  const [deltaApiKey, setDeltaApiKey] = React.useState<string>("");

  const url = process.env.NODE_ENV === "test" ? ProductionUrl : ProductionUrl;

  const data = [
    { label: "AngleOne", value: "AngleOne" },
    { label: "Delta", value: "Delta" },
  ];

  const handleSubmit = async () => {
    try {
      const email = await AsyncStorage.getItem("Email"); // Ensure email retrieval
      if (!email) {
        Alert.alert("Error", "Email not found. Please log in again.");
        return;
      }

      if (selected == "AngleOne") {
        const response = await axios.post(`${url}/addbroker`, {
          First: true,
          id: clientId,
          pass: pin,
          email: email,
          secretKey: toptKey,
          ApiKey: apiKey,
        });
        console.log(response.data);

        if (response.status === 200) {
          Alert.alert("Success", "Broker added successfully!");
          setClientId("");
          setPin("");
          setToptKey("");
          setApiKey("");
          setSelected("");
          router.push("/Broker");
        } else {
          Alert.alert("Error", "Failed to add broker. Please try again.");
        }
      } else {
        const response = await axios.post(`${url}/addDeltaBroker`, {
          email: email,
          apiKey: deltaApiKey,
          apiSecret: deltaApiSecret,
        });
        console.log(".........");
        console.log(response.data);
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        "An error occurred. Please check your network connection."
      );
    }
  };

  const handleback = () => {
    router.replace("/Broker");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: hp("100%"),
      width: wp("100%"),
    },
    headerContainer: {
      flexDirection: "row",
      height: hp("6%"),
      alignItems: "center",
      paddingHorizontal: wp("4%"),
      borderBottomWidth: 1,
      borderBottomColor: "#CCCCCC",
    },
    backButton: {
      padding: wp("2%"),
    },
    backButtonText: {
      color: "#007AFF",
      fontSize: hp("2%"),
    },
    headerText: {
      fontSize: hp("2.5%"),
      fontWeight: "bold",
      color: "#333",
      flex: 1,
      textAlign: "center",
    },
    card: {
      marginHorizontal: wp("5%"),
      marginTop: hp("2%"),
      paddingHorizontal: wp("4%"),
      paddingVertical: hp("3%"),
      borderRadius: 10,
      shadowColor: currentTheme.color,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 10,
    },
    dropdown: {
      borderRadius: 8,
      padding: wp("2%"),
      marginBottom: hp("2%"),
      borderWidth: 1,
      borderColor: "#CCCCCC",
      color: "#FFFFFF",
    },
    dropdownText: {
      fontSize: hp("2%"),
      color: currentTheme.color,
    },
    inputContainer: {
      marginBottom: hp("2%"),
    },
    input: {
      paddingVertical: hp("1.5%"),
      paddingHorizontal: wp("4%"),
      borderRadius: 8,
      fontSize: hp("2%"),
      borderColor: "#CCCCCC",
      borderWidth: 1,
    },
    submitButton: {
      backgroundColor: "#FCD535",
      paddingVertical: hp("1.5%"),
      borderRadius: 8,
      alignItems: "center",
      marginTop: hp("2%"),
    },
    submitButtonText: {
      color: "#FFFFFF",
      fontSize: hp("2.2%"),
      fontWeight: "600",
    },
  });
  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            (currentTheme.theme as unknown as string) == "light"
              ? "#ffffff"
              : "#000000",
        },
      ]}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor:
              (currentTheme.theme as unknown as string) === "light"
                ? "#FFFFFF"
                : "#000000",
          },
        ]}
      >
        <View
          style={{
            borderColor: "#E6E6E6",
            borderWidth: 1,
            borderRadius: 10,
            paddingHorizontal: hp("1%"),
            marginBottom: hp("2%"),
          }}
        >
          <RNPickerSelect
            onValueChange={(val) => setSelected(val)}
            items={data.map((item) => ({
              label: item.value,
              value: item.label,
              color: (currentTheme.theme as unknown as string)
                ? "#000000"
                : "#FFFFFF",
            }))}
            style={{
              inputAndroid: {
                color:
                  (currentTheme.theme as unknown as string) === "light"
                    ? "#000000"
                    : "#FFFFFF",
                backgroundColor:
                  (currentTheme.theme as unknown as string) === "light"
                    ? "#ffffff"
                    : "#000000",
              },
              placeholder: {
                color:
                  (currentTheme.theme as unknown as string) === "light"
                    ? "#000000"
                    : "#FFFFFF",
              },
            }}
            placeholder={{ label: "Select Broker", value: "" }} // Set placeholder value to an empty string
            value={selected}
          />
        </View>

        {selected == "AngleOne" && (
          <>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor:
                    (currentTheme.theme as unknown as string) === "light"
                      ? "#ffffff"
                      : "#000000",
                },
              ]}
            >
              <TextInput
                placeholder="Client Id"
                style={[
                  styles.input,
                  {
                    color:
                      (currentTheme.theme as unknown as string) === "light"
                        ? "#000000"
                        : "#FFFFFF",
                  },
                ]}
                placeholderTextColor={
                  (currentTheme.theme as unknown as string) === "light"
                    ? "#000000"
                    : "#FFFFFF"
                }
                value={clientId}
                onChangeText={setClientId}
              
              />
            </View>

            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor:
                    (currentTheme.theme as unknown as string) === "light"
                      ? "#ffffff"
                      : "#000000",
                },
              ]}
            >
              <TextInput
                placeholder="PIN"
                style={[
                  styles.input,
                  {
                    color:
                      (currentTheme.theme as unknown as string) === "light"
                        ? "#000000"
                        : "#FFFFFF",
                  },
                ]}
                placeholderTextColor={
                  (currentTheme.theme as unknown as string) === "light"
                    ? "#000000"
                    : "#FFFFFF"
                }
                secureTextEntry
                value={pin}
                onChangeText={setPin}
              />
            </View>

            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor:
                    (currentTheme.theme as unknown as string) === "light"
                      ? "#ffffff"
                      : "#000000",
                },
              ]}
            >
              <TextInput
                placeholder="Topt Key"
                style={[
                  styles.input,
                  {
                    color:
                      (currentTheme.theme as unknown as string) === "light"
                        ? "#000000"
                        : "#FFFFFF",
                  },
                ]}
                placeholderTextColor={
                  (currentTheme.theme as unknown as string) === "light"
                    ? "#000000"
                    : "#FFFFFF"
                }
                value={toptKey}
                onChangeText={setToptKey}
              />
            </View>

            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor:
                    (currentTheme.theme as unknown as string) === "light"
                      ? "#ffffff"
                      : "#000000",
                },
              ]}
            >
              <TextInput
                placeholder="Api Key"
                style={[
                  styles.input,
                  {
                    color:
                      (currentTheme.theme as unknown as string) === "light"
                        ? "#000000"
                        : "#FFFFFF",
                  },
                ]}
                placeholderTextColor={
                  (currentTheme.theme as unknown as string) === "light"
                    ? "#000000"
                    : "#FFFFFF"
                }
                value={apiKey}
                onChangeText={setApiKey}
              />
            </View>
          </>
        )}

        {selected === "Delta" && (
          <>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor:
                    (currentTheme.theme as unknown as string) === "light"
                      ? "#ffffff"
                      : "#000000",
                },
              ]}
            >
              <TextInput
                placeholder="Api Secret"
                style={[
                  styles.input,
                  {
                    color:
                      (currentTheme.theme as unknown as string) === "light"
                        ? "#000000"
                        : "#FFFFFF",
                  },
                ]}
                placeholderTextColor={
                  (currentTheme.theme as unknown as string) === "light"
                    ? "#000000"
                    : "#FFFFFF"
                }
                value={deltaApiSecret}
                onChangeText={setDeltaApiSecret}
              />
            </View>

            <TextInput
              placeholder="Api Key"
              style={[
                styles.input,
                {
                  color:
                    (currentTheme.theme as unknown as string) === "light"
                      ? "#000000"
                      : "#FFFFFF",
                },
              ]}
              placeholderTextColor={
                (currentTheme.theme as unknown as string) === "light"
                  ? "#000000"
                  : "#FFFFFF"
              }
              value={deltaApiKey}
              onChangeText={setDeltaApiKey}
            />
          </>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add Broker</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
