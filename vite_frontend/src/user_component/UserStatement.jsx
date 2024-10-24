import UserNavbar from "./UserNavBar";
import icon from "../assets/icon.png";
import "./styling/UserStatement.css";

const UserStatement = () => {
   return (
      <>
         <UserNavbar></UserNavbar>
         <div className="userstatement-container">
            <h3 className="title">Monthly Bank Statement</h3>
            <div className="userstatement-details-container">
               <div className="logo-container">
                  <img className="logo" src={icon} alt="Logo" />
                  <h3 className="title">Nimbus Cloud Banking</h3>
                  <p className="text-right">Generation Date: {Date()}</p>
               </div>
               <h3 className="title">Account Holder</h3>
               <hr className="line"></hr>
               <div className="item">
                  <p className="text-left">Name</p>
                  <p className="text-right">Ava Cado</p>
               </div>
               <div className="item">
                  <p className="text-left">Address</p>
                  <p className="text-right">123 Example Street, San Jose, CA</p>
               </div>
               <h3 className="title">Activity Summary</h3>
               <hr className="line"></hr>
               <div className="item">
                  <p className="text-left">Transfers</p>
                  <p className="text-right">$1500</p>
               </div>
               <div className="item">
                  <p className="text-left">Deposits</p>
                  <p className="text-right">$2000</p>
               </div>
               <h3 className="title">Account Status</h3>
               <hr className="line"></hr>
               <div className="item">
                  <p className="text-left">Current Balance</p>
                  <p className="text-right">$500</p>
               </div>
               <div className="item">
                  <p className="text-left">Monthly Balance Change</p>
                  <p className="text-right">+$500</p>
               </div>
            </div>
         </div>
      </>
   );
};

export default UserStatement;
