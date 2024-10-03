import UserNavbar from "./UserNavBar";
import "./styling/UserDashboard.css";

const UserDashboard = () => {
   return (
      <>
         <UserNavbar></UserNavbar>
         <div className="userdashboard-container">
            <div className="welcome-container">
               <h3 className="title-bright">Hello!</h3>
               <p className="text-bright">Here's your account summary</p>
            </div>
            <div className="details-container">
               <div className="details-left-container">
                  <div className="account-balance-container">
                     <h3 className="title-bright">Account Balance</h3>
                  </div>
                  <div className="account-details-container">
                     <h3 className="title">Account Details</h3>
                  </div>
               </div>
               <div className="details-right-container">
                  <div className="recent-transactions-container">
                     {/*Replace this with a dynamic component once transactions are available*/}
                     <h3 className="title">Recent Transactions</h3>
                     <div className="transaction">
                        <p className="text">Transaction #123</p>
                        <p className="text">-$164</p>
                     </div>
                     {/*Replace this with a dynamic component once transactions are available*/}
                     <div className="transaction">
                        <p className="text">Transaction #122</p>
                        <p className="text">+$592</p>
                     </div>
                     <div>
                        <p className="view-all-text">View All</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default UserDashboard;
