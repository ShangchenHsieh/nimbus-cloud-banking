import AdminNavbar from "./AdminNavBar";
import "./styling/AdminUserTransactions.css";

const AdminUserTransactions = () => {
   return (
      <>
         <AdminNavbar />
         <div className="adminusertransactions-container">
            <h3 className="title">Transaction History</h3>
         </div>
      </>
   );
};

export default AdminUserTransactions;
