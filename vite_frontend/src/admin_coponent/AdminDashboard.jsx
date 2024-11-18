import AdminNavbar from "./AdminNavBar.jsx";
import AdminUserCard from "./AdminUserCard.jsx";
import AdminUserTransaction from "./AdminUserTransaction.jsx";
import { useState, useEffect } from "react";
import "./styling/AdminDashboard.css";

const AdminDashboard = () => {
   const [selectedUser, setSelectedUser] = useState({
      first_name: "",
      last_name: "",
      user_id: "",
      phone: "",
      email: "",
      account_type: "",
      account_number: "",
      balance: 0,
      transactions: [],
   });

   const [users, setUsers] = useState([]);
   const [matchingUsers, setMatchingUsers] = useState([]);

   useEffect(() => {
      const fetchUsers = async () => {
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
               "http://127.0.0.1:8000/account/all-accounts/",
               requestOptions
            );

            if (!response.ok) {
               throw new Error(
                  `Error ${response.status}: ${response.statusText}`
               );
            }

            const data = await response.json();
            setUsers(data);
            setMatchingUsers(data);
         } catch (error) {
            console.error("Error fetching user accounts:", error);
         }
      };

      fetchUsers();
   }, []);

   const fetchTransactions = async (accountNumber) => {
      const token = localStorage.getItem("access_token");
      if (!token) {
         console.error("No access token found");
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

         // Combine and sort transactions by most recent date
         const combinedTransactions = [
            ...data.deposits,
            ...data.withdrawals,
            ...data.transfers,
         ];
         combinedTransactions.sort(
            (a, b) =>
               new Date(b.transaction_date) - new Date(a.transaction_date)
         );

         // Return only the two most recent transactions
         return combinedTransactions.slice(0, 2);
      } catch (error) {
         console.error("Error fetching transactions:", error);
         return [];
      }
   };

   const search = (input) => {
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

   const handleUserClick = async (user) => {
      const transactions = await fetchTransactions(user.account_number);
      setSelectedUser({
         first_name: user.first_name,
         last_name: user.last_name,
         user_id: user.user_id,
         phone: user.phone,
         email: user.email,
         account_type: user.account_type,
         account_number: user.account_number,
         balance: user.balance,
         transactions: transactions,
      });
   };

   return (
      <>
         <AdminNavbar></AdminNavbar>
         <div className="admindashboard-container">
            <div className="welcome-container">
               <h3 className="title-bright">Hello!</h3>
               <p className="text-bright">Welcome to the admin dashboard</p>
            </div>
            <div className="details-container">
               <div className="details-left-container">
                  <div className="user-account-details-container">
                     <h3 className="title">User Account Details</h3>
                     <div
                        className="user-account-holder-details-container"
                        style={{
                           display:
                              selectedUser.email.length > 0 ? "block" : "none",
                        }}
                     >
                        <h3 className="title">User Account Holder</h3>
                        <p className="account-details-text">
                           Name: {selectedUser.first_name}{" "}
                           {selectedUser.last_name}
                        </p>
                        <p className="account-details-text">
                           User ID: {selectedUser.user_id}
                        </p>
                        <p className="account-details-text">
                           Phone: {selectedUser.phone}
                        </p>
                        <p className="account-details-text">
                           Email: {selectedUser.email}
                        </p>
                        <p className="account-details-text">
                           Account Type: {selectedUser.account_type}
                        </p>
                        <p className="account-details-text">
                           Account Number: {selectedUser.account_number}
                        </p>
                        <p className="account-details-text">
                           Balance: ${selectedUser.balance}
                        </p>
                     </div>
                  </div>
                  <div className="user-activity-container">
                     <h3 className="title">User Activity</h3>
                     <div
                        style={{
                           display:
                              selectedUser.email.length > 0 ? "block" : "none",
                        }}
                     >
                        {selectedUser.transactions?.map((transaction) => (
                           <AdminUserTransaction
                              key={transaction.id}
                              id={transaction.id}
                              amount={transaction.amount}
                           ></AdminUserTransaction>
                        ))}
                        <button
                           className="view-all-button"
                           onClick={() =>
                              (window.location.href = "/adminusertransactions")
                           }
                        >
                           View All
                        </button>
                     </div>
                  </div>
               </div>
               <div className="details-right-container">
                  <div className="user-search-container">
                     <h3 className="title">Users</h3>
                     <input
                        className="user-search-input"
                        placeholder="Search"
                        onChange={(e) => search(e.target.value)}
                     ></input>
                     <div style={{ minHeight: "100%", overflowY: "auto" }}>
                        {matchingUsers.map((user) => (
                           <div
                              key={user.account_number}
                              onClick={() => handleUserClick(user)}
                           >
                              <AdminUserCard
                                 firstName={user.first_name}
                                 lastName={user.last_name}
                                 phone={user.phone}
                                 email={user.email}
                                 accountType={user.account_type}
                                 accountNumber={user.account_number}
                              ></AdminUserCard>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default AdminDashboard;
