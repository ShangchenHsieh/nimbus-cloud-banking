import React, { useState } from 'react';
import UserNavbar from "./UserNavBar";

const SearchATMs = () => {

   const [startingAddress, setStartingAddress] = useState('');

   const submitAddress = async (e) => {
      e.preventDefault();
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: startingAddress}),
      };

      // fetch request sent to correct Django URL
      const response = await fetch('http://127.0.0.1:8000/maps/searchATMs/', requestOptions);
      const data = await response.json();
      if (response.status === 409) {
         console.error('Error submitting address:', data);
      }
      setStartingAddress('');
      console.log('Submitted Value:', startingAddress);
    };

   return (
      <>
         <UserNavbar></UserNavbar>
         <h1>Search for Chase ATMs</h1>
         <form onSubmit={submitAddress}> 
            <input
                type="text"
                value={startingAddress}
                onChange={(e) => setStartingAddress(e.target.value)}
                placeholder="Enter your starting address"
            />
            <button type="submit">Search</button>
         </form>
      </>
   );
};

export default SearchATMs;
