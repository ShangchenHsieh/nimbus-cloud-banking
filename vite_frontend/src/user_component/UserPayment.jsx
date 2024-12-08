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
   const [recurringPayments, setRecurringPayments] = useState([]);
   const [error, setError] = useState("");

   const [payDate, setPayDate] = useState("");
   const handleDateChange = (event) => {
      setPayDate(event.target.value);
   };
   const [recurringDays, setRecurringDays] = useState("");

   const navigate = useNavigate();

   const openModal = () => {
      setError("");
      if (amount === "") {
         setError("Error: Please enter an amount");
         return;
      } else if (amount === "0") {
         setError("Error: Please enter a valid amount");
         return;
      } else if (payDate === "") {
         setError("Error: Please enter a date");
         return;
      } else if (recurringDays === "") {
         setError("Error: Please enter a recurring day interval");
         return;
      } else if (recurringDays === "0") {
         setError("Error: Please enter a valid recurring day interval");
         return;
      }
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

   useEffect(() => {
      const fetchRecurringPayments = async () => {
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
               `http://127.0.0.1:8000/transactions/active-recurring-payments/${accountNumber}/`,
               requestOptions
            );

            if (!response.ok) {
               throw new Error(
                  `Error ${response.status}: ${response.statusText}`
               );
            }

            const data = await response.json();
            setRecurringPayments(data);
         } catch (error) {
            console.error("Error fetching recurring payments:", error);
         }
      };

      if (accountNumber) {
         fetchRecurringPayments();
      }
   }, [accountNumber]);

   const handlePayment = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("access_token");
      setIsSubmitting(true);
      if (!token) {
         console.error("No access token found");
         setIsSubmitting(false);
         return;
      }

      const response = await fetch(
         "http://127.0.0.1:8000/transactions/recurring-payment",
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
               account_number: accountNumber,
               amount: parseFloat(amount),
               next_payment_date: payDate,
               interval_days: recurringDays,
            }),
         }
      );
      const responseData = await response.json();
      if (!response.ok) {
         if (responseData.error && responseData.error.includes("insufficient funds")) {
            setMessage("Insufficient funds.");
         } else {
            setMessage(responseData.error || "Payment failed. Please try again.");
         }
         setIsSubmitting(false);
      } else {
         setMessage("Payment successful. Redirecting to dashboard.");
         setIsModalOpen(false); 
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
                           min="0"
                           step="0.01"
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
                     <div className="item">
                        <p className="text">Enter first payment date: </p>
                        <input
                           type="date"
                           placeholder="MM / DD / YYYY"
                           id="pay-date"
                           className="date-input"
                           value={payDate}
                           onChange={handleDateChange}
                        />
                     </div>
                     <div className="item">
                        <p className="text">
                           Enter recurring payment interval (in days):{" "}
                        </p>
                        <input
                           className="recurring-input"
                           type="text"
                           placeholder="Days"
                           value={recurringDays}
                           onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d*$/.test(value)) {
                                 setRecurringDays(value);
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

                     <div className="recurring-payments-container">
                        <h3 className="title">Recurring Payments</h3>
                        {recurringPayments.length > 0 ? (
                           <div className="recurring-payments-table-container">
                              <table className="recurring-payments-table">
                                 <thead>
                                    <tr>
                                       <th>Amount</th>
                                       <th>Next Payment Date</th>
                                       <th>Interval (Days)</th>
                                       <th>Status</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {recurringPayments.map((payment) => (
                                       <tr key={payment.id}>
                                          <td>${payment.amount}</td>
                                          <td>{payment.next_payment_date}</td>
                                          <td>{payment.interval_days}</td>
                                          <td>
                                             {payment.is_active
                                                ? "Active"
                                                : "Inactive"}
                                          </td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           </div>
                        ) : (
                           <p className="text" style={{ padding: "12px" }}>
                              No recurring payments found.
                           </p>
                        )}
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

                     <div>
                        <p
                           className="text"
                           style={{
                              display: error === "" ? "none" : "block",
                              color: "red",
                              padding: "12px",
                           }}
                        >
                           {error}
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
                        onClick={handlePayment}
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
