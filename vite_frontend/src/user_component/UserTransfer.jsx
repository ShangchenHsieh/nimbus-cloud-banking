import React, { useState, useEffect } from "react";
import UserNavbar from "./UserNavBar";
import { useNavigate } from "react-router-dom";
import "./styling/UserTransfer.css";

const UserTransfer = () => {
   const sourceAccountNumber = localStorage.getItem("currentAccountNumber");
   const [message, setMessage] = useState("");
   const [error, setError] = useState("");
   const [amount, setAmount] = useState("");
   const [destinationAccountNumber, setDestinationAccountNumber] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);
   const navigate = useNavigate();

   const handleTransfer = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("access_token");
      setIsSubmitting(true);

      if (amount == 0) {
         setError("Can not transfer 0 dollars.");
         return;
      }

      if (!token) {
         console.error("No access token found");
         setError("User not authenticated.");
         setIsSubmitting(false);
         return;
      }

      try {
         const response = await fetch(
            "http://127.0.0.1:8000/transactions/internal-transfer/",
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
               },
               body: JSON.stringify({
                  source_account_number: sourceAccountNumber,
                  destination_account_number: destinationAccountNumber,
                  amount: parseFloat(amount),
               }),
            }
         );

         if (!response.ok) {
            const errorData = await response.json();
            console.log("Error details:", JSON.stringify(errorData, null, 2));
            setError(errorData.error || "Transfer failed.");
            setIsSubmitting(false);
         } else {
            const data = await response.json();
            console.log(data);
            setMessage("Transfer successful!");
            setError("");
            setIsSubmitting(false);
            navigate("/userdashboard");
         }
      } catch (error) {
         console.error("An unexpected error occurred:", error);
         setError("Transfer failed. Please try again.");
         setMessage("");
         setIsSubmitting(false);
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
                     Source Account: {sourceAccountNumber || "Loading..."}
                  </p>
                  <div className="transfer-input-group">
                     <label className="text">Destination Account Number:</label>
                     <input
                        className="transfer-input"
                        type="text"
                        value={destinationAccountNumber}
                        onChange={(e) => {
                           const value = e.target.value;
                           if (/^\d*$/.test(value)) {
                              // Only allow digits
                              setDestinationAccountNumber(value);
                           }
                        }}
                        onKeyDown={(e) => {
                           if (["e", "E", "+", "-", "."].includes(e.key)) {
                              // Prevent scientific notation or invalid symbols
                              e.preventDefault();
                           }
                        }}
                     />
                  </div>
                  <div className="transfer-input-group">
                     <label className="text">Amount:</label>
                     <input
                        className="transfer-input"
                        type="text"
                        placeholder="Amount"
                        value={amount}
                        min="0" // No negaive amounts
                        step="0.01" // Allow decimal values
                        onChange={(e) => {
                           const value = e.target.value;
                           if (/^\d*\.?\d{0,2}$/.test(value)) {
                              setAmount(value);
                           }
                        }}
                        onKeyDown={(e) => {
                           if (
                              ["e", "E", "+", "-", "."].includes(e.key) &&
                              e.target.value === ""
                           ) {
                              e.preventDefault();
                           }
                        }}
                     />
                  </div>
                  <button
                     type="submit"
                     className="transfer-button"
                     disabled={isSubmitting}
                  >
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
