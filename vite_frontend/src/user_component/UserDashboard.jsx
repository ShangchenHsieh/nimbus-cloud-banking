import UserNavbar from "./UserNavBar";
import UserTransaction from "./UserTransaction";
import UserPayment from "./UserPaymentOption";
import "./styling/UserDashboard.css";
import React, { useState, useEffect } from "react";
import UserPaymentOption from "./UserPaymentOption";


// function to handle display of transactions
const formatTransactionAmount = (type, amount) => {
   if (type === "withdrawal" || type === "transfer out") {
      return `-$${amount}`;
   }
   return `$${amount}`;
};

import atmIcon from '../assets/atm.png'
import checkIcon from '../assets/check.png'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const activityData = [
   { month: "Jan", activity: 400 },
   { month: "Feb", activity: 300 },
   { month: "Mar", activity: 200 },
   { month: "Apr", activity: 278 },
   { month: "May", activity: 189 },
   { month: "Jun", activity: 239 },
   { month: "Jul", activity: 349 },
   { month: "Aug", activity: 200 },
   { month: "Sep", activity: 300 },
   { month: "Oct", activity: 400 },
   { month: "Nov", activity: 500 },
   { month: "Dec", activity: 600 },
];

const UserDashboard = () => {
   const navigate = useNavigate();
   const [accountBalance, setAccountBalance] = useState(0);
   const [accountNumber, setAccountNumber] = useState("");;
   const [loading, setLoading] = useState(true);
   const [selectedAccountType, setSelectedAccountType] = useState("checking");
   const [accountTypes, setAccountTypes] = useState([]);
   const [recentTransactions, setRecentTransactions] = useState([]);

   const [userData, setUserData] = useState({
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
   });
   const [showDepositModal, setShowDepositModal] = useState(false);


   const handleAccountTypeChange = (event) => {
      setSelectedAccountType(event.target.value);
   };
   const handleDepositClick = () => {
      setShowDepositModal(true);
   };

   const closeDepositModal = () => {
      setShowDepositModal(false);
   };
   const handleAtmDeposit = () => {
      navigate("/deposit");
      closeDepositModal();
   };

   const handleCheckDeposit = () => {
      navigate('/deposit');
      closeDepositModal();
   };

   const handleWithdraw = () => {
      navigate('/withdraw')
   }

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
         } catch (error) {
            console.error("Error fetching balance:", error);
         }
      };

      fetchAccountInfo();
   }, [selectedAccountType]);

   // Fetch user data from the backend
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
            combinedTransactions.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));

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
            combinedTransactions.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));

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
               </select>
            </div>
            <div className="details-container">
               <div className="details-left-container">
                  <div className="account-balance-container">
                     <h3 className="title-bright">Account Balance</h3>
                     <div className="account-balance-details-container">
                        <h3 className="account-balance-title">
                           {loading ? "Loading..." : `$${accountBalance}`}
                        </h3>
                        <button
                           className="account-balance-statement-button"
                           onClick={(e) =>
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
                                    action={(e) =>
                                       (window.location.href = "/userpayment")
                                    }
                                 ></UserPaymentOption>
                                 <UserPaymentOption title="Transfer"></UserPaymentOption>
                                 <UserPaymentOption title="Deposit" action={handleDepositClick}></UserPaymentOption>
                                 <UserPaymentOption title="Withdraw" action={handleWithdraw}></UserPaymentOption>
                              </div>
                           </div>
                        </div>
                        <div className="account-details-right-container">
                           <h3 className="title">Monthly Activity</h3>
                           <div className="monthly-report-chart">
                              <div
                                 style={{
                                    height: "9%",
                                    backgroundColor: "#e8faff",
                                 }}
                              >
                                 <p className="text">Payments</p>
                              </div>
                              <div
                                 style={{
                                    height: "16%",
                                    backgroundColor: "#b3eeff",
                                 }}
                              >
                                 <p className="text">Transfers</p>
                              </div>
                              <div
                                 style={{
                                    height: "60%",
                                    backgroundColor: "#80e3ff",
                                 }}
                              >
                                 <p className="text">Deposits</p>
                              </div>
                              <div
                                 style={{
                                    height: "15%",
                                    backgroundColor: "#4dd8ff",
                                 }}
                              >
                                 <p className="text">Withdrawals</p>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="activity-card">
                        <h3>Monthly Report</h3>
                        <ResponsiveContainer width="95%" height={300}>
                           <LineChart data={activityData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Line type="monotone" dataKey="activity" stroke="#8884d8" strokeWidth={2} />
                           </LineChart>
                        </ResponsiveContainer>
                     </div>
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
                     <div>
                        <button
                           className="view-all-button"
                           onClick={(e) =>
                              (window.location.href = "/usertransactions")
                           }
                        >
                           View All
                        </button>
                     </div>
                  </div>
               </div>


            </div>
         </div>
         {/* Deposit Model */}
         {showDepositModal && (
            <div className="deposit-modal">
               <div className="modal-content">
                  <button className="close-button" onClick={closeDepositModal}>X</button>
                  <h3>Select Deposit Option</h3>
                  <div className="deposit-options">
                     <div className="deposit-card check-deposit">
                        <img src={atmIcon} alt="ATM Icon" className="icon" />
                        <h4>ATM Deposit</h4>
                        <p>Deposit cash quickly at any ATM.</p>
                        <button onClick={handleCheckDeposit}>Select</button>
                     </div>
                     <div className="deposit-card check-deposit">
                        <img src={checkIcon} alt="Check Icon" className="icon" />
                        <h4>Check Deposit</h4>
                        <p>Deposit checks to your account.</p>
                        <button onClick={handleCheckDeposit}>Select</button>
                     </div>
                  </div>
               </div>
            </div>
         )}


      </>
   );
};

export default UserDashboard;
