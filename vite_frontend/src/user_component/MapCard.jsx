import React from "react";
import "./styling/MapCard.css";

const MapCard = ({ atm, onClick }) => {
   return (
      <div className="map-card" onClick={onClick}>
         <h3 className="location-title-bright">{atm.name}</h3>
         <p className="location-text-bright">{atm.address}</p>
      </div>
   );
};

export default MapCard;
