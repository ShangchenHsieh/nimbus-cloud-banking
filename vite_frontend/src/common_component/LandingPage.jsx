import Navbar from "./Navbar";
import './styling/LandingPage.css';
import icon from "../assets/icon.png";

const LandingPage = () => {
    return (
        <div className="landing-container">
            <Navbar />
            <div className="content">
            <img src={icon} alt="Logo" />
                <div className="landing-left">
                    <h1 className="comfortaa-font">Nimbus</h1>
                </div>
            </div>
            <h1>Welcome to Nimbus Online Banking Services</h1>
                    <p>This is really nice.</p>
        </div>
    );
};

export default LandingPage;
