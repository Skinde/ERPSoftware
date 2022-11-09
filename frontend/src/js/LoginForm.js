import React from "react";
import { useState, useEffect } from "react";
import './../styles/App_Login.css';

const logo_style = { marginTop: '25px' }
const logo = require('./../oficial_logo.png');

function isEmpty(obj) {
    for (const property in obj) {
        return false;
    }
    return true;
}

const LoginForm = () => {
    const initialValues = { email: "", password: "" };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));
        setIsSubmit(true);

        if (isEmpty(validate(formValues))) document.theForm.submit();
    };

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

    return (
    <div class="main-box">
        <div style={logo_style}>
            <img src={logo} width="360px" alt="Main logo" />
        </div>

        <header>Employee Login</header>
        
        <form method="post" onSubmit={handleSubmit} name="theForm">
            <div className="ui form">
                <div className="txt_field">
                    <input class="input_e" type="text" name="email" placeholder="Email" value={formValues.email} onChange={handleChange}/>
                    <span class="bar-line"></span>
                </div>
                <p class="error">{formErrors.email}</p>

                <div className="txt_field">
                    <input class="input_e" type="password" name="password" placeholder="Password" value={formValues.password} onChange={handleChange}/>
                    <span class="bar-line"></span>
                </div>
                <p class="error">{formErrors.password}</p>
            </div>
            
            <input type="submit" value="Login" />
        </form>
    </div>
    )
}



export default LoginForm;