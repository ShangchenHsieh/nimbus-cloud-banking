import React, { useState } from 'react';
import UserNavbar from "./UserNavBar";
import { useNavigate } from 'react-router-dom';
import './styling/Deposit.css';

const Deposit = () => {
    const sourceAccountNumber = localStorage.getItem("currentAccountNumber");
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [checkNum, setCheckNum] = useState('');
    const [checkImage, setCheckImage] = useState(null); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleDeposit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        if (!checkNum) {
            setMessage("Please enter a valid check number.");
            setIsSubmitting(false);
            return;
        }

        if (!amount || parseFloat(amount) <= 0) {
            setMessage("Please enter a valid amount.");
            setIsSubmitting(false);
            return;
        }

        const token = localStorage.getItem('access_token');
        if (!token) {
            console.error("No access token found");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/transactions/deposit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    account_number: sourceAccountNumber,
                    amount: parseFloat(amount),
                    check_number: checkNum,
                }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                if (responseData.error && responseData.error.includes("already been used")) {
                    setMessage("This check number has already been used.");
                } else {
                    setMessage(responseData.error || "Deposit failed. Please try again.");
                }
                setIsSubmitting(false);
            } else {
                setMessage("Deposit successful. Redirecting to dashboard...");
                setTimeout(() => navigate('/userdashboard'), 2000);
            }
        } catch (error) {
            console.error("Error during deposit:", error);
            setMessage("Deposit failed. Please try again.");
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCheckImage(URL.createObjectURL(file)); 
            setMessage('');
        }
    };

    return (
        <>
            <UserNavbar />
            <div>
                <form onSubmit={handleDeposit} className="deposit-container">
                    <h2 className="deposit-title">Deposit Funds</h2>
                    <input
                        type="text"
                        placeholder="Account Number"
                        value={sourceAccountNumber}
                        readOnly
                    />
                    <input
                        type="text"
                        placeholder="Check Number"
                        value={checkNum}
                        onChange={(e) => setCheckNum(e.target.value)}
                        className="no-arrows"
                    />
                    <input
                        type="text"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*\.?\d{0,2}$/.test(value)) {
                                setAmount(value);
                            }
                        }}
                        className="no-arrows"
                    />
                    <button type="submit" disabled={isSubmitting}>Submit Deposit</button>
                </form>

                <div className="deposit-file-upload">
                    <input type="file" accept="image/*" id="fileUpload" onChange={handleImageUpload} />
                    <label htmlFor="fileUpload">Upload Check Image</label>
                </div>

                {checkImage && (
                    <div className="deposit-image-preview">
                        <h3>Check Image Preview:</h3>
                        <img src={checkImage} alt="Check Preview" />
                    </div>
                )}

                {message && <p className="deposit-message">{message}</p>}
            </div>
        </>
    );
};

export default Deposit;
