import React, { useState, useEffect } from "react";
import UserNavbar from "./UserNavBar";
import "./styling/UserPayment.css";
import { useNavigate } from "react-router-dom";

const UserPayment = () => {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [accountTypes, setAccountTypes] = useState([]);
   const [selectedAccountType, setSelectedAccountType] = useState("checking");
   const [accountNumber, setAccountNumber] = useState("");
   const [amount, setAmount] = useState("");
   const [fee, setFee] = useState("0");
   const [amountWithFee, setAmountWithFee] = useState("");
   const [message, setMessage] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);

   const navigate = useNavigate();

   const openModal = () => {
      setIsModalOpen(true);
   };

   const closeModal = () => {
      setIsModalOpen(false);
      setMessage("");
   };

   const handleAccountTypeChange = (event) => {
      setSelectedAccountType(event.target.value);
   };

   useEffect(() => {
      const parsedAmount = parseFloat(amount) || 0;
      const calculatedFee = parsedAmount * 0.02; // fee is 2% of the entered amount
      setFee(calculatedFee.toFixed(2));
      setAmountWithFee(
         parsedAmount > 0 ? (parsedAmount + calculatedFee).toFixed(2) : "0.00"
      );
   }, [amount]);

   useEffect(() => {
      const fetchAccountTypes = async () => {
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
               "http://127.0.0.1:8000/account/account-types/",
               requestOptions
            );

            if (!response.ok) {
               throw new Error(
                  `Error ${response.status}: ${response.statusText}`
               );
            }

            const data = await response.json();
            setAccountTypes(data);
         } catch (error) {
            console.error("Error fetching account types:", error);
         }
      };

      fetchAccountTypes();
   }, []);

   useEffect(() => {
      const fetchAccountInfo = async () => {
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
               `http://127.0.0.1:8000/account/account-info/${selectedAccountType}/`,
               requestOptions
            );

            if (!response.ok) {
               throw new Error(
                  `Error ${response.status}: ${response.statusText}`
               );
            }

            const data = await response.json();
            setAccountNumber(data.account_number);
         } catch (error) {
            console.error("Error fetching balance:", error);
         }
      };

      fetchAccountInfo();
   }, [selectedAccountType]);

   const handleWithdraw = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("access_token");
      setIsSubmitting(true);
      console.log("Access Token:", token); // Log the access token
      if (!token) {
         console.error("No access token found");
         setIsSubmitting(false);
         return;
      }

      const response = await fetch(
         "http://127.0.0.1:8000/transactions/withdrawal",
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
               account_number: accountNumber,
               amount: parseFloat(amount),
            }),
         }
      );
      if (!response.ok) {
         const errorData = await response.json();
         console.log(errorData["error"]);
         setMessage(
            errorData["error"] || "Payment failed. Please check your amount."
         );
         setIsSubmitting(false);
         setMessage("Insufficient funds.");
      } else {
         const data = await response.json();
         console.log(data);
         setMessage("Payment successful. Redirecting to dashboard.");
         setTimeout(() => navigate("/userdashboard"), 2000);
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
                        <select
                           className="selector"
                           onChange={handleAccountTypeChange}
                           value={selectedAccountType}
                        >
                           {accountTypes.map((type) => (
                              <option key={type} value={type}>
                                 {type.charAt(0).toUpperCase() + type.slice(1)}
                              </option>
                           ))}
                        </select>
                     </div>

                     <div className="item">
                        <p className="text">Enter Amount: </p>
                        <input
                           className="payment-input"
                           type="text"
                           placeholder="Amount"
                           value={amount}
                           min="0" // No negative amounts
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

                     <div className="prototype-note">
                        <p className="text">
                           NOTE: This feature is a prototype and would typically
                           be<br></br>
                           connected to a third party service such as a rent
                           <br></br>
                           portal or other provided billing system.
                        </p>
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
                        <p className="text-right">${amount}</p>
                     </div>
                     <div className="item">
                        <p className="text-left">Transaction Fee</p>
                        <p className="text-right">${fee}</p>
                     </div>
                     <hr className="line" />
                     <div className="item">
                        <p className="text-left">Total</p>
                        <p className="text-right">${amountWithFee}</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {isModalOpen && (
            <div className="modal-overlay">
               <div className="modal-content">
                  <h3 className="modal-title">Confirm Payment</h3>
                  <p>
                     Are you sure you want to proceed with this payment of $
                     {amountWithFee}?
                  </p>
                  <div className="modal-buttons">
                     <button
                        className="modal-button confirm"
                        onClick={handleWithdraw}
                        disabled={isSubmitting}
                     >
                        Confirm Payment
                     </button>
                     <button
                        className="modal-button cancel"
                        onClick={closeModal}
                     >
                        Cancel
                     </button>
                     {message && (
                        <p
                           className={
                              message.includes("successful")
                                 ? "success-message"
                                 : "error-message"
                           }
                        >
                           {message}
                        </p>
                     )}
                  </div>
               </div>
            </div>
         )}
      </>
   );
};

export default UserPayment;
