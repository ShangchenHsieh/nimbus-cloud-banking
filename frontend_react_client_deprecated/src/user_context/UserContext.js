import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';


export const UserContext = createContext();

export const UserProvider = (props) => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token"));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refresh_token"));
    const navigate = useNavigate();

    useEffect(() => {
        if(!accessToken || !refreshToken) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
           
            navigate('/');
        }
    }, [accessToken, refreshToken]);

    return (
        <UserContext.Provider value={{ accessToken, setAccessToken, refreshToken, setRefreshToken }}>
            {props.children}
        </UserContext.Provider>
    );
};