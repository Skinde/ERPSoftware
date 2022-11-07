const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const getCurrentDate = () => {
    const baseDate = new Date(); 
    return baseDate.getDate() + "/" + (baseDate.getMonth()+1)  + "/" + baseDate.getFullYear() + " - "  + baseDate.getHours() + ":"  + baseDate.getMinutes() + ":" + baseDate.getSeconds();
}
const express = require('express');
const fs = require("fs");

const app = express();

app.use(
    cors({
        origin: "http://localhost:3000"
    })
)
app.use(async (req, res, next) => {
    let cDate =  getCurrentDate();

    if (!req.headers['authorization']) {
        req.headers['authorization'] = `${process.env.JWT_TOKEN_TYPE} ${process.env.JWT_AUTH_TOKEN}`;
        console.log("\tautorizacion de desarrollo");
    } else {
        console.log("\tautorizado");
    }
    
    console.log(`${req.method} ${req.url} \t ${cDate}`);
    next();
})
app.set('port', process.env.PORT || 4000);

const typeDefs = buildSchema(fs.readFileSync('./schema.graphql').toString());
const { resolvers } = require('./resolver.js');

// ENDPOINTS
app.get('/', async (req, res) => {
    const api_res = await axios.get(process.env.API_HOST + "/")
        .then(res => res.data)
        .catch(err => {
            console.log(err);
            return res.data;
        });
    
    res.json({  
        message: "service running",
        api_response: api_res
    }); 
})

app.get('/objetos', async (req, res) => {
    books = await resolvers.libros({}, {auth: req.headers["authorization"]});
    toys = await resolvers.juguetes({}, {auth: req.headers["authorization"]});
    res.json({
        books: books,
        toys: toys
    })
})

app.get('/items', async (req, res) => {
    books = await resolvers.item_libro({}, {auth: req.headers["authorization"]});
    toys = await resolvers.item_juguete({}, {auth: req.headers["authorization"]});
    res.json({
        len_books: books.length,
        len_toys: toys.length,
        books: books,
        toys: toys
    })
})

// GRAPHQL
app.use('/graphql', graphqlHTTP((req) => ({
    schema: typeDefs,
    rootValue: resolvers,
    graphiql: true,
    context: {
        auth: req.headers["authorization"]
    }
})));

app.listen(app.get('port'), () => {
    // console.log(process.env);
    console.log(`Server listen on port ${app.get('port')}`);
});
