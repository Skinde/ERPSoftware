const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const aux_auth_token = `${process.env.JWT_TOKEN_TYPE} ${process.env.JWT_AUTH_TOKEN}`;
const instance = axios.create({
    baseURL: process.env.API_HOST,
    timeout: 2000
});

const resolvers = {
    test: () => 'Test success',
    libros: async ({}, context) => {     
        const books = await instance.get("/api/libros", {
            headers: {
                'Authorization': context['auth'] || aux_auth_token
            }
        })
            .then(res => res.data)
            .catch(err => console.log(err));
        
        return books["Libros"] || [];
    },
    libros_filter: async ({ filter }, context) => {
        let { Libros } = await instance.get("/api/libros", {
            headers: {
                'Authorization': context['auth'] || aux_auth_token
            }
        })
            .then(res => res.data)
            .catch(err => console.log(err));
        let response = Libros;

        const query = JSON.parse(filter);
        if (query["titulo"])
            response = response.find(libro => libro.titulo.toLowerCase().includes(query["titulo"]) ) || [];
        
        if (typeof response === 'object')
            return [response];
        return response;
    },
    item_libro: async ({}, context) => {     
        const books = await instance.get("/api/inventario_libros", {
            headers: {
                'Authorization': context['auth'] || aux_auth_token
            }
        })
            .then(res => res.data)
            .catch(err => console.log(err));
        
        return books["Libros"] || [];
    },
    juguetes: async ({}, context) => {
        const toys = await instance.get("/api/juguetes", {
            headers: {
                'Authorization': context['auth'] || aux_auth_token
            }
        })
            .then(res => res.data)
            .catch(err => console.log(err));
        
        return toys["Juguetes"] || [];
    },
    item_juguete: async({}, context) => {
        const toys = await instance.get("/api/inventario_juguetes", {
            headers: {
                'Authorization': context['auth'] || aux_auth_token
            }
        })
            .then(res => res.data)
            .catch(err => console.log(err));
        
        return toys["Juguetes"] || [];
    }
}

module.exports = { resolvers };