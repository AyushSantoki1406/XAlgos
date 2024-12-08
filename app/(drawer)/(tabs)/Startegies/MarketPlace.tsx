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
  const { currentTheme } = useContext(ThemeContext);
  const [email, setEmail] = useState("");
  const [strategyData, setStrategyData] = useState<Strategy[]>([]);
  const [subscribedStrategies, setSubscribedStrategies] = useState<string[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const url = process.env.NODE_ENV === "test" ? ProductionUrl : ProductionUrl;

  const fetchData = async () => {
    try {
      const email = await AsyncStorage.getItem("Email");
      setEmail(email);
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
    fontWeight: "bold",
    textAlign: "center",
  },
});
