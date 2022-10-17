import React from "react";
import { useState, useContext } from "react";
import { UserContext} from "../context/UserContext"; 
import './../styles/App_Login.css';

const logo_style = { marginTop: '25px' }
const logo = require('./../oficial_logo.png');


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
                throw new Error(response.statusText);
            } else {
                const data = await response.json(); 
                console.log(data.access_token);
                setToken(data.access_token);
            }
        };

    





    const handleSubmit = (e) => {
        e.preventDefault();
        //setFormErrors(validate(formValues));
        //setIsSubmit(true);

        //if (isEmpty(validate(formValues))) {
            submitLogin();
        //}
    };
/*
    useEffect(() => {
        console.log(formErrors);
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            console.log(formValues);
        }
    }, [formErrors]);

    const validate = (values) => {
        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

        if (!values.email) {
            errors.email = "Email is required!";
        } else if (!regex.test(values.email)) {
            errors.email = "This is not a valid email format!";
        }
        if (!values.password) {
            errors.password = "Password is required";
        } else if (values.password.length < 4) {
            errors.password = "Password must be more than 4 characters";
        } else if (values.password.length > 10) {
            errors.password = "Password cannot exceed more than 10 characters";
        }
        return errors;
    };
    */

    return (
        <div class="main-box">
            <div style={logo_style}>
                <img src={logo} width="360px" alt="Main logo" />
            </div>
    
            <header>Employee Login</header>
            
            <form method="post" onSubmit={handleSubmit} name="theForm">
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
        )
}
export default Login;