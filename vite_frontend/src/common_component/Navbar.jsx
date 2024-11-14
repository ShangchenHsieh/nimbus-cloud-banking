import icon from "../assets/icon.png"
import { Link } from 'react-router-dom';
import "./styling/Navbar.css"


const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-left">

        <div className="navbar-logo" >
          <Link to='/'>
            <img src={icon} alt="Logo" />
          </Link>
        </div>

        <Link to="/" className="nimbus-link">
          <h3 style ={{position: 'relative', padding: '0px', top: '20px', color: '#0099cc', fontWeight: 'bold'}}>Nimbus</h3>
          <h4 style = {{fontSize: '13px'}}>Next-Gen banking solution</h4>
        </Link>

      </div>
      <div className="navbar-center">
        <div className="navbar-options">
          <Link to="/">Home</Link>
          <Link to="/news">News</Link>
          <Link to="/Q&A">Frequent Q&A</Link>

          <Link to="/about">About Us</Link>

          <Link to="/contact">Contact Us</Link>
        </div>
      </div>
      <div className="navbar-login">
        <Link to="/signup">Sign Up</Link>
      </div>
      <div className="navbar-login">
        <Link to="/login">Login</Link>
      </div>

    </div>
  );
}

export default Navbar;