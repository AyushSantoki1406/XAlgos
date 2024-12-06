import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import addimage from "../../assets/images/light_add.png";
import ToggleSwitch from "toggle-switch-react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "expo-router";
import { ThemeContext } from "../../utils/ThemeContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import NoInternet from "../_root/NoInternet";
import NoData from "../_root/NoData";
import { ProductionUrl } from "../../URL/URL";

export default function Broker() {
  const [toggle, setToggle] = React.useState(true);
  const [brokers, setBrokers] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // State for refreshing
  const navigation = useNavigation();
  const { currentTheme } = useContext(ThemeContext);
  const [isConnected, setIsConnected] = useState(true);
  const [email, setEmail] = useState("");

  const url = process.env.NODE_ENV === "test" ? ProductionUrl : ProductionUrl;

  const fetchData = async () => {
    try {
      const Email = await AsyncStorage.getItem("Email");
      setEmail(Email);
      const response = await axios.post(`${url}/userinfo`, { Email });
      setBrokers(response.data);
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData(); // Refresh the data
    setRefreshing(false);
  };

  useEffect(() => {
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

  const handleDelete = async (clientcode) => {
    console.log(clientcode);
    try {
      const response = await axios.post(`${url}/removeClient`, {
        Email: email,
        index: clientcode,
      });
      console.log("Broker deleted:", response.data);
      setBrokers(
        brokers.filter(
          (broker) => broker.userData.data.clientcode !== clientcode
        )
      );
    } catch (error) {
      console.log("Error deleting broker:", error);
    }
  };

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
      style={[
        styles.container,
        { backgroundColor: currentTheme.subscribeText },
      ]}
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {brokers.length === 0 ? (
          <NoData />
        ) : (
          brokers.map((broker, index) => (
            <View
              key={index}
              style={[styles.card, { backgroundColor: currentTheme.card }]}
            >
              {/* Broker Header Row */}
              <View style={styles.row}>
                <View style={styles.infoSection}>
                  <Text style={[styles.label2, { color: currentTheme.color }]}>
                    {broker.userData
                          ? "AngelOne"
                          : broker.deltaApiKey
                          ? "Delta"
                          : "Unknown"}
                  </Text>
                </View>
                <View style={styles.buttonContainer}>
                  <View
                    style={{
                      width: wp("10%"),
                      height: hp("4%"),
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ToggleSwitch
                      isOn={toggle}
                      onColor="gray"
                      offColor="gray"
                      size="medium"
                      onToggle={(isOn) => setToggle(isOn)}
                    />
                  </View>
                </View>
              </View>

              {/* Broker Details */}
              <View style={styles.row}>
                <Text style={[styles.label, { color: currentTheme.color }]}>
                  Name
                </Text>
                <Text
                  style={[
                    styles.value,
                    { color: currentTheme.color, paddingLeft: wp("40%") },
                  ]}
                  numberOfLines={1}
                >
                  {broker.userData
                          ? broker.userData.data.name.toUpperCase()
                          : broker.userDetails?.result?.first_name?.toUpperCase() +
                              " " +
                              broker.userDetails?.result?.last_name.toUpperCase() ||
                            "N/A"}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={[styles.label, { color: currentTheme.color }]}>
                  Client Id
                </Text>
                <Text style={[styles.value, { color: currentTheme.color }]}>
                  {broker.userData
                          ? broker.userData.data.clientcode
                          : broker.deltaApiKey && "No Client Code"}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={[styles.label, { color: currentTheme.color }]}>
                  Date
                </Text>
                <Text style={[styles.value, { color: currentTheme.color }]}>
                  {broker?.date || "N/A"}
                </Text>
              </View>

              {/* Delete Button */}
              <TouchableOpacity
                style={[
                  styles.deleteButton,
                  { backgroundColor: "#FF0000", borderRadius: 10 },
                ]}
                onPress={() => handleDelete(broker?.userData?.data?.clientcode)}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginVertical: hp("1%"),
                  }}
                >
                  <Ionicons
                    name="trash-outline"
                    size={25}
                    color={currentTheme.color}
                  />
                </View>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Place the add button here to ensure it's on top */}
      <TouchableOpacity
        onPress={() => navigation.navigate("AddBroker" as never)}
        style={styles.addBtnContainer}
      >
        <Image source={currentTheme.addLogo} style={styles.addBtn} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: hp("100%"),
    width: wp("100%"),
  },
  card: {
    marginHorizontal: wp("5%"),
    marginTop: hp("2%"),
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("2%"),
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 4,
    shadowRadius: 5,
    zIndex: 1,
    marginBottom: hp("2%"),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: hp("1%"),
  },
  infoSection: {
    justifyContent: "center",
  },
  buttonContainer: {
    marginLeft: "auto",
    marginRight: wp("3%"),
  },
  label: {
    fontSize: wp("4%"),
    fontWeight: "bold",
  },
  label2: {
    fontSize: wp("5%"),
    fontWeight: "bold",
  },
  value: {
    fontSize: wp("3.5%"),
    fontWeight: "500",
    marginTop: hp("0.5%"),
    textAlign: "center",
  },
  deleteButton: {
    marginTop: hp("1%"),
  },
  addBtnContainer: {
    position: "absolute",
    bottom: hp("2%"),
    right: wp("5%"),
    zIndex: 10,
  },
  addBtn: {
    height: hp("6%"),
    width: wp("14%"),
    resizeMode: "contain",
  },
});