import React, { useContext, useState, useEffect } from 'react';
import UserNavbar from "./UserNavBar";
import { jwtDecode } from "jwt-decode";
import { UserContext } from '../user_context/UserContext';
import { useNavigate } from 'react-router-dom';
import './styling/Deposit.css'

const Deposit = () => {
    const sourceAccountNumber = localStorage.getItem("currentAccountNumber");
    const [accountNumber, setAccountNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [checkNum, setCheckNum] = useState('');
    const [checkImage, setCheckImage] = useState(null); // State to hold the check image
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAccountNumber = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) {
                console.error("No access token found");
                return;
            }

            try {
                const decodedToken = jwtDecode(token);
                const id = decodedToken.user_id;

                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                };

                const response = await fetch(`http://127.0.0.1:8000/account/account-number/${id}/`, requestOptions);
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                const data = await response.json();
                setAccountNumber(sourceAccountNumber);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchAccountNumber();
    }, []);

    const handleDeposit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        setIsSubmitting(true);
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
                body: JSON.stringify({ account_number: accountNumber, amount: parseFloat(amount) })
            });
            if (!response.ok) {
                setMessage('Please enter a valid amount.');
                setIsSubmitting(false);
            } else {
                const data = await response.json();
                console.log(data);
                navigate('/userdashboard');
            }
        } catch (error) {
            setMessage('Deposit failed. Please try again.');
            setIsSubmitting(false);
        }
    };

    // Handler for image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCheckImage(URL.createObjectURL(file)); // Create a preview URL for the image
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
                        value={accountNumber}
                        readOnly
                    />
                    <input
                        type="text"
                        placeholder="Check Number"
                        value={checkNum}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) { // Only allow digits
                                setCheckNum(value);
                            }
                        }}
                        onKeyDown={(e) => {
                            if (["e", "E", "+", "-", "."].includes(e.key)) { // Prevent scientific notation or invalid symbols
                                e.preventDefault();
                            }
                        }}
                        className="no-arrows"
                    />

                    <input
                        type="text"
                        placeholder="Amount"
                        value={amount}
                        min="0" // No negaive amounts
                        step="0.01" // Allow decimal values
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*\.?\d{0,2}$/.test(value)) {
                                setAmount(value);
                            }
                        }}
                        onKeyDown={(e) => {
                            if (["e", "E", "+", "-", "."].includes(e.key) && e.target.value === "") {
                                e.preventDefault();
                            }
                        }}
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
