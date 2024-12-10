import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  StatusBar,
} from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProductionUrl } from "../../../URL/URL";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ThemeContext } from "../../../utils/ThemeContext";
import { ColorSpace } from "react-native-reanimated";
import NoDataScreen from "../../_root/NoData";

const PaperTradeTable = () => {
  const { currentTheme } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(true);
  const [allSheetData, setAllSheetData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [email, setEmail] = useState("");
  const [userSchema, setUserSchema] = useState("");
  const [ids, setId] = useState("");
  const [DeployedData, setDeployedData] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const url =
    process.env.NODE_ENV === "production" ? ProductionUrl : ProductionUrl;

  const fetchData = async () => {
    try {
      const email = await AsyncStorage.getItem("Email");
      setEmail(email);

      const response = await axios.post(`${url}/dbschema`, {
        Email: email,
      });
      setUserSchema(response.data);
      console.log(response.data);
      setId(response.data.DeployedStrategies);

      const response2 = await axios.post(`${url}/getMarketPlaceData`, {
        email,
      });
      const jsonData = response2.data.allData;
      const filteredData = jsonData.filter((item) => ids.includes(item._id));

      const response3 = await axios.post(`${url}/fetchSheetData`, { email });

      setAllSheetData(response3.data.allSheetData);

      const mergedData = filteredData.map((strategy) => {
        const deployedInfo = Array.isArray(DeployedData)
          ? DeployedData.find(
              (data) => data.Strategy.toString() === strategy._id.toString()
            )
          : ",,,,,,,,";

        return {
          ...strategy,
          AppliedDate: deployedInfo ? deployedInfo.AppliedDate : "N/A",
          Index: deployedInfo ? deployedInfo.Index : "N/A",
        };
      });

      setFilteredData(mergedData);
      console.log(mergedData);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // console.log(ids);

  const removeDeploy = async (strategyId) => {
    try {
      const email = await AsyncStorage.getItem("Email");
      setEmail(email);
      const response = await axios.post(`${url}/removeDeployStra`, {
        email,
        strategyId,
      });

      if (response.status === 200) {
        setAllSheetData((prevData) =>
          prevData.filter((strategy) => strategy.strategyId !== strategyId)
        );

        setFilteredData((prevData) =>
          prevData.filter((strategy) => strategy._id !== strategyId)
        );

        Alert.alert("Success", "Strategy deleted successfully!");
      } else {
        Alert.alert("Error", "Failed to delete strategy");
      }
    } catch (error) {
      Alert.alert("Error", "Error deleting strategy");
    }
  };

  const renderStrategy = ({ item }) => {
    const pnlValues = item.sheetData.map((row) => parseFloat(row[8]) || 0);
    const totalPnl = pnlValues.reduce((sum, value) => sum + value, 0);

    return (
      <View
        style={[styles.container, { backgroundColor: currentTheme.card }]}
        key={item.strategyId}
      >
        <StatusBar
          backgroundColor={
            currentTheme.theme == "light" ? "#FFFFFF" : "#000000"
          }
          barStyle={
            currentTheme.theme == "light" ? "dark-content" : "light-content"
          }
        />
        <View style={styles.row}>
          <View style={styles.accountInfo}>
            <Text style={[styles.label, { color: currentTheme.color }]}>
              Name: <Text style={styles.value}>{item.strategyName}</Text>
            </Text>
            <Text style={[styles.label, { color: currentTheme.color }]}>
              Deploy Date:{" "}
              <Text style={styles.value}>{item.DeploedDate || "N/A"}</Text>
            </Text>
          </View>
          <View style={styles.pnlContainer}>
            <Text style={[styles.label, { color: currentTheme.color }]}>
              P&L:{" "}
              <Text style={totalPnl < 0 ? styles.red : styles.green}>
                {totalPnl.toFixed(2)}$
              </Text>
            </Text>
            <TouchableOpacity onPress={() => removeDeploy(item.strategyId)}>
              <Ionicons name="trash-outline" size={25} color="red" />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView horizontal style={styles.tableContainer}>
          <View>
            <View
              style={[
                styles.tableHeader,
                { backgroundColor: currentTheme.background },
              ]}
            >
              {[
                "NO",
                "Symbol",
                "Entry Type",
                "Entry Time",
                "Exit Time",
                "Entry Price",
                "Exit Price",
                "Entry Qty",
                "P&L",
              ].map((header, index) => (
                <Text
                  key={index}
                  style={[
                    styles.tableHeaderText,
                    {
                      color: currentTheme.color,
                      backgroundColor: currentTheme.table,
                    },
                  ]}
                >
                  {header}
                </Text>
              ))}
            </View>
            {item.sheetData.length > 0 ? (
              item.sheetData.map((row, rowIndex) => (
                <View key={rowIndex} style={[styles.tableRow]}>
                  {row.map((cell, cellIndex) => (
                    <Text
                      key={cellIndex}
                      style={[styles.tableCell, { color: currentTheme.color }]}
                    >
                      {cell || "N/A"}
                    </Text>
                  ))}
                </View>
              ))
            ) : (
              <Text style={[styles.noDataText, { color: currentTheme.color }]}>
                No trade executed
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <ScrollView
      style={{ backgroundColor: currentTheme.background }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {isLoading ? (
        <ActivityIndicator size="large" color={currentTheme.color} />
      ) : allSheetData.length > 0 ? (
        <FlatList
          data={allSheetData}
          renderItem={renderStrategy}
          keyExtractor={(item) => item.strategyId.toString()}
        />
      ) : (
        <NoDataScreen />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    borderWidth: 1,
    padding: hp("1%"),
    margin: hp("1%"),
    borderRadius: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accountInfo: {
    flex: 1,
  },
  pnlContainer: {
    alignItems: "flex-end",
  },
  label: {
    fontWeight: "bold",
  },
  value: {
    fontWeight: "normal",
  },
  green: {
    color: "green",
  },
  red: {
    color: "red",
  },
  deleteIcon: {
    width: wp("2%"),
    height: hp("2%"),
  },
  tableContainer: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0", // Light header background
    borderBottomWidth: 1,
    borderBottomColor: "#ccc", // Header border
  },
  tableHeaderText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: hp(1.4),
    width: wp(28),
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tableCell: {
    textAlign: "center",
    fontSize: hp(1.2),
    width: wp(28),
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  noDataText: {
    textAlign: "center",
    fontSize: hp(2),
    color: "#888",
    paddingVertical: hp(1),
  },
});

export default PaperTradeTable;
