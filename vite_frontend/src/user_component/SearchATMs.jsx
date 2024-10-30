import React, { useEffect, useState } from "react";
import UserNavbar from "./UserNavBar";
import MapCard from "./MapCard";
import {
   useJsApiLoader,
   GoogleMap,
   LoadScript,
   MarkerF,
   InfoWindowF,
} from "@react-google-maps/api";
import "./styling/SearchATMs.css";

const SearchATMs = () => {
   const [startingAddress, setStartingAddress] = useState("");
   const [atmLocations, setAtmLocations] = useState([]);
   const [currentATM, setCurrentATM] = useState(null);
   const [errorMessage, setErrorMessage] = useState("");
   const apiKey = import.meta.env.VITE_MAPS_API_KEY;

   const submitAddress = async (e) => {
      e.preventDefault();

      if (!startingAddress.trim()) {
         setErrorMessage("Please enter a valid address");
         return;
      }
      setErrorMessage("");

      const requestOptions = {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ address: startingAddress }),
      };

      try {
         const response = await fetch(
            "http://127.0.0.1:8000/maps/searchATMs/",
            requestOptions
         );
         const data = await response.json();
         if (response.status === 409) {
            console.error("Error submitting address:", data);
         } else {
            setAtmLocations(data.ATMs);
            setStartingAddress("");
            console.log("Submitted Value:", startingAddress);
            console.log("ATM data:", data.ATMs);
         }
      } catch (error) {
         console.error("Error fetching data", error);
         setErrorMessage("Failed to fetch ATMs. Please try again.");
         return;
      }
   };

   const mapContainerStyle = {
      width: "calc(100% - 310px)",
      borderRadius: 10,
      marginRight: 10,
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
   };

   let mapCenter = { lat: 37.3352, lng: -121.8811 };
   if (atmLocations.length > 0) {
      mapCenter = {
         lat: atmLocations[0].lat,
         lng: atmLocations[0].lng,
      };
   }

   return (
      <>
         <UserNavbar></UserNavbar>
         <div className="maps-page-container">
            <div className="search-bar">
               <h3 className="search-title-bright">Search for Chase ATMs</h3>
               <div className="search">
                  {errorMessage && (
                     <p
                        style={{
                           color: "red",
                           margin: "0px",
                           marginRight: "10px",
                        }}
                     >
                        {errorMessage}
                     </p>
                  )}
                  <form onSubmit={submitAddress}>
                     <input
                        className="search-input"
                        type="text"
                        value={startingAddress}
                        onChange={(e) => setStartingAddress(e.target.value)}
                        placeholder="Enter your starting address"
                     />
                     <button className="search-button" type="submit">
                        Search
                     </button>
                  </form>
               </div>
            </div>
            <div
               style={{ display: atmLocations.length > 0 ? "inline" : "none" }}
            >
               <div className="map-container">
                  {atmLocations.length > 0 && (
                     <LoadScript googleMapsApiKey={apiKey}>
                        <GoogleMap
                           className="map"
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
                              <InfoWindowF
                                 position={{
                                    lat: currentATM.lat,
                                    lng: currentATM.lng,
                                 }}
                                 onCloseClick={() => setCurrentATM(null)}
                              >
                                 <div>
                                    <h3>{currentATM.name}</h3>
                                    <p>{currentATM.address}</p>
                                 </div>
                              </InfoWindowF>
                           )}
                        </GoogleMap>
                     </LoadScript>
                  )}
                  <div className="map-cards-container">
                     {atmLocations.map((atm, index) => (
                        <MapCard
                           key={index}
                           atm={atm}
                           onClick={() => setCurrentATM(atm)}
                        />
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default SearchATMs;
