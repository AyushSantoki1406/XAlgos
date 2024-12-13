import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
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
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Dashboard = () => {
  const { currentTheme } = useContext(ThemeContext);
  const [isConnected, setIsConnected] = useState(true);
  const [Email, setEmail] = useState("");
  const [broker, setBroker] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [capital, setCapital] = useState("");
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);

  const url =
    process.env.NODE_ENV === "production" ? ProductionUrl : ProductionUrl;

  useEffect(() => {
    // Calculate total balance
    let sum = 0;

    broker.forEach((item, index) => {
      if (item.userData) {
        sum += Number(capital[index]) || 0;
      } else {
        sum += Number(item.balances?.result[0]?.balance_inr) || 0;
      }
    });

    setTotalBalance(sum);
  }, [broker, capital]);

  const fetchdata = async () => {
    setLoading(true);
    try {
      console.log("asdddddd");
      const Email = await AsyncStorage.getItem("Email");
      setEmail(Email);
      console.log("........", Email);

      const response = await axios.post(`${url}/userinfo`, { Email });
      setBroker(response.data);
      console.log(">>>>>>>>", response.data);

      const dbschema = await axios.post(`${url}/dbSchema`, { Email });
      console.log("...", dbschema);

      const response2 = await axios.post(`${url}/addbroker`, {
        First: false,
        Email,
        userSchema: "",
      });
      console.log("responce data", response2.data);
      console.log("sum", totalBalance);
      const a = response2.data;
      const newCapital = a.map((user) => user.userData.data.availablecash);
      setCapital(newCapital);
      console.log("--------", newCapital);
      console.log(capital);
    } catch (e) {
      console.log("///", e);
    } finally {
      setLoading(true);
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchdata();
    setRefreshing(false);
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

  // if (loading) {
  //   return (
  //     <SafeAreaView
  //       style={[
  //         styles.container,
  //         { backgroundColor: currentTheme.subscribeText },
  //       ]}
  //     >
  //       {" "}
  //       <ActivityIndicator
  //         size="large"
  //         color={currentTheme.color}
  //         style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
  //       />
  //     </SafeAreaView>
  //   );
  // }

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: currentTheme.background },
      ]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <StatusBar
        backgroundColor={currentTheme.theme == "light" ? "#FFFFFF" : "#000000"}
        barStyle={
          currentTheme.theme == "light" ? "dark-content" : "light-content"
        }
      />
      <SafeAreaView
        style={[styles.container, { backgroundColor: currentTheme.background }]}
      >
        <View>
          <View
            style={[styles.headerRow, { backgroundColor: currentTheme.card }]}
          >
            <View style={styles.headerContent}>
              <View style={styles.headerItem}>
                {loading ? (
                  <>
                    {/* Skeleton Loader for P&L */}
                    <Skeleton
                      customHighlightBackground={
                        currentTheme.theme === "light"
                          ? "linear-gradient(90deg, rgba(150, 150, 150, 0.1) 20%, rgba(200, 200, 200, 0.3) 50%, rgba(150, 150, 150, 0.1) 80%)"
                          : "linear-gradient(90deg, rgba(20, 20, 20, 0.1) 40%, rgba(0, 0, 0, 0.1) 60%)"
                      }
                      baseColor={currentTheme.secondbackground}
                      style={{
                        borderRadius: 5,
                        height: hp(4),
                        width: wp(40),
                        alignSelf: "center",
                        // boxShadow:
                        //   currentTheme.theme === "light"
                        //     ? "0px 4px 8px rgba(0, 0, 0, 0.1)"
                        //     : "0px 4px 8px rgba(0, 0, 0, 0.3)",
                        // borderWidth: 1,
                      }}
                    />
                  </>
                ) : (
                  <>
                    {/* Actual P&L */}
                    <Text style={[styles.label, { color: currentTheme.color }]}>
                      P&L
                    </Text>
                    {/* Actual value */}
                    <Text style={[styles.value, { color: currentTheme.color }]}>
                      ₹
                    </Text>
                  </>
                )}
              </View>
              <View style={styles.headerItem}>
                <Text style={[styles.label, { color: currentTheme.color }]}>
                  Capital
                </Text>
                <Text style={styles.green}>₹{totalBalance}</Text>
              </View>
            </View>
          </View>

          <ScrollView style={[styles.container]}>
            {broker.map((item, index) => {
              const uniqueKey =
                item.id ||
                item.userData?.data?.clientcode ||
                `fallback-${index}`;
              return <CryptoCard key={uniqueKey} item={item} />;
            })}
          </ScrollView>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const CryptoCard = ({ item }) => {
  const { currentTheme } = useContext(ThemeContext);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

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
      </View>

      <View style={styles.statItem}>
        <Text style={[styles.value, { color: currentTheme.color }]}>
          <Text style={[styles.label, { color: currentTheme.color }]}>
            Broker
          </Text>
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
        <Text style={[styles.value, { color: currentTheme.color }]}>
          <Text style={[styles.label, { color: currentTheme.color }]}>
            User Id
          </Text>
          <Text style={styles.green}>
            {item.userData
              ? item.userData.data.clientcode
              : item.userDetails?.result?.phishing_code || "N/A"}
          </Text>
        </Text>
        <Text style={[styles.value, { color: currentTheme.color }]}>
          <Text style={[styles.label, { color: currentTheme.color }]}>
            Strategy No:
          </Text>
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
    paddingBottom: hp("5%"),
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingVertical: wp("4%"),
    marginHorizontal: wp("2%"),
    marginVertical: hp("2%"),
    borderRadius: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: wp(100),
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
    marginHorizontal: wp("1%"),
    fontSize: wp("4%"),
    fontWeight: "bold",
  },
  green: {
    color: "#28a745",
    paddingLeft: wp("2%"),
  },
  red: {
    color: "#dc3545",
  },
  accountInfo: {
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("4%"),
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  icon: {
    fontSize: 16,
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: hp("1%"),
  },
});

export default Dashboard;
