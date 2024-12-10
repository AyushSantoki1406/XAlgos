import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Modal,
  StatusBar,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import image from "../../../../assets/images/strategie_img.png";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ThemeContext } from "../../../../utils/ThemeContext";
import { ProductionUrl } from "../../../../URL/URL";
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import NoInternet from "../../../_root/NoInternet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";

interface Strategy {
  _id: string;
  title: string;
  strategyType: string;
  capitalRequirement: string;
  description: string;
  createdBy: string;
  dateOfCreation: string;
  subscribeCount: number;
  deployedCount: number;
  schedule: string;
  days: string;
  time: string;
}

const formatDate = (date: string) => {
  const formattedDate = new Date("2023-03-15").toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return formattedDate;
};

export default function MarketPlace() {
  const [email, setemail] = useState("");
  const { currentTheme } = useContext(ThemeContext);
  const [strategyData, setStrategyData] = useState<Strategy[]>([]);
  const [subscribedStrategies, setSubscribedStrategies] = useState<string[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [Account, setAccount] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [Quaninty, setQuaninty] = useState("");
  const [Index, setIndex] = useState("");

  const url = process.env.NODE_ENV === "test" ? ProductionUrl : ProductionUrl;

  const fetchData = async () => {
    try {
      const email = await AsyncStorage.getItem("Email");
      setemail(email);
      const response = await axios.post(`${url}/getMarketPlaceData`, {
        email,
      });
      setStrategyData(response.data.allData);
      setSubscribedStrategies(response.data.SubscribedStrategies);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (strategyId: string) => {
    try {
      const response = await axios.post(`${url}/updateSubscribe`, {
        strategyId,
        email,
      });

      setStrategyData((prevData) =>
        prevData.map((strategy) =>
          strategy._id === strategyId
            ? { ...strategy, subscribeCount: response.data.newSubscribeCount }
            : strategy
        )
      );
      setSubscribedStrategies(response.data.SubscribedStrategies);
      Toast.show({
        type: "error",
        text1: "Invalid Password!",
        position: "top",
        visibilityTime: 3000,
      });
    } catch (error) {
      console.error("Error updating subscribe count:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeployed = (selectedStrategyId) => {
    setModalVisible(true);
  };

  const handleDeploy = async (strategyId) => {
    setLoading(true);
    try {
      console.log(strategyId);
      const response = await axios.post(`${url}/addDeployed`, {
        Email: email,
        selectedStrategyId: strategyId,
        Index: "index 1",
        Quaninty: 300,
        Account: selectedItem,
      });
      console.log(response.data);
      setLoading(false);
      setModalVisible(false);
    } catch (e) {
      console.log(e);
      setModalVisible(false);
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
        console.log(response.data);

        if (Array.isArray(response.data.AngelBrokerData)) {
          const angelIds = response.data.AngelBrokerData.map(
            (item) => item.AngelId
          );

          console.log(angelIds);
          setAccount(angelIds);
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

  if (!isConnected) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: currentTheme.background }]}
      >
        <NoInternet />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: currentTheme.background }]}
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
        {loading ? (
          <ActivityIndicator
            size="large"
            color={currentTheme.color}
            style={{ marginTop: hp("90%") }}
          />
        ) : (
          strategyData.map((strategy) => (
            <View
              style={[styles.card, { backgroundColor: currentTheme.card }]}
              key={strategy._id}
            >
              <View style={styles.header}>
                <Image source={image} style={styles.img} />
                <View style={styles.headerText}>
                  <Text style={[styles.title, { color: currentTheme.color }]}>
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
                    { borderColor: "gray", borderWidth: 1, borderRadius: 5 },
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
                      style={[styles.infoText, { color: currentTheme.color }]}
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
                      style={[styles.infoText, { color: currentTheme.color }]}
                    >
                      🚀 Deployed: {strategy.deployedCount}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.infoRow2,
                    { borderColor: "gray", borderWidth: 1, borderRadius: 5 },
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
                  onPress={() => handleSubscribe(strategy._id)}
                  disabled={subscribedStrategies.includes(strategy._id)}
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
                    {subscribedStrategies.includes(strategy._id)
                      ? "Subscribed"
                      : "Subscribe"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor: subscribedStrategies.includes(
                        strategy._id
                      )
                        ? currentTheme.DeployButton // Active button color
                        : currentTheme.deployButtonDisabledBackground, // Disabled button color
                      borderColor: currentTheme.color,
                    },
                  ]}
                  disabled={!subscribedStrategies.includes(strategy._id)}
                  onPress={() => handleDeployed(strategy._id)}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color: subscribedStrategies.includes(strategy._id)
                          ? currentTheme.DeployText // Active button text color
                          : currentTheme.deployButtonDisabledText, // Disabled text color
                      },
                    ]}
                  >
                    Deploy
                  </Text>

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
                                elevation: 3,
                                marginTop: hp("2%"),
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
                    </View>
                  </Modal>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: wp('5%'),
    paddingTop: hp("10%"),
    paddingBottom: hp("10%"),
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
  },
  title: {
    fontSize: wp("4%"),
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: wp("3%"),
    marginBottom: hp("1%"),
  },
  pickerContainer: {
    marginBottom: 20,
  },
  labelText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
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
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: hp("0.5%"),
    marginBottom: hp("1%"),
    borderRadius: wp("2%"),
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
  descriptionText: {
    fontSize: 16,
    marginBottom: 20,
    color: "gray",
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
    fontWeight: "bold",
    textAlign: "center",
  },
});
