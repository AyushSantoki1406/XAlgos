import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { ThemeContext } from "../../../utils/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import NoInternet from "../../_root/NoInternet";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import axios from "axios";
import { ProductionUrl } from "../../../URL/URL";

const data = [
  { id: "1", quantity: "100", profit: "+$ 50.00", ltp: "$ 90000.00" },
  { id: "2", quantity: "100", profit: "+$ 50.00", ltp: "$ 90000.00" },
  { id: "3", quantity: "100", profit: "+$ 50.00", ltp: "$ 90000.00" },
];

const Dashboard = () => {
  const { currentTheme } = useContext(ThemeContext);
  const [isConnected, setIsConnected] = useState(true);
  const [Email, setEmail] = useState("");
  const [broker, setBroker] = useState([]);

  const url =
    process.env.NODE_ENV === "production" ? ProductionUrl : ProductionUrl;

  const fetchdata = async () => {
    try {
      console.log("asdddddd");
      const Email = await AsyncStorage.getItem("Email");
      setEmail(Email);
      console.log("........", Email);

      const response = await axios.post(`${url}/userinfo`, { Email });
      setBroker(response.data);
      console.log(response.data);

      const dbschema = await axios.post(`${url}/dbSchema`, { Email });
      console.log("...", dbschema);
    } catch (e) {
      console.log("///", e);
    }
  };
  useEffect(() => {
    fetchdata();
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("Email").then((value) => setEmail(value));

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe(); // Cleanup
    };
  }, []);

  if (Email === null) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: currentTheme.background }]}
      >
        <Text style={{ color: currentTheme.color }}>Loading...</Text>
      </SafeAreaView>
    );
  }

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
    <ScrollView style={[styles.container, styles.light]}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: currentTheme.background }]}
      >
        <View>
          <View
            style={[styles.headerRow, { backgroundColor: currentTheme.card }]}
          >
            <View style={styles.headerContent}>
              <View style={styles.headerItem}>
                <Text style={[styles.label, { color: currentTheme.color }]}>
                  P&L
                </Text>
                <Text style={[styles.value, { color: currentTheme.color }]}>
                  ₹
                </Text>
              </View>
              <View style={styles.headerItem}>
                <Text style={[styles.label, { color: currentTheme.color }]}>
                  Capital
                </Text>
                <Text style={styles.green}>₹2012.02</Text>
              </View>
            </View>
          </View>
          <ScrollView style={[styles.container, styles.light]}>
            {broker.map((item) => (
              <CryptoCard key={item.id} item={item} />
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const CryptoCard = ({ item }) => {
  const { currentTheme } = useContext(ThemeContext);

  return (
    <View style={[styles.statsCard, { backgroundColor: currentTheme.card }]}>
      <View style={styles.statItem}>
        <Text style={[styles.label, { color: currentTheme.color }]}>Name</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Text style={[styles.value2, { color: currentTheme.color }]}>
            <Text style={styles.value2} numberOfLines={1}>
              {item.userData
                ? item.userData.data.name.toUpperCase()
                : item.userDetails?.result?.first_name?.toUpperCase() +
                    " " +
                    item.userDetails?.result?.last_name.toUpperCase() || "N/A"}
            </Text>
          </Text>
        </ScrollView>
        <Text style={[styles.label, { color: currentTheme.color }]}>
          Broker
        </Text>
        <Text style={[styles.value, { color: currentTheme.color }]}>
          <Text style={styles.green}>
            {item.userData
              ? "AngelOne"
              : item.deltaApiKey
              ? "Delta"
              : "Unknown"}
          </Text>
        </Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.label, { color: currentTheme.color }]}>
          User Id
        </Text>
        <Text style={[styles.value, { color: currentTheme.color }]}>
          <Text style={styles.green}>
            {item.userData
              ? item.userData.data.clientcode
              : item.userDetails?.result?.phishing_code || "N/A"}
          </Text>
        </Text>
        <Text style={[styles.label, { color: currentTheme.color }]}>
          Strategy No:
        </Text>
        <Text style={[styles.value, { color: currentTheme.color }]}>
          <Text style={styles.green}>1</Text>
        </Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.label, { color: currentTheme.color }]}>
          Trade Ratio
        </Text>
        <Text style={[styles.value, { color: currentTheme.color }]}>
          <Text style={styles.green}>0%</Text> /{" "}
          <Text style={styles.red}>0%</Text>
        </Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.label, { color: currentTheme.color }]}>
          Number of trades
        </Text>
        <Text style={[styles.value, { color: currentTheme.color }]}>0</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.label, { color: currentTheme.color }]}>
          Profit gained
        </Text>
        <Text style={styles.green}>0%</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.label, { color: currentTheme.color }]}>
          Percentage gain
        </Text>
        <Text style={styles.red}>0%</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.label, { color: currentTheme.color }]}>
          Working time
        </Text>
        <Text style={[styles.value, { color: currentTheme.color }]}>
          5h 23m
        </Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.label, { color: currentTheme.color }]}>
          Status
        </Text>
        <Text style={styles.green}>Active</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.label, { color: currentTheme.color }]}>
          Total Balance
        </Text>
        <Text style={styles.green}>₹2012.02</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.label, { color: currentTheme.color }]}>
          Orders
        </Text>
        <Text style={[styles.value, { color: currentTheme.color }]}>0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: hp("5%"),
  },
  light: {},
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: wp("4%"),
    marginHorizontal: wp("2%"),
    marginVertical: hp("2%"),
    borderRadius: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  headerItem: {
    alignItems: "center",
    flex: 1,
  },
  sectionHeader: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    paddingVertical: hp("1%"),
    textAlign: "center",
    color: "#495057",
  },
  statsCard: {
    borderRadius: wp("2%"),
    margin: wp("4%"),
    padding: wp("4%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  statItem: {
    marginBottom: hp("2%"),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: wp("4%"),
    color: "#6c757d",
  },
  value: {
    fontSize: wp("4%"),
    fontWeight: "bold",
  },
  value2: {
    marginHorizontal: wp("5%"),
    fontSize: wp("4%"),
    fontWeight: "bold",
  },
  green: {
    color: "#28a745",
  },
  red: {
    color: "#dc3545",
  },
  accountInfo: {
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("4%"),
  },
});

export default Dashboard;
