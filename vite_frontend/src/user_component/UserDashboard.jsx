import UserNavbar from "./UserNavBar";
import UserTransaction from "./UserTransaction";
import "./styling/UserDashboard.css";

const UserDashboard = () => {
   const accountBalance = 500; // Placeholder balance value

   return (
      <>
         <UserNavbar></UserNavbar>
         <div className="userdashboard-container">
            <div className="welcome-container">
               <h3 className="title-bright">Hello!</h3>
               <p className="text-bright">Here's your account summary</p>
               <select className="account-selector">
                  <option>Checking</option>
               </select>
            </div>
            <div className="details-container">
               <div className="details-left-container">
                  <div className="account-balance-container">
                     <h3 className="title-bright">Account Balance</h3>
                     <div className="account-balance-details-container">
                        <h3 className="account-balance-title">
                           ${accountBalance}
                        </h3>
                        <button className="account-balance-statement-button">
                           View Statement
                        </button>
                     </div>
                  </div>
                  <div className="account-details-container">
                     <h3 className="title">Account Details</h3>
                  </div>
               </div>
               <div className="details-right-container">
                  <div className="recent-transactions-container">
                     <h3 className="title">Recent Transactions</h3>
                     {/*REPLACE -- Dynamically add transactions when available*/}
                     <UserTransaction id="124" amount="123"></UserTransaction>
                     <UserTransaction id="123" amount="-123"></UserTransaction>
                     <div>
                        <button className="view-all-button">View All</button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default UserDashboard;
