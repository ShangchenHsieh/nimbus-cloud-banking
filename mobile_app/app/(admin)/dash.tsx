import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define types for transactions and users
interface Transaction {
  id: number;
  description: string;
  type: string;
  date: string;
  provider?: string;
  amount: number;
}

interface User {
  first_name: string;
  last_name: string;
  user_id: string;
  phone: string;
  email: string;
  account_type: string;
  account_number: string;
  balance: number;
  transactions: Transaction[];
}

// AdminUserTransaction Component
const AdminUserTransaction: React.FC<Transaction> = (props) => {
  const isNegative =
    props.type === "withdrawal" || props.type === "transfer out";

  const dateTime = new Date(props.date);
  const formattedDate = dateTime.toLocaleDateString();
  const formattedTime = dateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const providerText = props.provider ? `Provider: ${props.provider}` : "Provider: Third-party-provider";

  return (
    <View style={styles.transactionContainer}>
      <Text style={styles.transactionTitle}>Transaction #{props.id}</Text>
      <Text style={styles.text}>{props.description}</Text>
      <Text style={styles.text}>{providerText}</Text>
      <Text style={styles.text}>Date: {formattedDate}</Text>
      <Text style={styles.text}>Time: {formattedTime}</Text>
      <Text
        style={
          isNegative
            ? styles.transactionTextNegative
            : styles.transactionTextPositive
        }
      >
        {isNegative ? "-$" : "+$"}
        {Math.abs(props.amount)}
      </Text>
    </View>
  );
};

// AdminDashboard Component
const AdminDashboard: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [matchingUsers, setMatchingUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
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
          "http://127.0.0.1:8000/account/all-accounts/",
          requestOptions
        );

        if (!response.ok) {
          throw new Error(
            `Error ${response.status}: ${response.statusText}`
          );
        }

        const data: User[] = await response.json();
        setUsers(data);
        setMatchingUsers(data);
      } catch (error) {
        Alert.alert("Error", `Error fetching user accounts`);
      }
    };

    fetchUsers();
  }, []);

  const search = (input: string) => {
    const searchTerms = input.toLowerCase().split(" ");
    const filteredUsers = users.filter((user) => {
      const firstName = user.first_name.toLowerCase();
      const lastName = user.last_name.toLowerCase();
      return searchTerms.every(
        (term) => firstName.includes(term) || lastName.includes(term)
      );
    });
    setMatchingUsers(filteredUsers);
  };

  const handleUserClick = async (user: User) => {
    const transactions: Transaction[] = await fetchTransactions(user.account_number);
    setSelectedUser({
      ...user,
      transactions: transactions,
    });
  };

  const fetchTransactions = async (accountNumber: string): Promise<Transaction[]> => {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      Alert.alert("Error", "No access token found");
      return [];
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

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const combinedTransactions: Transaction[] = [
        ...data.deposits,
        ...data.withdrawals,
        ...data.transfers,
      ];
      combinedTransactions.sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      return combinedTransactions;
    } catch (error) {
      Alert.alert("Error", `Error fetching transactions`);
      return [];
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("access_token");
    await AsyncStorage.removeItem("isAdmin");
    Alert.alert("Logout", "You have successfully logged out.");
  };

  return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.titleBright}>Hello!</Text>
        <Text style={styles.textBright}>Welcome to the admin dashboard</Text>
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.leftContainer}>
          <View style={styles.detailsBox}>
            <Text style={styles.title}>User Account Details</Text>
            {selectedUser && (
              <View style={styles.details}>
                <Text style={styles.text}>
                  Name: {selectedUser.first_name} {selectedUser.last_name}
                </Text>
                <Text style={styles.text}>User ID: {selectedUser.user_id}</Text>
                <Text style={styles.text}>Phone: {selectedUser.phone}</Text>
                <Text style={styles.text}>Email: {selectedUser.email}</Text>
                <Text style={styles.text}>
                  Account Type: {selectedUser.account_type}
                </Text>
                <Text style={styles.text}>
                  Account Number: {selectedUser.account_number}
                </Text>
                <Text style={styles.text}>
                  Balance: ${selectedUser.balance}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.detailsBox}>
            <Text style={styles.title}>User Activity</Text>
            <ScrollView style={styles.activityScrollView}>
              {selectedUser?.transactions.map((transaction, index) => (
                <AdminUserTransaction
                  key={`${transaction.id}-${index}`} // Unique key
                  {...transaction}
                />
              ))}
            </ScrollView>
          </View>
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.title}>Users</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            onChangeText={search}
          />
          <ScrollView>
            {matchingUsers.map((user, index) => (
              <TouchableOpacity
                key={`${user.account_number}-${index}`} // Unique key
                onPress={() => handleUserClick(user)}
              >
                <Text style={styles.userCard}>
                  {user.first_name} {user.last_name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      <View style={styles.logoutContainer}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AdminDashboard;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
    padding: 20,
    paddingTop: 90,
  },
  welcomeContainer: {
    backgroundColor: "#003349",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  titleBright: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  textBright: {
    color: "#ffffff",
  },
  detailsContainer: {
    flex: 1,
    flexDirection: "row",
  },
  leftContainer: {
    flex: 2,
    marginRight: 10,
  },
  rightContainer: {
    flex: 1,
  },
  detailsBox: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
  },
  searchInput: {
    backgroundColor: "#f7f9fc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderColor: "#d1d8e0",
    borderWidth: 1,
  },
  userCard: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  transactionContainer: {
    backgroundColor: "#f9fbfc",
    borderRadius: 10,
    padding: 12,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ebeff0",
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  transactionTextPositive: {
    fontSize: 14,
    color: "rgb(0, 219, 110)",
  },
  transactionTextNegative: {
    fontSize: 14,
    color: "rgb(243, 36, 0)",
  },
  details: {
    backgroundColor: "#f9fbfc",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#d1d8e0",
  },
  activityScrollView: {
    maxHeight: 200, 
  },
  logoutContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "red",
    height: 50, 
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center", 
    width: "100%", 
    marginVertical: 80, 
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
