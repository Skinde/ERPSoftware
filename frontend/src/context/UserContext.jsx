
import React, {createContext, useEffect, useState} from "react";

import Cookies from "universal-cookie";
export const UserContext = createContext();
export const _cookies = new Cookies();

export const UserProvider = (props) => {
    const [token, setToken] = useState(_cookies.get("user_Token"));

    useEffect(() =>{
        const fetchUser = async () => {
            const requestOptions = {
                method: "GET",                
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            };

            const response = await fetch("http://localhost:8000/api/me", requestOptions);


            if (!response.ok) {            
                setToken(null);
            }            
            _cookies.set("user_Token", token);
        };
        fetchUser();
    }, [token]);    
    
    return (
        <UserContext.Provider value={[token, setToken]}>
            {props.children}
        </UserContext.Provider>
    )    
};