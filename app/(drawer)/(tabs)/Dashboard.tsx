import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ThemeContext } from "../../../utils/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import NoInternet from "../../_root/NoInternet";

const data = [
  { id: "1", quantity: "100", profit: "+$ 50.00", ltp: "$ 90000.00" },
  { id: "2", quantity: "100", profit: "+$ 50.00", ltp: "$ 90000.00" },
  { id: "3", quantity: "100", profit: "+$ 50.00", ltp: "$ 90000.00" },
];

const CryptoCard = ({ item }) => {
  const { currentTheme } = useContext(ThemeContext);

  return (
    <View
      style={[styles.card, { backgroundColor: currentTheme.secondbackground }]}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.cryptoTitle, { color: currentTheme.color }]}>
          BTCUSD{" "}
          <Text style={[styles.label, { color: currentTheme.color }]}>
            (100 Qtn)
          </Text>
        </Text>
        <Text style={[styles.profit, styles.positive]}>{item.profit}</Text>
      </View>

      {/* Quantity Row */}
      <View style={styles.row}>
        <Text style={[styles.label, { color: currentTheme.color }]}>
          Entry Price: 6969
        </Text>
        <Text style={styles.value}></Text>
      </View>

      {/* Entry & Exit Price Row */}
      <View style={styles.row}>
        <Text style={[styles.label, { color: currentTheme.color }]}>
          Exit Price: 7676
        </Text>
        <Text style={styles.value}></Text>
        <Text style={[styles.ltp, { color: currentTheme.color }]}>
          LTP {item.ltp}
        </Text>
      </View>

      {/* LTP */}
      <View style={styles.row}></View>
    </View>
  );
};

const Dashboard = () => {
  const { currentTheme } = useContext(ThemeContext);
  const [isConnected, setIsConnected] = useState(true);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("Email").then((value) => setEmail(value));

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe(); // Cleanup
    };
  }, []);

  if (email === null) {
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
    <SafeAreaView
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <View>
        {data.map((item) => (
          <CryptoCard key={item.id} item={item} />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cryptoTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profit: {
    fontSize: 18,
    fontWeight: "bold",
  },
  positive: {
    color: "green",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  value: {
    fontSize: 16,
  },
  ltp: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
  },
  noConnectionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noConnectionText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  noConnectionMessage: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
});

export default Dashboard;
