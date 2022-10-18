import React from "react";
import './../styles/Main_page.css';
import { useNavigate } from "react-router-dom";

const l_icon_style = {marginTop: '6px'}
const l_icon = require('./../icon_logo.png');

const MainPage = () => {

    const navigate = useNavigate();
    const handleClickLogOut = (e) => { navigate("/"); }

    return (
        <div class="wrapper">
            <div class="image_wrapper">
                <div class="side_image">
                    <div style={l_icon_style}>
                        <img src={l_icon} width="125px" alt="Side Icon"/>
                    </div>
                </div>

                <button class="logout-button" onClick={handleClickLogOut}>
                    <span class="glyphicon glyphicon-log-out"></span> Log Out
                </button>
            </div>

            <form class="all-inputs">
                <div class = "first-row">
                    <select name="t_product">
                        <option value="" selected disabled>Type</option>
                        <option value="value_1">Book</option>
                        <option value="value_2">Toy</option>
                    </select>
                    
                    <input class="input_1" type="text" placeholder="Author"/>
                    <input class="input_1" type="text" placeholder="Book Tittle"/>
                </div>

                <div class = "second-row">
                    <input type="text" placeholder="Publisher"/>
                    <input type="text" placeholder="Edition"/>

                    <select name="t_product">
                        <option value="" selected disabled>Genre</option>
                        <option value="value_1">Action</option>
                        <option value="value_2">Adventure</option>
                    </select>
                </div>

                <div class="third-row">
                    <input type="text" placeholder="Year"/>
                    <input type="text" placeholder="ISBN"/>
                </div>

                <input type="submit" value="Search"/>
            </form>

            <div class="Results-Wrapper">

            </div>
        </div>
    )
}

export default MainPage;