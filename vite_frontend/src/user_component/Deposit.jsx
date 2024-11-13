import React, { useContext, useState, useEffect } from 'react';
import UserNavbar from "./UserNavBar";
import { jwtDecode } from "jwt-decode";
import { UserContext } from '../user_context/UserContext';
import { useNavigate } from 'react-router-dom';
import './styling/Deposit.css'

const Deposit = () => {
    const [accountNumber, setAccountNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [checkImage, setCheckImage] = useState(null); // State to hold the check image
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
                setAccountNumber(data.account_number[0]);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchAccountNumber();
    }, []);

    const handleDeposit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        if (!token) {
            console.error("No access token found");
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
            } else {
                const data = await response.json();
                console.log(data);
                navigate('/userdashboard');
            }
        } catch (error) {
            setMessage('Deposit failed. Please try again.');
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
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <button type="submit">Submit Deposit</button>
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
