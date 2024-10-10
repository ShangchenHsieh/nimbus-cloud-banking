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
            <h3>Nimbus</h3>
         </div>

         <div className="user-navbar-center">
         </div>

         <div className="user-navbar-option">
            <Link to="">Help</Link>
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
