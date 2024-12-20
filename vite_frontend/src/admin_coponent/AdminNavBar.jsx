import icon from "../assets/icon.png";
import { Link } from "react-router-dom";
import "./styling/AdminNavBar.css";

const AdminNavbar = () => {
   return (
      <div className="admin-navbar">
         <div className="admin-navbar-left">
            <div className="admin-navbar-logo">
               <Link to="/admindashboard">
                  <img src={icon} alt="Logo" />
               </Link>
            </div>
            <h3>Nimbus</h3>
         </div>
         <div className="admin-navbar-center"></div>
         <div className="admin-navbar-option">
            <Link to="/admindashboard">Dashboard</Link>
         </div>
         <div className="admin-navbar-option">
            <Link to="/">Logout</Link>
         </div>
      </div>
   );
};

export default AdminNavbar;
