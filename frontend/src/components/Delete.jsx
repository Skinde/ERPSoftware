import React, { useContext, useState } from "react";
import './../styles/Delete.css';
import { useNavigate } from "react-router-dom";
import { UserContext, _cookies } from "../context/UserContext";

const l_icon_style = {marginTop: '6px'}
const l_icon = require('./../oficial_icon.png');

const DeletePage = () => {
    const [type, settype] = useState("");
    const [uuid, setuuid] = useState("");
    const [token] = useContext(UserContext);
    const options = [ {value: "Book", label: "Book"},
                      {value: "Toy",  label: "Toy"},
                      {value: "", label: ""}
                    ]
    const navigate = useNavigate();
    const elim_element = async () => {
        const requestOptions ={
            method: "POST",                
            headers: {
                "accept": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                type: {type},
                uuid: {uuid}
            })           
        };
        const response =  (await fetch("http://localhost:8000/api/delete", requestOptions)
            );
        console.log(response.json());
    }
    


    const handleClickLogOut = (e) => { 
        _cookies.remove("user_Token");
        navigate("/"); }

    const handleDelete = (e) => {
        navigate("/delete");
    }

    const handlechangetype = (e) => {
        settype(e.target.value);
    }

    return (
        <div class="wrapper">
            <div class="image_wrapper">
                <div class="side_image">
                    <div style={l_icon_style}>
                        <img src={l_icon} width="125px" alt="Side Icon"/>
                    </div>
                </div>
		        <button class="delete-button" onClick={handleDelete}>
			        Delete
	    	    </button>
                <button class="logout-button" onClick={handleClickLogOut}>
                    <span class="glyphicon glyphicon-log-out"></span> Log Out
                </button>
            </div>

            <form class="all-inputs">
                <div class = "first-row">
                    <select name="t_product" value={type} onchange={settype} onChange={handlechangetype}>
                        {options.map((option) => (
                            <option value={option.value}>{option.label}</option>
                        ))}   
                    </select>
                    
                    <input class="input_1" value={uuid}  type="text" placeholder="UUID" onChange={(e) => setuuid(e.target.value)}/>
                </div>


                <input type="submit" value="Delete" onClick={elim_element}/>
            </form>

            <div class="Results-Wrapper">

            </div>
        </div>
    )
}

export default DeletePage;