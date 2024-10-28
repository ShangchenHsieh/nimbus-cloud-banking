import React, { useState, useEffect } from "react";
import UserNavbar from "./UserNavBar";
import "./styling/UserTransfer.css";

const UserTransfer = () => {
   const [transferData, setTransferData] = useState({
      sourceAccountNumber: "",
      destinationAccountNumber: "",
      amount: "",
      provider: "",
   });
   const [message, setMessage] = useState("");
   const [error, setError] = useState("");

   useEffect(() => {
      const fetchSourceAccountNumber = async () => {
         const token = localStorage.getItem("access_token");
         if (!token) {
            setError("User not authenticated.");
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
               "http://127.0.0.1:8000/transactions/source-account/",
               requestOptions
            );

            if (!response.ok) {
               throw new Error("Failed to fetch source account number.");
            }

            const data = await response.json();
            console.log("Fetched account number:", data.account_number);
            setTransferData((prevData) => ({
               ...prevData,
               sourceAccountNumber: data.account_number,
            }));
         } catch (error) {
            setError("Error fetching source account number.");
            console.error("Error fetching source account number:", error);
            
         }
      };

      fetchSourceAccountNumber();
   }, []);

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
            provider: transferData.provider,
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
            provider: "",
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
                  <div className="transfer-input-group">
                     <label className="text">Provider (optional):</label>
                     <input
                        type="text"
                        name="provider"
                        value={transferData.provider}
                        onChange={handleChange}
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
