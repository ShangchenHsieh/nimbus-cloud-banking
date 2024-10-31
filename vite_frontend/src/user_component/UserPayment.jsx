import React, { useState } from "react";
import UserNavbar from "./UserNavBar";
import "./styling/UserPayment.css";

const UserPayment = () => {
   const [isModalOpen, setIsModalOpen] = useState(false);

   const openModal = () => {
      setIsModalOpen(true);
   };

   const closeModal = () => {
      setIsModalOpen(false);
   };

   const confirmPayment = () => {
      console.log("Payment confirmed");
      closeModal();
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
               </div>
            </div>
         )}
      </>
   );
};

export default UserPayment;
