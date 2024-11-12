import AdminNavbar from "./AdminNavBar.jsx";
import AdminUserCard from "./AdminUserCard.jsx";
import AdminUserTransaction from "./AdminUserTransaction.jsx";
import { useState } from "react";
import "./styling/AdminDashboard.css";

const AdminDashboard = () => {
   const [selectedUser, setSelectedUser] = useState({
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      balance: 0,
      transactions: [],
   });
   const users = [
      {
         first_name: "Ava",
         last_name: "Cado",
         phone: "+1 (555) 555-5555",
         email: "ava.cado@example.com",
         balance: 500,
         transactions: [
            { id: 124, amount: 123 },
            { id: 123, amount: -123 },
         ],
      },
      {
         first_name: "Ben",
         last_name: "Jerry",
         phone: "+1 (555) 455-5555",
         email: "ben.jerry@example.com",
         balance: 1500,
         transactions: [
            { id: 234, amount: -234 },
            { id: 324, amount: -123 },
         ],
      },
      {
         first_name: "Kevin",
         last_name: "Nguyen",
         phone: "+1 (555) 355-5555",
         email: "kevin.nguyen@example.com",
         balance: 200,
         transactions: [
            { id: 236, amount: 452 },
            { id: 964, amount: 32 },
         ],
      },
   ];
   const [matchingUsers, setMatchingUsers] = useState([]);

   const search = (input) => {
      const result = [];

      if (input.length < 1) {
         setMatchingUsers([]);
         return;
      }

      for (let i = 0; i < users.length; i++) {
         if (
            users[i].first_name.toLowerCase().includes(input.toLowerCase()) ||
            users[i].last_name.toLowerCase().includes(input.toLowerCase())
         )
            result.push(users[i]);
      }
      setMatchingUsers(result);
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
                           Phone: {selectedUser.phone}
                        </p>
                        <p className="account-details-text">
                           Email: {selectedUser.email}
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
                        {selectedUser.transactions.map((transaction) => (
                           <AdminUserTransaction
                              id={transaction.id}
                              amount={transaction.amount}
                           ></AdminUserTransaction>
                        ))}
                        <button
                           className="view-all-button"
                           onClick={(e) =>
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
                              onClick={() =>
                                 setSelectedUser({
                                    first_name: user.first_name,
                                    last_name: user.last_name,
                                    phone: user.phone,
                                    email: user.email,
                                    balance: user.balance,
                                    transactions: user.transactions,
                                 })
                              }
                           >
                              <AdminUserCard
                                 firstName={user.first_name}
                                 lastName={user.last_name}
                                 phone={user.phone}
                                 email={user.email}
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
