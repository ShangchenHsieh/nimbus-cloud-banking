import React, { useState, useEffect } from 'react';
import UserNavbar from "./UserNavBar";
import './styling/Formstyle.css';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const Withdraw = () => {
    const [accountNumber, setAccountNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate()
    useEffect(() => {
        const fetchAccountNumber = async () => {
            const token = localStorage.getItem('access_token');
            console.log("Access Token:", token); // Log the access token
            if (!token) {
                console.error("No access token found");
                return;
            }

            try {
                const decodedToken = jwtDecode(token);
                console.log("Decoded Token:", decodedToken); // Log the decoded token
                const id = decodedToken.user_id;
                console.log("User ID:", id); // Log the user ID

                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                };

                const response = await fetch(`http://127.0.0.1:8000/account/account-number/${id}/`, requestOptions);
                console.log("Response Status:", response.status); // Log response status
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                const data = await response.json();
                console.log("Fetched Data:", data); // Log the data received
                setAccountNumber(data.account_number[0]);
                console.log(accountNumber)
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchAccountNumber();
    }, []);

    const handleWithdraw = async (e) => {
        e.preventDefault();

        const response = await fetch('http://127.0.0.1:8000/transactions/withdrawal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ account_number: accountNumber, amount: parseFloat(amount) })
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData['error'])
            setMessage(errorData['error'] || 'Withdrawal failed. Please check your amount.');

        } else {
            const data = await response.json();
            console.log(data)
            setMessage(data.message || 'Withdrawal successful');
            navigate('/userdashboard')
        }

        setMessage('Withdrawal failed. Please enter valid amount.');

    };

    return (
        <>
            <UserNavbar />
            <form onSubmit={handleWithdraw}>
                <h2>Withdraw Funds</h2>
                <input
                    type="text"
                    placeholder="Account Number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    readOnly
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <button type="submit">Submit Withdrawal</button>
            </form>
            {message && <p>{message}</p>}
        </>
    );
};

export default Withdraw;
