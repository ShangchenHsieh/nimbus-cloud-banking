import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserDashboard = () => {
  interface Transaction {
    id: number;
    transaction_date: string;
    amount: number;
    transaction_type: string;
  }

  const [accountBalance, setAccountBalance] = useState(0);
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedAccountType, setSelectedAccountType] = useState("checking");
  const [accountTypes, setAccountTypes] = useState<string[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
  });

  const handleAccountTypeChange = async (type: string) => {
    setSelectedAccountType(type);
    await fetchAccountInfo(type);
    await fetchUserData();
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("access_token");
    // Handle navigation to login screen if necessary
  };

  const fetchAccountTypes = async () => {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      Alert.alert("Error", "No access token found");
      return;
    }

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/account/account-types/",
        requestOptions
      );
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      const data = await response.json();
      setAccountTypes(data);
    } catch (error) {
      Alert.alert("Error fetching account types");
    }
  };

  const fetchAccountInfo = async (accountType: string) => {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      Alert.alert("Error", "No access token found");
      return;
    }

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/account/account-info/${accountType}/`,
        requestOptions
      );
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      const data = await response.json();
      setAccountBalance(data.balance || 0);
      setAccountNumber(data.account_number);
      await AsyncStorage.setItem("currentAccountNumber", data.account_number);
      setLoading(false);

      // Fetch recent transactions for the new account type
      fetchRecentTransactions(data.account_number);
    } catch (error) {
      Alert.alert("Error fetching account info");
    }
  };

  const fetchUserData = async () => {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      Alert.alert("Error", "No access token found");
      return;
    }

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/user/", requestOptions);
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      const data = await response.json();
      setUserData({
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        email: data.email,
      });
    } catch (error) {
      Alert.alert("Error fetching user data");
    }
  };

  const fetchRecentTransactions = async (accountNumber: string) => {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      Alert.alert("Error", "No access token found");
      return;
    }

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/transactions/user-transactions/${accountNumber}/`,
        requestOptions
      );
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      const data = await response.json();
      const combinedTransactions = [...data.deposits, ...data.withdrawals, ...data.transfers];
      combinedTransactions.sort(
        (a, b) =>
          new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime()
      );
      setRecentTransactions(combinedTransactions);
    } catch (error) {
      Alert.alert("Error fetching recent transactions");
    }
  };

  useEffect(() => {
    fetchAccountTypes();
    fetchAccountInfo(selectedAccountType);
    fetchUserData();
  }, [selectedAccountType]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Hello, {userData.first_name}!
        </Text>
        <Text style={styles.subtitle}>Here's your account summary</Text>
      </View>

      <View style={styles.accountSelector}>
        <Text style={styles.label}>Select Account Type:</Text>
        <FlatList
          data={accountTypes}
          horizontal
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.accountTypeButton,
                selectedAccountType === item && styles.accountTypeButtonActive,
              ]}
              onPress={() => handleAccountTypeChange(item)}
            >
              <Text style={styles.accountTypeText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Account Balance:</Text>
        <Text style={styles.balanceAmount}>
          {loading ? "Loading..." : `$${accountBalance}`}
        </Text>
      </View>

      <Text style={styles.transactionsTitle}>Recent Transactions</Text>

      <FlatList
        data={recentTransactions}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Text style={styles.transactionText}>
              {item.transaction_type.charAt(0).toUpperCase() + item.transaction_type.slice(1)}
            </Text>
            <Text style={styles.transactionText}>Amount: ${item.amount}</Text>
            <Text style={styles.transactionText}>
              Date: {new Date(item.transaction_date).toLocaleDateString()}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noTransactionsText}>No recent transactions</Text>
        }
      />
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default UserDashboard;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f9fc",
  },
  header: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  accountSelector: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 10,
  },
  accountTypeButton: {
    padding: 10,
    marginRight: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  accountTypeButtonActive: {
    backgroundColor: "#3498db",
  },
  accountTypeText: {
    color: "#fff",
  },
  balanceContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  balanceLabel: {
    fontSize: 16,
    color: "#333",
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3498db",
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  transactionItem: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 20,
  },
  transactionText: {
    fontSize: 14,
    color: "#555",
  },
  noTransactionsText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginVertical: 10,
  },
  logoutButton: {
    marginVertical: 60,
    marginHorizontal: 20,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
