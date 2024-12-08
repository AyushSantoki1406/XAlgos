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

const PaperTradeTable = () => {
  const { currentTheme } = useContext(ThemeContext);
  const [allSheetData, setAllSheetData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [email, setEmail] = useState("");
  const [userSchema, setUserSchema] = useState("");
  const [ids, setId] = useState("");
  const [DeployedData, setDeployedData] = useState("");

  const url =
    process.env.NODE_ENV === "production" ? ProductionUrl : ProductionUrl;

  useEffect(() => {
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
      }
    };
    fetchData();
  }, []);

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
    <ScrollView style={{ backgroundColor: currentTheme.background }}>
      {allSheetData.length > 0 ? (
        <FlatList
          data={allSheetData}
          renderItem={renderStrategy}
          keyExtractor={(item) => item.strategyId.toString()}
        />
      ) : (
        <ActivityIndicator
          size="large"
          color={currentTheme.color}
          // style={{ marginTop: hp("30%") }}
        />
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
  tableContainer: {},
  tableHeader: {
    flexDirection: "row",
    // padding: hp('1%'),
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    padding: wp("0.5%"),
    width: wp("20%"),
    borderWidth: 1,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    textAlign: "center",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    borderWidth: 1,
  },
  noDataText: {
    textAlign: "center",
    borderColor: "#ccc",
    borderWidth: 1,
  },
});

export default PaperTradeTable;
