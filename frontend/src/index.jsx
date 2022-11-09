import React from "react";

import {createRoot} from "react-dom/client";
import App from "./App";
import {UserProvider} from "./context/UserContext";
import {BrowserRouter} from "react-router-dom";

const root = createRoot(document.getElementById('root'));
root.render(    
    <UserProvider>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </UserProvider>
);