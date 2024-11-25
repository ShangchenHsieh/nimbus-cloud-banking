import UserNavbar from "./UserNavBar";
import icon from "../assets/icon.png";
import "./styling/UserStatement.css";
import React, { useEffect, useState } from "react";


const UserStatement = () => {
   const [transactions, setTransactions] = useState([]);
   const [incomingTotal, setIncomingTotal] = useState("");
   const [outgoingTotal, setOutgoingTotal] = useState("");
   const [monthlyChange, setMonthlyChange] = useState(0);
   const [accountBalance, setAccountBalance] = useState(0);
   const [withdrawalsTotal, setWithdrawalsTotal] = useState(0);
   const [transfersOutTotal, setTransfersOutTotal] = useState(0);
   const [depositsTotal, setDepositsTotal] = useState(0);
   const [transfersInTotal, setTransfersInTotal] = useState(0);
   const [firstName, setFirstName] = useState("");
   const [lastName, setLastName] = useState("");
   const selectedAccountType = localStorage.getItem("currentAccount")
   const accountNumber = localStorage.getItem("currentAccountNumber");

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
            setAccountBalance(data.balance);
         } catch (error) {
            console.error("Error fetching balance:", error);
         }
      };

      fetchAccountInfo();
   }, []);


   useEffect(() => {
      const fetchTransactions = async () => {
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
               throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            const combinedTransactions = [
               ...data.deposits,
               ...data.withdrawals,
               ...data.transfers,
            ];

            // Get current month and year
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();

            const currentMonthTransactions = combinedTransactions.filter((transaction) => {
               const transactionDate = new Date(transaction.transaction_date);
               return (
                  transactionDate.getMonth() === currentMonth &&
                  transactionDate.getFullYear() === currentYear
               );
            });


            // Get Total sum of each type of transaction
            const withdrawalsArray = currentMonthTransactions.filter(
               (transaction) => transaction.transaction_type === "withdrawal"
            );
            setWithdrawalsTotal(
               withdrawalsArray.reduce((total, transaction) => total + parseFloat(transaction.amount), 0)
            );

            const transfersOutArray = currentMonthTransactions.filter(
               (transaction) => transaction.transaction_type === "transfer out"
            );
            setTransfersOutTotal(
               transfersOutArray.reduce((total, transaction) => total + parseFloat(transaction.amount), 0)
            );

            const depositsArray = currentMonthTransactions.filter(
               (transaction) => transaction.transaction_type === "deposit"
            );
            setDepositsTotal(
               depositsArray.reduce((total, transaction) => total + parseFloat(transaction.amount), 0)
            );

            const transfersInArray = currentMonthTransactions.filter(
               (transaction) => transaction.transaction_type === "transfer in"
            );
            setTransfersInTotal(
               transfersInArray.reduce((total, transaction) => total + parseFloat(transaction.amount), 0)
            );

            // Calculate totals
            const totalWithdrawalsAndTransfersOut =
               [...withdrawalsArray, ...transfersOutArray].reduce(
                  (total, transaction) => total + parseFloat(transaction.amount),
                  0
               );
            setOutgoingTotal(totalWithdrawalsAndTransfersOut);

            const totalDepositsAndTransfersIn =
               [...depositsArray, ...transfersInArray].reduce(
                  (total, transaction) => total + parseFloat(transaction.amount),
                  0
               );
            setIncomingTotal(totalDepositsAndTransfersIn);

            setMonthlyChange(totalDepositsAndTransfersIn - totalWithdrawalsAndTransfersOut)
         } catch (error) {
            console.error("Error fetching transactions:", error);
         }
      };
      if (accountNumber) {
         fetchTransactions();
      }
   }, [accountNumber]);

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
            setFirstName(data.first_name);
            setLastName(data.last_name);
         } catch (error) {
            console.error("Error fetching user data:", error);
         }
      };

      fetchUserData();
   }, []);

   return (
      <>
         <UserNavbar></UserNavbar>
         <div className="userstatement-container">
            <h3 className="title">Monthly Bank Statement</h3>
            <div className="userstatement-details-container">
               <div className="logo-container">
                  <img className="logo" src={icon} alt="Logo" />
                  <h3 className="title">Nimbus Cloud Banking</h3>
                  <p className="text-right">Generation Date: {Date()}</p>
               </div>
               <h3 className="title">Account Holder</h3>
               <hr className="line"></hr>
               <div className="item">
                  <p className="text-left">Name</p>
                  <p className="text-right">{firstName} {lastName}</p>
               </div>
               <h3 className="title">Activity Summary</h3>
               <hr className="line"></hr>
               <div className="item">
                  <p className="text-left">Incoming Transfers</p>
                  <p className="text-right">${transfersInTotal}</p>
               </div>
               <div className="item">
                  <p className="text-left">Outgoing Transfers</p>
                  <p className="text-right">-${transfersOutTotal}</p>
               </div>
               <div className="item">
                  <p className="text-left">Deposits</p>
                  <p className="text-right">${depositsTotal}</p>
               </div>
               <div className="item">
                  <p className="text-left">Withdrawals</p>
                  <p className="text-right">-${withdrawalsTotal}</p>
               </div>
               <h3 className="title">Account Status</h3>
               <hr className="line"></hr>
               <div className="item">
                  <p className="text-left">Current Balance</p>
                  <p className="text-right">${accountBalance}</p>
               </div>
               <div className="item">
                  <p className="text-left">Monthly Balance Change</p>
                  <p className="text-right">{monthlyChange.toFixed(2)}</p>
               </div>
            </div>
         </div>
      </>
   );
};

export default UserStatement;
