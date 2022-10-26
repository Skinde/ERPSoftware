import React from "react";
import { useState, useContext } from "react";
import { UserContext, _cookies} from "../context/UserContext"; 
import './../styles/App_Login.css';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";


const logo_style = { marginTop: '25px' }
const logo = require('./../oficial_logo.png');


const Login = () => {
    const { register, handleSubmit, getValues, formState: {errors} } = useForm();

    const [, setToken] = useContext(UserContext);


    const submitLogin = async () => {
        
            const requestOptions ={
                method: "POST",
                headers: {"Content-Type": "application/x-www-form-urlencoded",
                         'accept': 'application/json',},                
                body: JSON.stringify(
                    `grant_type=&username=${getValues("email")}&password=${getValues("password")}&scope=&client_id=&client_secret=`
                ),
            };
            
            const response =  (await fetch("http://localhost:8000/api/login", requestOptions)
            );

            if (!response.ok){
                _cookies.remove("user_Token");
            } else {
                const data = await response.json(); 
                setToken(data.access_token);
            }
        };


    const navigate = useNavigate();    
    
    const handleSubmission = (e) => {
        //e.preventDefault();
        submitLogin();
        if (_cookies.get("user_Token") != null) {
            navigate("/Home");
        }
    };    

    return (
        <div class="main-box">
            <div style={logo_style}>
                <img src={logo} width="360px" alt="Main logo" />
            </div>
    
            <header>Employee Login</header>
            
            <form onSubmit={handleSubmit(handleSubmission)} name="theForm">
                <div className="ui form">
                    <div className="txt_field">
                        <input class="input_e"  {...register("email", {required: true} )}/>                        
                        <span class="bar-line"></span>
                        

                    </div>
                     
    
                    <div className="txt_field">
                        <input class="input_e" type="password" {...register("password", {required: true})} />                        
                        <span class="bar-line"></span>
                        
                    </div>
                    
                </div>
                
                <input type="submit" value="Login" />
            </form>
        </div>
        )
}
export default Login;