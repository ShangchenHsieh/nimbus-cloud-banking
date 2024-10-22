import React, { useEffect, useState } from 'react';
import UserNavbar from "./UserNavBar";
import { useJsApiLoader, GoogleMap, InfoWindow, LoadScript, MarkerF } from '@react-google-maps/api';


const SearchATMs = () => {

   const [startingAddress, setStartingAddress] = useState('');
   const [atmLocations, setAtmLocations] = useState([]);
   const [currentATM, setCurrentATM] = useState(null);
   const apiKey = import.meta.env.VITE_MAPS_API_KEY;

   const submitAddress = async (e) => {
      e.preventDefault();
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: startingAddress}),
      };

      const response = await fetch('http://127.0.0.1:8000/maps/searchATMs/', requestOptions);
      const data = await response.json();
      if (response.status === 409) {
         console.error('Error submitting address:', data);
      }
      else {
         setAtmLocations(data.ATMs);
         setStartingAddress('');
         console.log('Submitted Value:', startingAddress)
         console.log('ATM data:', data.ATMs);
      }
   };

   const mapContainerStyle = {
      height: '500px',
      width: '100%',
   };

   let mapCenter = { lat: 37.3352, lng: -121.8811 };
   if (atmLocations.length > 0) {
      mapCenter = {
         lat: atmLocations[0].lat,
         lng: atmLocations[0].lng
       }; 
   }

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

         <div>
         {atmLocations.length > 0 && (
         <LoadScript googleMapsApiKey={apiKey}>
               <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={14}
               >
                  {atmLocations.map((atm, index) => (
                     <MarkerF
                        key={index}
                        position={{ lat: atm.lat, lng: atm.lng }}
                        title={atm.address}
                        onClick={() => setCurrentATM(atm)}
                     />
                  ))}
                  {currentATM && (
                     <InfoWindow
                        position={{ lat: currentATM.lat, lng: currentATM.lng }}
                        onCloseClick={() => setCurrentATM(null)}
                     >
                        <div>
                           <h2>{currentATM.name}</h2>
                           <p>{currentATM.address}</p>
                        </div>
                     </InfoWindow>
                  )}
               </GoogleMap>
            </LoadScript>
         )}
         </div>
      </>
   );
};

export default SearchATMs;
