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
      console.log(response);
      setModalVisible(false);

      // Clear the state values
      setIndex([]);
      setQuantity("");
      setSelectedItem(null);
    } catch (e) {
      console.log(e);
      setModalVisible(false);
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

        if (Array.isArray(response.data.BrokerData)) {
          const angelIds = response.data.BrokerData.map((item) => item.AngelId);
          console.log("Fetched Angel IDs:", angelIds);
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
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <ActivityIndicator
            size="large"
            color={currentTheme.color}
            style={{ marginTop: "90%" }}
          />
        ) : userSubscribedStrategies.length === 0 ? (
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
                          { backgroundColor: currentTheme.background },
                        ]}
                      >
                        <Text
                          style={[
                            styles.headerText,
                            { color: currentTheme.color },
                          ]}
                        >
                          Deployment Configuration
                        </Text>
                        <Text
                          style={[
                            styles.descriptionText,
                            { color: currentTheme.color },
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
                                backgroundColor: currentTheme.background,
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
                          <View style={{ borderColor: "gray", borderWidth: 2 }}>
                            <>
                              {Array.isArray(Account) && Account.length > 0 ? (
                                <View>
                                  <Picker
                                    selectedValue={selectedItem} // Ensure this matches the value type of Picker.Item
                                    onValueChange={(itemValue) => {
                                      setSelectedItem(itemValue);
                                    }}
                                    style={{
                                      height: 50,
                                      width: "100%",
                                    }}
                                  >
                                    <Picker.Item
                                      label="Select a broker..."
                                      value="" // Default value as an empty string
                                      style={{
                                        borderColor: "gray",
                                        borderWidth: 1,
                                      }}
                                    />
                                    {Account.map((item, index) => (
                                      <Picker.Item
                                        key={index}
                                        label={item.toString()} // Ensure label is always a string
                                        value={item.toString()} // Ensure value matches the type of selectedItem
                                      />
                                    ))}
                                  </Picker>
                                </View>
                              ) : (
                                <Text>No data available</Text>
                              )}
                            </>
                          </View>
                        </View>

                        <View style={styles.pickerContainer}>
                          <Text
                            style={[
                              styles.labelText,
                              { color: currentTheme.color },
                            ]}
                          >
                            Select Index:
                          </Text>
                          <View style={{ borderColor: "gray", borderWidth: 2 }}>
                            <Picker
                              selectedValue={Index}
                              onValueChange={(itemValue) => setIndex(itemValue)}
                              style={[
                                {
                                  color:
                                    currentTheme.deployButtonDisabledBackground,
                                  backgroundColor: currentTheme.background,
                                  borderColor: "gray",
                                  borderWidth: 2,
                                },
                              ]}
                            >
                              {sourceArray.map((item, Index) => (
                                <Picker.Item
                                  key={Index}
                                  label={item.value}
                                  value={item.key}
                                  color={
                                    (currentTheme.theme as unknown as string)
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
                            styles.button,
                            {
                              backgroundColor:
                                currentTheme.deployButtonDisabledBackground,
                            },
                          ]}
                          onPress={() => handleDeploy(strategy._id)}
                        >
                          <Text
                            style={[
                              styles.buttonText,
                              { color: currentTheme.color },
                            ]}
                          >
                            Submit
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.button,
                            { backgroundColor: "#FF0000" },
                          ]}
                          onPress={() => setModalVisible(false)}
                        >
                          <Text
                            style={[styles.buttonText, { color: "#FFFFFF" }]}
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
