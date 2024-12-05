import AdminNavbar from "./AdminNavBar";
import "./styling/AdminUserTransactions.css";
import AdminUserTransaction from "./AdminUserTransaction";
import React, { useState, useEffect } from "react";


const AdminUserTransactions = () => {
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
               throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            const combinedTransactions = [
               ...data.deposits,
               ...data.withdrawals,
               ...data.transfers,
            ];

            combinedTransactions.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));

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
         <AdminNavbar />
         <div className="adminusertransactions-container">
            <h3 className="title">Transaction History</h3>
            {transactions.map((transaction) => (
               <AdminUserTransaction
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

export default AdminUserTransactions;
