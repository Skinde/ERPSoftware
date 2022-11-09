import React from "react";
import { useState, useContext } from "react";
import { UserContext, _cookies} from "../context/UserContext"; 
import './../styles/App_Login.css';
import { useNavigate } from "react-router-dom";

const logo = require('./../oficial_logo.png');
const inv_image = require('./../logistics.png');

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    /*const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);*/
    const [, setToken] = useContext(UserContext);

    const submitLogin = async () => {
        
            const requestOptions ={
                method: "POST",
                headers: {"Content-Type": "application/x-www-form-urlencoded",
                         'accept': 'application/json',},                
                body: JSON.stringify(
                    `grant_type=&username=${email}&password=${password}&scope=&client_id=&client_secret=`
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
    
    const handleSubmit = (e) => {
        e.preventDefault();
        submitLogin();
        if (_cookies.get("user_Token") != null) {
            navigate("/Home");
        }
    };    

    return (
        <section className="all-login-wrapper">
            
            <div className="in-flex-login">
                <div className="login-image-wrapper">
                    <img className="login-img-1" src={inv_image} alt="."/>
                </div>
            </div>

            <div className="in-flex-login">
                <div className="login-box">
                    <div>
                        <img className="logo-img-2" src={logo} alt="."/>
                    </div>

                    <header>Employee Login</header>

                    <form onSubmit={handleSubmit} name="theForm">
                        <div className="ui form">
                            <div className="txt_field">
                                <input class="input_e" type="text" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                                <span class="bar-line"></span>
                            </div>
                            
                            <div className="txt_field">
                                <input class="input_e" type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                                <span class="bar-line"></span>
                            </div>
                            
                        </div>
                        
                        <input type="submit" value="Login" />
                    </form>
                </div>
            </div>

        </section>
    )
}
export default Login;