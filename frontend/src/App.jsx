
import React from "react";

import './styles/App_Login.css';
import Login from "./components/Login";
import Home from "./components/MainPage";
import Delete from "./components/DeleteForm";
import {Route, Routes} from "react-router-dom";

const App = () => {
    
    return (
        <div className="App">
            <Routes>
                
                (<Route path="/" element={<Login />} />)
                 (<Route path="/Home" element={<Home/>} />)
                 <Route path="/Delete" element={<Delete/>}/>

            </Routes>
        </div>
    )
}

export default App;