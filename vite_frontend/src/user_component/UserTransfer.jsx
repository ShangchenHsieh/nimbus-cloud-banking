import React, { useState, useEffect } from "react";
import UserNavbar from "./UserNavBar";
import "./styling/UserTransfer.css";

const UserTransfer = () => {
   const sourceAccountNumber = localStorage.getItem("currentAccountNumber");
   const [transferData, setTransferData] = useState({
      sourceAccountNumber: sourceAccountNumber,
      destinationAccountNumber: "",
      amount: "",
   });
   const [message, setMessage] = useState("");
   const [error, setError] = useState("");

   const handleChange = (e) => {
      const { name, value } = e.target;
      setTransferData((prevData) => ({
         ...prevData,
         [name]: value,
      }));
   };

   console.log("Transfer data being sent:", transferData);

   const handleTransfer = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("access_token");
      if (!token) {
         setError("User not authenticated.");
         return;
      }

      const requestOptions = {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify({
            source_account_number: transferData.sourceAccountNumber,
            destination_account_number: transferData.destinationAccountNumber,
            amount: transferData.amount,
         }),
      };

      console.log("Request body:", requestOptions.body);

      try {
         const response = await fetch(
            "http://127.0.0.1:8000/transactions/internal-transfer/",
            requestOptions
         );

         const data = await response.json();

         if (!response.ok) {
            //console.log("Error details:", data);
            console.log("Error details:", JSON.stringify(data, null, 2)); 
            throw new Error(data.error || "Transfer failed");
         }

         setMessage("Transfer successful!");
         setError("");
         setTransferData({
            sourceAccountNumber: transferData.sourceAccountNumber,
            destinationAccountNumber: "",
            amount: "",
         });
         
      } catch (err) {
         setMessage("");
         setError(err.message);
      }
   };

   return (
      <>
         <UserNavbar />
         <div className="usertransfer-container">
            <h3 className="title">Transfer Funds</h3>
            <div className="usertransfer-details-container">
               <form onSubmit={handleTransfer}>
                  <p className="text">
                     Source Account: {transferData.sourceAccountNumber || "Loading..."}
                  </p>
                  <div className="transfer-input-group">
                     <label className="text">Destination Account Number:</label>
                     <input
                        type="text"
                        name="destinationAccountNumber"
                        value={transferData.destinationAccountNumber}
                        onChange={handleChange}
                        required
                        className="input-box"
                     />
                  </div>
                  <div className="transfer-input-group">
                     <label className="text">Amount:</label>
                     <input
                        type="number"
                        name="amount"
                        value={transferData.amount}
                        onChange={handleChange}
                        required
                        className="input-box"
                     />
                  </div>
                  <button type="submit" className="transfer-button">
                     Transfer Now
                  </button>
               </form>
               {message && <p className="success-message">{message}</p>}
               {error && <p className="error-message">{error}</p>}
            </div>
         </div>
      </>
   );
};

export default UserTransfer;
