import UserNavbar from "./UserNavBar";
import UserTransaction from "./UserTransaction";
import "./styling/UserDashboard.css";
import React, { useState, useEffect } from "react";


const UserDashboard = () => {
   const [accountBalance, setAccountBalance] = useState(0);
   const [loading, setLoading] = useState(true);
   const [selectedAccountType, setSelectedAccountType] = useState("checking");

   const handleAccountTypeChange = (event) => {
      setSelectedAccountType(event.target.value);
   };

   useEffect(() => {
      const fetchBalance = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
          console.error("No access token found");
          return;
        }
    
        const requestOptions = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        };
    
        try {
          const response = await fetch(`http://127.0.0.1:8000/account/balance/${selectedAccountType}/`, requestOptions);
          
          if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }
    
          const data = await response.json();
          setAccountBalance(data.balance || 0);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      };
    
      fetchBalance();
    }, [selectedAccountType]);

   //const accountBalance = 500; // Placeholder balance value
   return (
      <>
         <UserNavbar></UserNavbar>
         <div className="userdashboard-container">
            <div className="welcome-container">
               <h3 className="title-bright">Hello!</h3>
               <p className="text-bright">Here's your account summary</p>
               <select className="account-selector" onChange={handleAccountTypeChange} value={selectedAccountType}>
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
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
                        <button className="account-balance-statement-button">
                           View Statement
                        </button>
                     </div>
                  </div>
                  <div className="account-details-container">
                     <h3 className="title">Account Details</h3>
                  </div>
               </div>
               <div className="details-right-container">
                  <div className="recent-transactions-container">
                     <h3 className="title">Recent Transactions</h3>
                     {/*REPLACE -- Dynamically add transactions when available*/}
                     <UserTransaction id="124" amount="123"></UserTransaction>
                     <UserTransaction id="123" amount="-123"></UserTransaction>
                     <div>
                        <button className="view-all-button">View All</button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default UserDashboard;
