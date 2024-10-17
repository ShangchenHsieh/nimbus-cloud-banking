import { useNavigate } from "react-router-dom";
import UserNavbar from "./UserNavBar";
import UserTransaction from "./UserTransaction";
import UserPayment from "./UserPayment";
import "./styling/UserDashboard.css";
import React, { useState, useEffect } from "react";


const UserDashboard = () => {
   const [accountBalance, setAccountBalance] = useState(0);
   const [loading, setLoading] = useState(true);
   const [selectedAccountType, setSelectedAccountType] = useState("checking");
   const [accountTypes, setAccountTypes] = useState([]);

   const handleAccountTypeChange = (event) => {
      setSelectedAccountType(event.target.value);
   };

   useEffect(() => {
      const fetchAccountTypes = async () => {
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
           const response = await fetch('http://127.0.0.1:8000/account/account-types/', requestOptions);
           
           if (!response.ok) {
             throw new Error(`Error ${response.status}: ${response.statusText}`);
           }

           const data = await response.json();
           setAccountTypes(data);
         } catch (error) {
           console.error('Error fetching account types:', error);
         }
      };

      fetchAccountTypes();
   }, []);

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
                  {accountTypes.map((type) => (
                     <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
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
                        <button className="account-balance-statement-button">
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
                                 Name: Ava Cado
                              </p>
                              <p className="account-details-text">
                                 Phone: +1 (555) 555-5555
                              </p>
                              <p className="account-details-text">
                                 Email: ava.cado@example.com
                              </p>
                              <p className="account-details-text">
                                 Address: 123 Example Street, San Jose, CA
                              </p>
                           </div>
                           <div className="account-payment-details-container">
                              <h3 className="title">Payment Services</h3>
                              <div className="payments-container">
                                 <UserPayment title="Pay"></UserPayment>
                                 <UserPayment title="Transfer"></UserPayment>
                                 <UserPayment title="Deposit"></UserPayment>
                                 <UserPayment title="Withdraw"></UserPayment>
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
                                 Transfers
                              </div>
                              <div
                                 style={{
                                    height: "60%",
                                    backgroundColor: "#80e3ff",
                                 }}
                              >
                                 Deposits
                              </div>
                              <div
                                 style={{
                                    height: "15%",
                                    backgroundColor: "#4dd8ff",
                                 }}
                              >
                                 Withdrawals
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="details-right-container">
                  <div className="recent-transactions-container">
                     <h3 className="title">Recent Transactions</h3>
                     {/*REPLACE -- Dynamically add transactions when available*/}
                     <UserTransaction id="124" amount="123"></UserTransaction>
                     <UserTransaction id="123" amount="-123"></UserTransaction>
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
      </>
   );
};

export default UserDashboard;
