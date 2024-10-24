import UserNavbar from "./UserNavBar";
import "./styling/UserPayment.css";

const UserPayment = () => {
   return (
      <>
         <UserNavbar></UserNavbar>
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
                  <button className="pay-now-button">Pay Now</button>
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
                     <hr className="line"></hr>
                     <div className="item">
                        <p className="text-left">Total</p>
                        <p className="text-right">$40.00</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default UserPayment;
