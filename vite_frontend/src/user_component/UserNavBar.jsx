import icon from "../assets/icon.png";
import { Link } from "react-router-dom";
import "./styling/UserNavBar.css";

const UserNavbar = () => {
   return (
      <div className="user-navbar">
         <div className="user-navbar-left">
            <div className="user-navbar-logo">
               <img src={icon} alt="Logo" />
            </div>
            <Link to="/" className="nimbus-link">
            <h3 style ={{position: 'relative', padding: '0px', top: '20px', color: '#0099cc', fontWeight: 'bold'}}>Nimbus</h3>
            <h4 style = {{fontSize: '13px'}}>Next-Gen banking solution</h4>
        </Link>
         </div>

         <div className="user-navbar-center">
         </div>

         <div className="user-navbar-option">
            <Link to="/userdashboard">Dashboard</Link>
         </div>
         <div className="user-navbar-option">
            <Link to="/help">Help</Link>
         </div>
         <div className="user-navbar-option">
            <Link to="/settings">Settings</Link>
         </div>
         <div className="user-navbar-option">
            <Link to="/">Logout</Link>
         </div>
      </div>
   );
};

export default UserNavbar;
