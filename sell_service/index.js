const axios = require('axios');
const dotenv = require('dotenv');
const express = require('express');
dotenv.config();

const app = express();

app.use(express.json());
app.set('port', process.env.PORT || 8001);

app.get('/', async (req, res) => {  
    // console.log(req.body);
    console.log(req.headers.authorization);

    res.json({
        running: true
    });
})

app.listen(app.get('port'), () => {
    console.log(`Server listen on port ${app.get('port')}`);
})