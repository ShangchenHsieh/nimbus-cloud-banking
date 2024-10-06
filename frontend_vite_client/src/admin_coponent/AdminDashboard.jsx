import AdminNavbar from "./AdminNavBar.jsx";
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
                  </div>
                  <div className="user-activity-container">
                     <h3 className="title">User Activity</h3>
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
