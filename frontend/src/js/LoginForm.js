import React from "react";
import './../styles/App_Login.css';

const logo_style = { marginTop: '50px' }
const logo = require('./../oficial_logo.png');

function LoginForm() {
    return (
    <div class="main_login_box">
        <div style={logo_style}>
            <img src={logo} width="440px" alt="Main logo" />
        </div>

        <form class="form" name="e_form" id="form1" required>
            <input type="text" required="required" name="a" id="aa"/>
                <label class="lbl-nombre">
                    <span class="text-nomb">Email Adrress</span>
                </label>
        </form>

        <form class="form" name="p_form" id="form2" required>
            <input type="password" required="required" name="b" id="bb"/>
                <label class="lbl-nombre">
                    <span class="text-nomb">Password</span>
                </label>
        </form>

        <button id="s_button" class="button-64" type="submit" onClick={submitForm}>
            <span class="text">Log In</span>
        </button>
    </div>
    )
}

document.addEventListener("keypress", function(e) {
    var f1 = document.forms.form1.a.value;
    var f2 = document.forms.form2.b.value;

})

// Hiding Pop-up
document.addEventListener('invalid', (function () {
    return function (e) {
      e.preventDefault();
      document.getElementById("name").focus();
    };
})(), true);

function submitForm() {
    if (document.forms.form1.a.value !== "" && document.forms.form2.b.value !== "") {
        document.getElementById("form1").submit();
        document.getElementById("form2").submit();
        return true;
    }
    return false;
}

export default LoginForm;