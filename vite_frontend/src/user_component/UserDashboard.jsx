import UserNavbar from "./UserNavBar";
import UserTransaction from "./UserTransaction";
import UserPayment from "./UserPaymentOption";
import "./styling/UserDashboard.css";
import React, { useState, useEffect } from "react";
import UserPaymentOption from "./UserPaymentOption";

import atmIcon from "../assets/atm.png";
import checkIcon from "../assets/check.png";
import paymentIcon from "../assets/Payment_Icon.png";
import transferIcon from "../assets/Transfer_Icon.png";
import depositIcon from "../assets/Deposit_Icon.png";
import withdrawIcon from "../assets/Withdraw_Icon.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const allAccountTypes = ["checking", "savings", "retirement"];

// function to handle display of transactions
const formatTransactionAmount = (type, amount) => {
   if (type === "withdrawal" || type === "transfer out") {
      return `-$${amount}`;
   }
   return `$${amount}`;
};



const UserDashboard = () => {
   const navigate = useNavigate();
   const [accountBalance, setAccountBalance] = useState(0);
   const [accountNumber, setAccountNumber] = useState("");
   const [loading, setLoading] = useState(true);
   const [selectedAccountType, setSelectedAccountType] = useState("checking");
   const [accountTypes, setAccountTypes] = useState([]);
   const [recentTransactions, setRecentTransactions] = useState([]);
   const [showAddAccountModal, setShowAddAccountModal] = useState(false);
   const [selectedAccountOpenType, setSelectedAccountOpenType] = useState("");

   const [userData, setUserData] = useState({
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
   });

   const availableAccountTypes = allAccountTypes.filter(
      (type) => !accountTypes.includes(type)
   );

   const handleAccountTypeChange = (event) => {
      const selectedValue = event.target.value;

      if (selectedValue === "add-account") {
         setShowAddAccountModal(true);
      } else {
         setSelectedAccountType(selectedValue);
      }
   };

   const closeAddAccountModal = () => {
      setShowAddAccountModal(false);
   };

   const handleDepositClick = () => {
      navigate("/deposit");
   };

   const handleWithdraw = () => {
      navigate("/withdraw");
   };

   const handleDeleteAccount = async () => {
      if (parseFloat(accountBalance) !== 0) {
         alert(
            "Account cannot be deleted. Please ensure the account balance is $0 before deleting."
         );
         return;
      }
      const confirmation = window.confirm(
         `Are you sure you want to delete the account of type "${selectedAccountType}"? This action cannot be undone.`
      );

      if (!confirmation) {
         // User canceled the action
         return;
      }

      const token = localStorage.getItem("access_token");
      if (!token) {
         console.error("No access token found");
         return;
      }

      const requestOptions = {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify({
            email: userData.email,
            account_type: selectedAccountType,
         }),
      };

      try {
         const response = await fetch(
            "http://127.0.0.1:8000/account/delete-account/",
            requestOptions
         );

         if (!response.ok) {
            throw new Error(
               `Error ${response.status}: ${response.statusText}`
            );
         }

         const data = await response.json();
         console.log("Account deleted successfully:", data);

         // Remove the deleted account type from the dropdown
         setAccountTypes((prevAccountTypes) =>
            prevAccountTypes.filter((type) => type !== selectedAccountType)
         );

         // Reset the selected account type
         if (accountTypes.length > 1) {
            setSelectedAccountType(accountTypes[0]);
         } else {
            setSelectedAccountType("");
         }

         alert("Account deleted successfully!");
         //setSelectedAccountType(""); // Reset selected account type
         //setAccountTypes(); // Refetch all account types
         //window.location.reload();
         fetchAccountInfo();
      } catch (error) {
         console.error("Error deleting account or account already deleted and failted to retrieve info:", error);
         //alert("Failed to delete account. Please try again.");
      }
   };

   const createAccount = async (accountType) => {
      const token = localStorage.getItem("access_token");
      if (!token) {
         console.error("No access token found");
         return;
      }

      const requestOptions = {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify({ account_type: accountType }),
      };

      try {
         const response = await fetch(
            "http://127.0.0.1:8000/account/create-account/",
            requestOptions
         );

         if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
         }

         const data = await response.json();
         console.log("Account created successfully:", data);

         setAccountTypes((prevAccountTypes) => [
            ...prevAccountTypes,
            accountType,
         ]);
         closeAddAccountModal();
      } catch (error) {
         console.error("Error creating account:", error);
      }
   };

   useEffect(() => {
      const fetchAccountTypes = async () => {
         const token = localStorage.getItem("access_token");
         if (!token) {
            console.error("No access token found");
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

            if (!response.ok) {
               throw new Error(
                  `Error ${response.status}: ${response.statusText}`
               );
            }

            const data = await response.json();
            setAccountTypes(data);
         } catch (error) {
            console.error("Error fetching account types:", error);
         }
      };

      fetchAccountTypes();
   }, []);

   const handleProcessRecurringPayments = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
         return;
      }

      const requestOptions = {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
      };

      try {
         const response = await fetch(
            "http://127.0.0.1:8000/transactions/process-recurring-payments/",
            requestOptions
         );

         if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
         }
      } catch (error) {
         console.error("Error processing recurring payments:", error);
      }
   };

   useEffect(() => {
      handleProcessRecurringPayments();
   }, []);

   useEffect(() => {
      const fetchAccountInfo = async () => {
         const token = localStorage.getItem("access_token");
         if (!token) {
            console.error("No access token found");
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
               `http://127.0.0.1:8000/account/account-info/${selectedAccountType}/`,
               requestOptions
            );

            if (!response.ok) {
               throw new Error(
                  `Error ${response.status}: ${response.statusText}`
               );
            }

            const data = await response.json();
            setAccountBalance(data.balance || 0);
            setLoading(false);
            setAccountNumber(data.account_number);
            localStorage.setItem("currentAccountNumber", data.account_number);
            localStorage.setItem("currentAccount", selectedAccountType);
         } catch (error) {
            console.error("Error fetching balance:", error);
         }
      };

      fetchAccountInfo();
   }, [selectedAccountType]);

   useEffect(() => {
      const fetchUserData = async () => {
         const token = localStorage.getItem("access_token");
         if (!token) {
            console.error("No access token found");
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
               "http://127.0.0.1:8000/auth/user/",
               requestOptions
            );

            if (!response.ok) {
               throw new Error(
                  `Error ${response.status}: ${response.statusText}`
               );
            }

            const data = await response.json();
            setUserData({
               first_name: data.first_name,
               last_name: data.last_name,
               phone: data.phone,
               email: data.email,
            });
         } catch (error) {
            console.error("Error fetching user data:", error);
         }
      };

      fetchUserData();
   }, []);

   useEffect(() => {
      const fetchRecentTransactions = async () => {
         const token = localStorage.getItem("access_token");
         if (!token) {
            console.error("No access token found");
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

            if (!response.ok) {
               throw new Error(
                  `Error ${response.status}: ${response.statusText}`
               );
            }

            const data = await response.json();

            // combining all transactions into a single list
            const combinedTransactions = [
               ...data.deposits,
               ...data.withdrawals,
               ...data.transfers,
            ];

            // sort by most recent date
            combinedTransactions.sort(
               (a, b) =>
                  new Date(b.transaction_date) - new Date(a.transaction_date)
            );

            // Set the two most recent transactions
            setRecentTransactions(combinedTransactions.slice(0, 2));
         } catch (error) {
            console.error("Error fetching recent transactions:", error);
         }
      };

      if (accountNumber) {
         fetchRecentTransactions();
      }
   }, [accountNumber, selectedAccountType]);

   // Add this helper function to process transactions
   const calculateActivityDistribution = (transactions) => {
      const activityCounts = {
         payments: 0,
         transfers: 0,
         deposits: 0,
         withdrawals: 0,
      };

      // Count each transaction type
      transactions.forEach((transaction) => {
         switch (transaction.transaction_type) {
            case "payment":
               activityCounts.payments += 1;
               break;
            case "transfer":
               activityCounts.transfers += 1;
               break;
            case "deposit":
               activityCounts.deposits += 1;
               break;
            case "withdrawal":
               activityCounts.withdrawals += 1;
               break;
            default:
               break;
         }
      });

      // Calculate percentages
      const total = Object.values(activityCounts).reduce(
         (sum, count) => sum + count,
         0
      );
      return {
         payments: (activityCounts.payments / total) * 100 || 0,
         transfers: (activityCounts.transfers / total) * 100 || 0,
         deposits: (activityCounts.deposits / total) * 100 || 0,
         withdrawals: (activityCounts.withdrawals / total) * 100 || 0,
      };
   };

   // Inside the component
   const activityDistribution =
      calculateActivityDistribution(recentTransactions);

   //const accountBalance = 500; // Placeholder balance value
   return (
      <>
         <UserNavbar></UserNavbar>
         <div className="userdashboard-container">
            <div className="welcome-container">
               <h3 className="title-bright">Hello!</h3>
               <p className="text-bright">Here's your account summary</p>
               <select
                  className="account-selector"
                  onChange={handleAccountTypeChange}
                  value={selectedAccountType}
               >
                  {accountTypes.map((type) => (
                     <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                     </option>
                  ))}
                  {availableAccountTypes.length > 0 && (
                     <option value="add-account">+(Add New Account)</option>
                  )}
               </select>
               <button
                  className="delete-account-button"
                  onClick={handleDeleteAccount}
               >
                  X Delete Account
               </button>
            </div>
            <div className="details-container">
               <div className="details-left-container">
                  <div className="account-balance-container">
                     <h3 className="title-bright">
                        Account Balance for {selectedAccountType} account #:{" "}
                        {accountNumber}
                     </h3>
                     <div className="account-balance-details-container">
                        <h3 className="account-balance-title">
                           {loading ? "Loading..." : `$${accountBalance}`}
                        </h3>
                        <button
                           className="account-balance-statement-button"
                           onClick={() =>
                              (window.location.href = "/userstatement")
                           }
                        >
                           View Statement
                        </button>
                     </div>
                  </div>

                  <div className="account-details-container">
                     <h3 className="title">Account Details</h3>
                     <div className="account-details-details-container">
                        <div className="account-details-left-container">
                           <div className="account-holder-details-container">
                              <h3 className="title">Account Holder</h3>
                              <p className="account-details-text">
                                 Name: {userData.first_name}{" "}
                                 {userData.last_name}
                              </p>
                              <p className="account-details-text">
                                 Phone: {userData.phone}
                              </p>
                              <p className="account-details-text">
                                 Email: {userData.email}
                              </p>
                           </div>

                           <div className="account-payment-details-container">
                              <h3 className="title">Payment Services</h3>
                              <div className="payments-container">
                                 <UserPaymentOption
                                    title="Pay"
                                    icon={paymentIcon}
                                    action={() =>
                                       (window.location.href = "/userpayment")
                                    }
                                 ></UserPaymentOption>
                                 <UserPaymentOption
                                    title="Transfer"
                                    icon={transferIcon}
                                    action={() =>
                                       (window.location.href = "/usertransfer")
                                    }
                                 ></UserPaymentOption>
                                 <UserPaymentOption
                                    title="Deposit"
                                    icon={depositIcon}
                                    action={handleDepositClick}
                                 ></UserPaymentOption>
                                 <UserPaymentOption
                                    title="Withdraw"
                                    icon={withdrawIcon}
                                    action={handleWithdraw}
                                 ></UserPaymentOption>
                              </div>
                           </div>
                        </div>
                        <div className="monthly-report-chart">
                           <div
                              style={{
                                 height: `${activityDistribution.payments}%`,
                                 minHeight: "20px", // Minimum height for visibility
                                 backgroundColor: "#e8faff",
                              }}
                           >
                              <p className="text">Payments</p>
                           </div>
                           <div
                              style={{
                                 height: `${activityDistribution.transfers}%`,
                                 minHeight: "20px", // Minimum height for visibility
                                 backgroundColor: "#b3eeff",
                              }}
                           >
                              <p className="text">Transfers</p>
                           </div>
                           <div
                              style={{
                                 height: `${activityDistribution.deposits}%`,
                                 minHeight: "20px", // Minimum height for visibility
                                 backgroundColor: "#80e3ff",
                              }}
                           >
                              <p className="text">Deposits</p>
                           </div>
                           <div
                              style={{
                                 height: `${activityDistribution.withdrawals}%`,
                                 minHeight: "20px", // Minimum height for visibility
                                 backgroundColor: "#4dd8ff",
                              }}
                           >
                              <p className="text">Withdrawals</p>
                           </div>
                        </div>
                     </div>
                     {/*
                     --UNCOMMENT IF USED--
                     <div className="activity-card">
                        <h3>Monthly Report</h3>
                        <ResponsiveContainer width="95%" height={300}>
                           <LineChart data={activityData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Line
                                 type="monotone"
                                 dataKey="activity"
                                 stroke="#8884d8"
                                 strokeWidth={2}
                              />
                           </LineChart>
                        </ResponsiveContainer>
                     </div>
                     */}
                  </div>
               </div>

               <div className="details-right-container">
                  <div className="recent-transactions-container">
                     <h3 className="title">Recent Transactions</h3>
                     {recentTransactions.map((transaction) => (
                        <UserTransaction
                           key={transaction.id}
                           id={transaction.id}
                           amount={transaction.amount}
                           transactionType={transaction.transaction_type}
                        />
                     ))}
                     <button
                        className="view-all-button"
                        onClick={() =>
                           (window.location.href = "/usertransactions")
                        }
                     >
                        View All
                     </button>
                  </div>
               </div>

            </div>
         </div>
         {/* Open Account Model */}
         {showAddAccountModal && (
            <div className="add-account-modal">
               <div className="modal-content">
                  <button
                     className="close-button"
                     onClick={closeAddAccountModal}
                  >
                     X
                  </button>
                  <h3>Add New Account</h3>
                  <select
                     value={selectedAccountOpenType}
                     onChange={(e) =>
                        setSelectedAccountOpenType(e.target.value)
                     }
                  >
                     <option value="" disabled>
                        Select Account Type
                     </option>
                     {availableAccountTypes.map((type) => (
                        <option key={type} value={type}>
                           {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                     ))}
                  </select>
                  <button
                     onClick={() =>
                        createAccount(selectedAccountOpenType.toLowerCase())
                     }
                  >
                     Create Account
                  </button>
               </div>
            </div>
         )}
      </>
   );
};

export default UserDashboard;
