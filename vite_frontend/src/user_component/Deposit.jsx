import React, { useState } from 'react';
import UserNavbar from "./UserNavBar";
import './styling/Formstyle.css'
const Deposit = () => {
    const [accountNumber, setAccountNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');

    const handleDeposit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/transactions/deposit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ account_number: accountNumber, amount: parseFloat(amount) })
            });
            const data = await response.json();
            setMessage(data.message || 'Deposit successful');
        } catch (error) {
            setMessage('Deposit failed. Please try again.');
        }
    };

    return (
        <>
            <UserNavbar />
            <form onSubmit={handleDeposit}>
                <h2>Deposit Funds</h2>
                <input
                    type="text"
                    placeholder="Account Number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <button type="submit">Submit Deposit</button>
            </form>
            {message && <p>{message}</p>}
        </>
    );
};
export default Deposit;
