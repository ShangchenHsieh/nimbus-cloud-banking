import React, { useEffect, useState } from "react";
import UserNavbar from "./UserNavBar";
import UserTransaction from "./UserTransaction";
import "./styling/UserTransactions.css";

const UserTransactions = () => {
   const [transactions, setTransactions] = useState([]);
   const accountNumber = localStorage.getItem("currentAccountNumber");

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
               throw new Error(
                  `Error ${response.status}: ${response.statusText}`
               );
            }

            const data = await response.json();

            const combinedTransactions = [
               ...data.deposits,
               ...data.withdrawals,
               ...data.transfers,
            ];

            combinedTransactions.sort(
               (a, b) =>
                  new Date(b.transaction_date) - new Date(a.transaction_date)
            );

            setTransactions(combinedTransactions);
         } catch (error) {
            console.error("Error fetching transactions:", error);
         }
      };
      if (accountNumber) {
         fetchTransactions();
      }
   }, [accountNumber]);

   return (
      <>
         <UserNavbar />
         <div className="usertransactions-container">
            <h3 className="title">Transaction History</h3>
            {transactions.map((transaction) => (
               <UserTransaction
                  key={transaction.id}
                  id={transaction.id}
                  amount={transaction.amount}
                  transactionType={transaction.transaction_type}
                  transactionDate={transaction.transaction_date}
                  provider={transaction.provider}
                  showMoreInfo={true}
               />
            ))}
         </div>
      </>
   );
};

export default UserTransactions;
