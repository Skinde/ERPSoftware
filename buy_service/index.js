const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

app.use(express.json());
app.set('port', process.env.PORT || 8002);

const isNumeric = (value) => /(\d+(?:\.\d+)?)/.test(value);

app.get('/', async (req, res) => {
    console.log(req.body);
    console.log(req.headers);
    res.json({
        running: true
    });    
})

app.post('/', async (req, res) => {
    // console.log(req.body);
    // console.log(req.headers);

    const {tipo, cantidad, precio_compra} = req.body;
    if (!isNumeric(cantidad) || !isNumeric(precio_compra)){
        res.status(400).send({
            message: "invalid quantities or buy price"
        });
        return;
    }

    const api_response = await axios.post(
        `${process.env.API_HOST}/api/${tipo}s/insert?qt=${cantidad}&pu=${precio_compra}`, 
        req.body.item,        
        {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": req.headers.authorization
            }
        }    
    );
    let response_data = api_response.data;
    res.json({
        finish: response_data["success"],
        api_response: response_data
    })
})

app.listen(app.get('port'), () => {
    // console.log(process.env);
    console.log(`Server listen on port ${app.get('port')}`);
});
