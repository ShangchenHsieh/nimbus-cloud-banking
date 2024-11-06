import React, { useState, useEffect } from "react";
import UserNavbar from "./UserNavBar";
import "./styling/UserPayment.css";

const UserPayment = () => {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [paymentStatus, setPaymentStatus] = useState("");
   const [accountNumber, setAccountNumber] = useState(""); // State to hold the account number
   const [error, setError] = useState(""); // State to hold error messages

   // Fetch the user's account number on component mount
   useEffect(() => {
      const fetchAccountNumber = async () => {
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
            setAccountNumber(data.account_number);
         } catch (error) {
            setError("Error fetching source account number.");
            console.error("Error fetching source account number:", error);
         }
      };

      fetchAccountNumber();
   }, []);

   const openModal = () => {
      setIsModalOpen(true);
      setPaymentStatus(""); // Reset status message when opening modal
      setError(""); // Reset error message
   };

   const closeModal = () => {
      setIsModalOpen(false);
   };

   const confirmPayment = async () => {
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
            account_number: accountNumber, // Use the retrieved account number
            amount: 40.00, // The amount to withdraw
         }),
      };

      try {
         const response = await fetch(
            "http://127.0.0.1:8000/transactions/withdrawal",
            requestOptions
         );

         const data = await response.json();

         if (!response.ok) {
            // If there's an error related to insufficient funds or any other reason
            setPaymentStatus(data.error || "Insufficient funds");
            return; // Prevent closing the modal
         } else {
            console.log("Payment confirmed");
            setPaymentStatus("Payment successful!");
         }
      } catch (error) {
         console.error("Error confirming payment:", error);
         setPaymentStatus("An error occurred. Please try again.");
      }
   };

   return (
      <>
         <UserNavbar />
         <div className="userpayment-container">
            <h3 className="title">Bill Payments</h3>
            <div className="userpayment-details-container">
               <div className="payment-container">
                  <div>
                     <div className="item">
                        <p className="text">Payment Method: </p>
                        <select className="selector">
                           <option>Checking</option>
                        </select>
                     </div>
                  </div>
                  <button className="pay-now-button" onClick={openModal}>
                     Pay Now
                  </button>
               </div>
               <div className="breakdown-container">
                  <h3 className="title">Breakdown</h3>
                  <div className="payment-breakdown-container">
                     <div className="item">
                        <p className="text-left">Maintenance</p>
                        <p className="text-right">$30.00</p>
                     </div>
                     <div className="item">
                        <p className="text-left">Transaction Fees</p>
                        <p className="text-right">$10.00</p>
                     </div>
                     <hr className="line" />
                     <div className="item">
                        <p className="text-left">Total</p>
                        <p className="text-right">$40.00</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {isModalOpen && (
            <div className="modal-overlay">
               <div className="modal-content">
                  <h3 className="modal-title">Confirm Payment</h3>
                  <p>Are you sure you want to proceed with this payment of $40.00?</p>
                  <div className="modal-buttons">
                     <button className="modal-button confirm" onClick={confirmPayment}>
                        Confirm Payment
                     </button>
                     <button className="modal-button cancel" onClick={closeModal}>
                        Cancel
                     </button>
                  </div>
                  {paymentStatus && <p className="payment-status">{paymentStatus}</p>} {/* Display payment status */}
                  {error && <p className="error-message">{error}</p>} {/* Display error message */}
               </div>
            </div>
         )}
      </>
   );
};

export default UserPayment;
