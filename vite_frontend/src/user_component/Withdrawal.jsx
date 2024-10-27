import React, { useState } from 'react';
import UserNavbar from "./UserNavBar";
import './styling/Formstyle.css'

const Withdrawal = () => {
    const [accountNumber, setAccountNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');

    const handleWithdraw = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/transactions/withdrawal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ account_number: accountNumber, amount: parseFloat(amount) })
            });
            const data = await response.json();
            setMessage(data.message || 'Withdrawal successful');
        } catch (error) {
            console.log(error);
            setMessage('Withdrawal failed. Please try again.');
        }
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
export default Withdrawal;
