import Navbar from "./Navbar";
import './styling/LandingPage.css';
import icon from "../assets/icon.png";
import check from "../assets/1339484-200.png"

const LandingPage = () => {
    return (
        <div className="landing-container">
            <Navbar />
            <div className="content">
                <img src={icon} alt="Logo" />
                <div className="landing-left">
                    <h1 style={{ marginLeft: '10px', marginTop: '35px', padding: '0px', position: 'relative', bottom: '-25px', color: '#0099cc', fontWeight: '500' }}> Nimbus</h1>
                    <h2 style={{ marginLeft: '10px', fontSize: '45px', marginBottom: '50px', position: 'relative', padding: '0px', color: 'white', fontWeight: '400' }}> Next-gen banking solutions</h2>
                </div>
            </div>
            <h1 style={{ fontSize: '50px', position: 'relative', padding: '0px', top: '-40px', fontWeight: 'bold', color: 'white', fontWeight: '400px' }}>Welcome to Nimbus Online Banking Services</h1>
            <div className="banner">
                <p style={{ position: 'relative', padding: '0px', marginRight: '1000px', marginBottom: '220px', fontSize: '50px', top: '70px', fontWeight: 'bold' }}>Free</p>
                <p style={{ position: 'relative', padding: '0px', marginRight: '1025px', marginBottom: '-150px', fontSize: '110px', top: '-160px', fontWeight: 'bold' }}>$100</p>
                <p style={{ position: 'relative', padding: '0px', fontSize: '32px', top: '-160px' }}>When you create a new checking</p>
                <p style={{ position: 'relative', padding: '0px', fontSize: '32px', top: '-160px' }}>with us. For new customers only</p>
                <p style={{ position: 'relative', padding: '0px', fontSize: '10px', top: '-160px' }}>Terms and conditions apply</p>

            </div>
            <div className="why">
                <div className="why-left">
                    <h1 style={{ fontWeight: 'bold' }}>Why Nimbus?</h1>
                </div>
                <div className="why-right">
                    <ul>
                        <li>No fees to start any account</li>
                        <li>Top-notch security</li>
                        <li>24/7 simple access to our services for your convenience</li>
                        <li>Create an account in under 15 minutes</li>
                        <li>Start with any amount - even a dollar</li>
                        <li>Mobile app to keep in touch better</li>
                        <li>Access to over 15,000 ATMs without any fees, thanks to our partner Chase</li>
                        <li>Track and budget your money with behavior insights</li>
                    </ul>
                </div>
            </div>
            <div className="checkingBanner">
                <img className="checking-image" src={check} style={{ position: 'relative', padding: '0px', marginTop: '12px', top: '30px' }} />
                <p style={{ position: 'relative', padding: '0px', fontSize: '50px', top: '-10px', fontWeight: 'bold' }}>Our checking account</p>

                <div className="features">
                    <div className="feature-item">
                        <img src="https://i.imgur.com/sgSxqso.png" />
                        <p style={{ position: 'relative', padding: '0px', fontSize: '22px', top: '-10px', fontWeight: 'bold' }}>Send and receive money instantly</p>
                    </div>
                    <div className="feature-item">
                        <img src="https://i.imgur.com/i5DCwBU.png" />
                        <p style={{ position: 'relative', padding: '0px', fontSize: '28x', top: '0px', fontWeight: 'bold' }}>No chase fees at ATMs</p>
                    </div>
                    <div className="feature-item">
                        <img src="https://i.imgur.com/A0Zd9kn.png" />
                        <p style={{ position: 'relative', padding: '0px', fontSize: '22px', top: '-22px', fontWeight: 'bold' }}>No minimum deposit</p>
                    </div>
                    <div className="feature-item">
                        <img src="https://i.imgur.com/ABpLB7X.png" />
                        <p style={{ position: 'relative', padding: '0px', fontSize: '22px', top: '-25px', fontWeight: 'bold' }}>Autopay for recurring purchases</p>
                    </div>
                </div>
            </div>
            <div className="savingsBanner">
                <img className="savings-image" src="https://i.imgur.com/3NvCQYa.png" alt="Savings Account" style={{ position: 'relative', padding: '0px', marginTop: '12px', top: '35px' }} />
                <p style={{ position: 'relative', padding: '0px', fontSize: '50px', top: '-15px', fontWeight: 'bold' }}>Our savings account</p>

                <div className="savings-features">
                    <div className="savings-feature-item" style={{ position: 'relative', padding: '0px', top: '-60px' }}>
                        <img src="https://i.imgur.com/82tm4xE.png" alt="Competitive Interest Rate" />
                        <p style={{ fontSize: '22px', fontWeight: 'bold' }}>Competitive 4%* Interest rate</p>
                        <p style={{ fontSize: '16px', color: '#555', fontWeight: 'bold' }}>make your money work for you</p>
                    </div>
                    <div className="savings-feature-item" style={{ position: 'relative', padding: '0px', top: '-32px' }}>
                        <img src="https://i.imgur.com/h24YnMm.png" alt="No Minimum Balance" />
                        <p style={{ fontSize: '22px', fontWeight: 'bold' }}>No minimum balance needed</p>
                        <p style={{ fontSize: '16px', color: '#555', fontWeight: 'bold' }}>Start with any amount!</p>
                    </div>
                    <div className="savings-feature-item" style={{ position: 'relative', padding: '0px', top: '-44px' }}>
                        <img src="https://i.imgur.com/qjm3tPQ.png" alt="Automatic Transfer" />
                        <p style={{ fontSize: '22px', fontWeight: 'bold' }}>Set up automatic transfer</p>
                        <p style={{ fontSize: '16px', color: '#555', fontWeight: 'bold' }}>grow your personal savings passively</p>
                    </div>
                    <div className="savings-feature-item" style={{ position: 'relative', padding: '0px', top: '-58px' }}>
                        <img src="https://i.imgur.com/Dw2PSND.png" alt="No Fees" />
                        <p style={{ fontSize: '22px', fontWeight: 'bold' }}>No fees</p>
                        <p style={{ fontSize: '16px', color: '#555', fontWeight: 'bold' }}>We are here to grow your money, not take it</p>
                    </div>
                </div>
            </div>
            <div className="mobileBanner">
                <p style={{ fontSize: '50px', fontWeight: 'bold' }}>Access your finances on the go</p>
            </div>
            <div className="mobile">
                <div className="mobile-left">
                    <p style={{ fontWeight: 'bold' }}>Download our app to seamlessly manage all your accounts on the go. Our mobile app helps you keep in touch with your money.</p>
                </div>
                <div className="mobile-right">
                    <p>image of the mobile client here when we have</p>
                </div>
            </div>
            <div className="ATM">
                <div className="ATM-left">
                    <img src="https://i.imgur.com/L8CHJtx.png" style={{ position: 'relative', padding: '0px', width: '145px', height: 'auto', top: '10px', right: '-140px' }}></img>
                    <p>picture of ATM and button to search for atms here</p>
                </div>
                <div className="ATM-right">
                    <p style={{ position: 'relative', padding: '0px', fontWeight: 'bold', fontSize: '40px', top: '-20px', right: '-40px' }}> Need to pay in cash? </p>
                    <p style={{ position: 'relative', padding: '0px', fontWeight: 'bold', fontSize: '30px', top: '-20px' }}>Thanks to our partner chase, you can pay no ATM fees in over 15,000 locations</p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
