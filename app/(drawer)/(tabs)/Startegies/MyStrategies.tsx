import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ProductionUrl } from "../../../../URL/URL";
import NetInfo from "@react-native-community/netinfo";
import { ThemeContext } from "../../../../utils/ThemeContext";
import NoInternet from "../../../_root/NoInternet";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import image from "../../../../assets/images/strategie_img.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NoData from "../../../_root/NoData";
import RNPickerSelect from "react-native-picker-select";
import { Picker } from "@react-native-picker/picker";

const MyStrategies = () => {
  const [email, setemail] = useState("");
  const [isConnected, setIsConnected] = useState(true);
  const { currentTheme } = useContext(ThemeContext);
  const [userSubscribedStrategies, setUserSubscribedStrategies] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [subscribedStrategies, setSubscribedStrategies] = useState<string[]>(
    []
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [Account, setAccount] = useState([]);
  const [Index, setIndex] = useState([]);
  const [Quaninty, setQuantity] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // State for refreshing

  const sourceArray = [
    { value: "select" },
    { key: "index 1", value: "index 1" },
    { key: "index 2", value: "index 2" },
    { key: "index 3", value: "index 3" },
  ];

  const url =
    process.env.NODE_ENV === "production" ? ProductionUrl : ProductionUrl;

  const fetchdata = async () => {
    try {
      const response = await axios.post(`${url}/getMarketPlaceData`, {
        email,
      });

      const subscribedStrategies =
        response.data.userSchema.SubscribedStrategies;

      const allData = response.data.allData;

      const filteredObjects = allData.filter((item) =>
        subscribedStrategies.includes(item._id)
      );

      setUserSubscribedStrategies(filteredObjects);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  fetchdata();

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchdata();
    setRefreshing(false);
  };

  const removeMyStrategies = async (strategyId) => {
    try {
      // Call the API to remove the strategy
      const response = await axios.post(`${url}/removeSubscribe`, {
        email,
        strategyId,
      });
      // Check if the removal was successful
      if (response.data.message == "Strategy removed successfully") {
        const updatedStrategies = userSubscribedStrategies.filter(
          (strategy) => strategy._id !== strategyId
        );
        setUserSubscribedStrategies(updatedStrategies);
        console.log(updatedStrategies);
      } else {
        console.log("Failed to remove strategy:", response.data.message);
      }
    } catch (error) {
      console.error("Error removing strategy:", error);
    }
  };

  const handleDeployed = (selectedStrategyId) => {
    setModalVisible(true);
  };

  const handleDeploy = async (selectedStrategyId) => {
    setLoading(true);
    console.log("deployed");
    const Email = await AsyncStorage.getItem("Email");
    try {
      const response = await axios.post(`${url}/addDeployed`, {
        Email,
        selectedStrategyId,
        Index,
        Quaninty,
        Account: selectedItem,
      });
      console.log("4444444444444", response);
      setIndex([]);
      setQuantity("");
      setSelectedItem(null);
    } catch (e) {
      console.log(e);
    } finally {
      setTimeout(() => {
        setModalVisible(false);
      }, 5000);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const Email = await AsyncStorage.getItem("Email");
        setemail(Email);
        const response = await axios.post(`${url}/dbschema`, {
          Email,
        });

        if (response.data.BrokerIds) {
          console.log(response.data.BrokerIds);
          setAccount(response.data.BrokerIds);
        } else {
          console.error("BrokerData is not an array");
          setAccount([]);
        }
      } catch (e) {
        console.log(e);
        setAccount([]);
      }
    };
    fetchData();
  }, []);

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

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: currentTheme.subscribeText },
        ]}
      >
        {" "}
        <ActivityIndicator
          size="large"
          color={currentTheme.color}
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        />
      </SafeAreaView>
    );
  }

  const formatDate = (date: string) => {
    const formattedDate = new Date("2023-03-15").toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return formattedDate;
  };

  return (
    <SafeAreaView
      style={[
        styles.container_main,
        { backgroundColor: currentTheme.background },
      ]}
    >
      <StatusBar
        backgroundColor={currentTheme.theme == "light" ? "#FFFFFF" : "#000000"}
        barStyle={
          currentTheme.theme == "light" ? "dark-content" : "light-content"
        }
      />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {userSubscribedStrategies.length === 0 ? (
          <SafeAreaView
            style={[
              styles.container2,
              { backgroundColor: currentTheme.background },
            ]}
          >
            <NoData />
          </SafeAreaView>
        ) : (
          <SafeAreaView
            style={[
              styles.container,
              { backgroundColor: currentTheme.background },
            ]}
          >
            {userSubscribedStrategies.map((strategy, index) => (
              <View
                style={[styles.card, { backgroundColor: currentTheme.card }]}
                key={strategy._id}
              >
                <View>
                  <View style={styles.header}>
                    <Image source={image} style={styles.img} />
                    <View style={styles.headerText}>
                      <Text
                        style={[styles.title, { color: currentTheme.color }]}
                      >
                        {strategy.title}
                      </Text>
                      <Text
                        style={[styles.subtitle, { color: currentTheme.color }]}
                      >
                        Strategy : {strategy.strategyType}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.content}>
                    <Text
                      style={[
                        styles.description,
                        { color: currentTheme.color, marginBottom: hp("4%") },
                      ]}
                    >
                      <Text style={[styles.boldText, { fontSize: hp("1.7%") }]}>
                        Capital requirement :
                      </Text>
                      {strategy.capitalRequirement}
                    </Text>
                    <Text
                      style={[
                        styles.description,
                        { color: currentTheme.color, marginBottom: hp("4%") },
                      ]}
                    >
                      {strategy.description}
                    </Text>

                    <View
                      style={[
                        styles.infoRow,
                        {
                          borderColor: "gray",
                          borderWidth: 1,
                          borderRadius: 5,
                        },
                      ]}
                    >
                      <Text
                        style={[styles.infoText, { color: currentTheme.color }]}
                      >
                        ✍️ Created By: {strategy.createdBy}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.infoRow,
                        {
                          borderColor: "gray",
                          borderWidth: 1,
                          borderRadius: 5,
                          marginBottom: hp("1%"),
                        },
                      ]}
                    >
                      <Text
                        style={[styles.infoText, { color: currentTheme.color }]}
                      >
                        📅 Created on: {formatDate(strategy.dateOfCreation)}
                      </Text>
                    </View>

                    <View style={styles.statsRow}>
                      <View
                        style={[
                          styles.statsCard,
                          {
                            borderColor: "gray",
                            borderWidth: 1,
                            borderRadius: 5,
                            flex: 1,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.infoText,
                            { color: currentTheme.color },
                          ]}
                        >
                          👥 Subscriber: {strategy.subscribeCount}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.statsCard,
                          {
                            borderColor: "gray",
                            borderWidth: 1,
                            borderRadius: 5,
                            flex: 1,
                            marginLeft: wp("2%"),
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.infoText,
                            { color: currentTheme.color },
                          ]}
                        >
                          🚀 Deployed: {strategy.deployedCount}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.infoRow2,
                        {
                          borderColor: "gray",
                          borderWidth: 1,
                          borderRadius: 5,
                        },
                      ]}
                    >
                      <Text
                        style={[styles.infoText, { color: currentTheme.color }]}
                      >
                        🕒 {strategy.days} at {strategy.time}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.statsRow}>
                    <TouchableOpacity
                      style={[
                        styles.button,
                        {
                          backgroundColor: subscribedStrategies.includes(
                            strategy._id
                          )
                            ? currentTheme.subscribedButtonBackground
                            : currentTheme.subscribeButton,
                          borderColor: currentTheme.color,
                        },
                      ]}
                      onPress={() => removeMyStrategies(strategy._id)}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          {
                            color: subscribedStrategies.includes(strategy._id)
                              ? currentTheme.subscribedText
                              : currentTheme.subscribeText,
                          },
                        ]}
                      >
                        Remove
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.button,
                        {
                          backgroundColor: subscribedStrategies.includes(
                            strategy._id
                          )
                            ? currentTheme.DeployButton
                            : currentTheme.deployButtonDisabledBackground,
                          borderColor: currentTheme.color,
                        },
                      ]}
                      onPress={() => handleDeployed(strategy._id)}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          {
                            color: subscribedStrategies.includes(strategy._id)
                              ? currentTheme.deployButtonDisabledText
                              : currentTheme.DeployText,
                          },
                        ]}
                      >
                        Deploy
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                  >
                    <View style={[styles.overlay]}>
                      <View
                        style={[
                          styles.modalContainer,
                          { backgroundColor: currentTheme.card },
                        ]}
                      >
                        <Text
                          style={[
                            styles.headerText,
                            { color: currentTheme.color, textAlign: "center" },
                          ]}
                        >
                          Deployment Configuration
                        </Text>
                        <Text
                          style={[
                            styles.descriptionText,
                            {
                              color: currentTheme.color,
                              textAlign: "center",
                              marginTop: hp("1%"),
                            },
                          ]}
                        >
                          Please configure the details below before deploying
                          the strategy:
                        </Text>
                        <View style={styles.pickerContainer}>
                          <Text
                            style={[
                              styles.labelText,
                              {
                                color: currentTheme.color,
                                backgroundColor: currentTheme.card,
                              },
                            ]}
                          >
                            Quantity:
                          </Text>
                          <TextInput
                            style={[
                              {
                                color:
                                  (currentTheme.theme as unknown as string) ===
                                  "light"
                                    ? "#000000"
                                    : "#FFFFFF",
                                backgroundColor: currentTheme.card,
                                height: hp("7%"),
                                borderRadius: 10,
                                paddingLeft: wp("4%"),
                                borderColor: "gray",
                                borderWidth: 2,
                              },
                            ]}
                            placeholderTextColor={
                              (currentTheme.theme as unknown as string) ===
                              "light"
                                ? "#000000"
                                : "#FFFFFF"
                            }
                            value={Quaninty}
                            keyboardType="numeric"
                            onChangeText={setQuantity}
                          />
                        </View>

                        <View style={styles.pickerContainer}>
                          <Text
                            style={[
                              styles.labelText,
                              { color: currentTheme.color },
                            ]}
                          >
                            Select Account:
                          </Text>
                          <View
                            style={{
                              borderColor: "gray",
                              borderWidth: 2,
                              height: hp("8%"),
                              borderRadius: 10,
                            }}
                          >
                            <>
                              {Array.isArray(Account) && Account.length > 0 ? (
                                <View>
                                  <Picker
                                    selectedValue={selectedItem}
                                    onValueChange={(itemValue) => {
                                      setSelectedItem(itemValue);
                                    }}
                                    style={{
                                      width: "100%",
                                      color: currentTheme.color,
                                    }}
                                  >
                                    <Picker.Item
                                      label="Select a broker..."
                                      color={
                                        currentTheme.theme === "dark"
                                          ? "#000000"
                                          : "#FFFFFF"
                                      }
                                      value=""
                                      style={{
                                        height: hp("6%"),
                                        borderColor: "gray",
                                        borderWidth: 1,
                                      }}
                                    />
                                    {Account.map((item, index) => (
                                      <Picker.Item
                                        key={index}
                                        color={
                                          currentTheme.theme === "dark"
                                            ? "#000000"
                                            : "#FFFFFF"
                                        }
                                        label={item.toString()} // Ensure label is always a string
                                        value={item.toString()} // Ensure value matches the type of selectedItem
                                      />
                                    ))}
                                  </Picker>
                                </View>
                              ) : (
                                <Text
                                  style={{
                                    textAlign: "center",
                                    textAlignVertical: "center",
                                    flex: 1,
                                    color: currentTheme.color,
                                  }}
                                >
                                  No broker
                                </Text>
                              )}
                            </>
                          </View>
                        </View>

                        <View style={styles.pickerContainer}>
                          <Text
                            style={[
                              styles.labelText,
                              {
                                color: currentTheme.color,
                              },
                            ]}
                          >
                            Select Index:
                          </Text>
                          <View
                            style={{
                              borderColor: "gray",
                              borderWidth: 2,
                              height: hp("8%"),
                              borderRadius: 10,
                              overflow: "hidden",
                              backgroundColor: currentTheme.card,
                            }}
                          >
                            <Picker
                              selectedValue={Index}
                              onValueChange={(itemValue) => setIndex(itemValue)}
                              style={{
                                color: currentTheme.color,
                                backgroundColor: currentTheme.card,
                                height: "100%",
                                paddingHorizontal: 10,
                                borderRadius: 10,
                              }}
                            >
                              {sourceArray.map((item, index) => (
                                <Picker.Item
                                  key={index}
                                  label={item.value}
                                  value={item.key}
                                  style={{
                                    height: hp("6%"),
                                    fontSize: 14,
                                    fontWeight: "500",
                                  }}
                                  color={
                                    currentTheme.theme === "dark"
                                      ? "#000000"
                                      : "#FFFFFF"
                                  }
                                />
                              ))}
                            </Picker>
                          </View>
                        </View>

                        <TouchableOpacity
                          style={[
                            styles.button2,
                            {
                              backgroundColor: currentTheme.maincolor,
                              paddingVertical: hp("1.5%"), // Vertical padding for responsiveness
                              paddingHorizontal: wp("5%"), // Horizontal padding
                              borderRadius: wp("2%"), // Smooth rounded corners
                              alignItems: "center", // Center text or loader horizontally
                              justifyContent: "center", // Center content vertically
                              shadowColor: "#000", // Subtle shadow for depth
                              shadowOffset: { width: 0, height: hp("0.2%") },
                              shadowOpacity: 0.2,
                              shadowRadius: wp("1%"),
                              elevation: 3, // Shadow effect for Android
                            },
                          ]}
                          onPress={() => handleDeploy(strategy._id)} // Pass the required ID
                          disabled={loading} // Disable button while loading
                        >
                          {loading ? (
                            <ActivityIndicator color={currentTheme.color} />
                          ) : (
                            <Text
                              style={[
                                styles.buttonText2,
                                {
                                  color: currentTheme.color,
                                  fontSize: wp("4%"), // Responsive font size
                                  fontWeight: "600", // Semi-bold for emphasis
                                  textTransform: "uppercase", // Makes text stand out
                                },
                              ]}
                            >
                              Submit
                            </Text>
                          )}
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.button2,
                            {
                              backgroundColor: "#FF0000", // Static background color
                              paddingVertical: hp("1.5%"), // Vertical padding for responsiveness
                              paddingHorizontal: wp("5%"), // Horizontal padding
                              borderRadius: wp("2%"), // Smooth rounded corners
                              alignItems: "center", // Center text horizontally
                              justifyContent: "center", // Center content vertically
                              shadowColor: "#000", // Subtle shadow for depth
                              shadowOffset: { width: 0, height: hp("0.2%") },
                              shadowOpacity: 0.2,
                              shadowRadius: wp("1%"),
                              elevation: 3, // Shadow effect for Android
                              marginTop: hp("1%"),
                            },
                          ]}
                          onPress={() => setModalVisible(false)}
                        >
                          <Text
                            style={[
                              styles.buttonText2,
                              {
                                color: "#FFFFFF", // Static text color
                                fontSize: wp("4%"), // Responsive font size
                                fontWeight: "600", // Semi-bold for emphasis
                                textTransform: "uppercase", // Makes text stand out
                              },
                            ]}
                          >
                            Close
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                </View>
              </View>
            ))}
          </SafeAreaView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container_main: {
    height: hp("100%"),
  },
  container: {
    flex: 1,
    paddingTop: hp("10%"),
    paddingBottom: hp("22%"),
  },
  container2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "baseline",
  },
  card: {
    borderRadius: wp("3%"),
    padding: wp("5%"),
    marginHorizontal: wp("6.5"),
    marginVertical: hp("1%"),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  img: {
    justifyContent: "center",
    alignItems: "center",
    height: hp("4.6%"),
    width: wp("9.6%"),
    borderRadius: wp("2%"),
    marginRight: wp("3%"),
    marginBottom: hp("1%"),
  },
  headerText: {
    flexDirection: "column",
    fontSize: hp("2.6%"),
  },
  title: {
    fontSize: wp("4%"),
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: wp("3%"),
    marginBottom: hp("1%"),
  },
  content: {
    marginTop: hp("2%"),
    marginBottom: hp("1%"),
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  description: {
    fontSize: wp("3%"),
    marginBottom: hp("0.5%"),
  },
  boldText: {
    fontWeight: "700",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: hp("0.5%"),
    marginBottom: hp("1%"),
    borderRadius: wp("2%"),
  },
  infoRow2: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: wp("2%"),
    padding: hp("0.5%"),
    marginBottom: hp("1.5%"),
  },
  infoText: {
    fontSize: wp("3%"),
    fontWeight: "500",
  },

  statsRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: hp("1%"),
    gap: 1,
  },

  statsCard: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: hp("0.5%"),
    borderRadius: wp("2%"),
    width: "auto",
  },

  button: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  button2: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText2: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3.5,
    elevation: 5,
  },
  descriptionText: {
    fontSize: 16,
    marginBottom: 20,
    color: "gray",
  },
  labelText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
  },
});

// Styling for RNPickerSelect
const pickerStyles = StyleSheet.create({
  inputIOS: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    fontSize: 16,
    color: "black",
    backgroundColor: "#f9f9f9",
  },
  inputAndroid: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    fontSize: 16,
    color: "black",
    backgroundColor: "#f9f9f9",
  },
});

export default MyStrategies;
