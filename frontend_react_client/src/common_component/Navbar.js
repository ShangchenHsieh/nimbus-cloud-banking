import icon from "../assets/icon.png"
import { Link } from 'react-router-dom';
import "./styling/Navbar.css"


const Navbar = () => {
    return (
      <div className="navbar">
        <div className="navbar-left">
          <div className="navbar-logo">
              <img src={icon} alt="Logo" /> 
          </div>
          <h3>Nimbus</h3>
        </div>
        <div className="navbar-center">
          <div className="navbar-options">
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/Q&A">Frequent Q&A</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        <div className="navbar-login">
          <Link to="/login">Login</Link>
        </div>
        <div className="navbar-login">
          <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    );
  }
  
  export default Navbar;