import React from 'react';
import './styling/MapCard.css';

const MapCard = ({atm, onClick}) => {
    return (
        <div className="map-card" onClick={onClick}>
            <h2 className="title-bright">{atm.name}</h2>
            <p className="text-bright">{atm.address}</p>
        </div>    
    );
};

export default MapCard;