const axios = require('axios');
const dotenv = require('dotenv');
const express = require('express');
dotenv.config();

const app = express();

app.use(express.json());
app.set('port', process.env.PORT || 8001);

const isNumeric = (value) => /(\d+(?:\.\d+)?)/.test(value);

app.get('/', async (req, res) => {  
    // console.log(req.body);
    console.log(req.headers.authorization);

    res.json({
        running: true
    });
})

app.post('/', async (req, res) => {
    // console.log(req.headers);
    const {tipo, nombre, cantidad} = req.body;
    if (!isNumeric(cantidad) || parseInt(cantidad) < 1){
        res.status(400).send({
            message: "invalid quantity"
        });
        return;
    }
    console.log(tipo, nombre, cantidad, req.headers);
    const api_response = await axios.post(
        `${process.env.API_HOST}/api/inventario_${tipo}/sell?qt=${cantidad}&nombre=${nombre}`,
        {},
        {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": req.headers.authorization
            }
        }
    );

    let response_data = api_response.data;
    res.json({
        success: response_data["success"],
        api_response: response_data
    });
})

app.listen(app.get('port'), () => {
    console.log(`Server listen on port ${app.get('port')}`);
})