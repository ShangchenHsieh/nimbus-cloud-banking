import AdminNavbar from "./AdminNavBar.jsx";
import AdminTransaction from "./AdminTransaction.jsx";
import "./styling/AdminDashboard.css";

const AdminDashboard = () => {
   return (
      <>
         <AdminNavbar></AdminNavbar>
         <div className="admindashboard-container">
            <div className="welcome-container">
               <h3 className="title-bright">Hello!</h3>
               <p className="text-bright">Welcome to the admin dashboard</p>
            </div>
            <div className="details-container">
               <div className="details-left-container">
                  <div className="user-account-details-container">
                     <h3 className="title">User Account Details</h3>
                     <div className="user-account-holder-details-container">
                        <h3 className="title">User Account Holder</h3>
                        <p className="account-details-text">Name: Ava Cado</p>
                        <p className="account-details-text">
                           Phone: +1 (555) 555-5555
                        </p>
                        <p className="account-details-text">
                           Email: ava.cado@example.com
                        </p>
                        <p className="account-details-text">
                           Address: 123 Example Street, San Jose, CA
                        </p>
                     </div>
                  </div>
                  <div className="user-activity-container">
                     <h3 className="title">User Activity</h3>
                     {/*REPLACE -- Dynamically add transactions when available*/}
                     <AdminTransaction id="124" amount="123"></AdminTransaction>
                     <AdminTransaction
                        id="123"
                        amount="-123"
                     ></AdminTransaction>
                     <button className="view-all-button">View All</button>
                  </div>
               </div>
               <div className="details-right-container">
                  <div className="user-search-container">
                     <h3 className="title">Users</h3>
                     <input
                        className="user-search-input"
                        placeholder="Search"
                     ></input>
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

export default AdminDashboard;
