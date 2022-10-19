const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const aux_auth_token = `${process.env.JWT_TOKEN_TYPE} ${process.env.JWT_AUTH_TOKEN}`;
const instance = axios.create({
    baseURL: process.env.API_HOST,
    // timeout: 2000
});

const resolvers = {
    test: () => 'Test success',
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
    libros_titulo: async ({ titulo }, context) => {
        let { Libros } = await instance.get("/api/libros", {
            headers: {
                'Authorization': context['auth'] || aux_auth_token
            }
        })
            .then(res => res.data)
            .catch(err => console.log(err));
        let response = Libros;
        let response_arr = [];

        Object.keys(response).forEach((key, index) => {
            if (response[key].titulo.toLowerCase().includes(titulo.toLowerCase()))
                response_arr.push(response[key]);
        });
        return response_arr;
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
    item_libro_titulo: async ({ titulo }, context) => {
        let { Libros } = await instance.get("/api/inventario_libros", {
            headers: {
                'Authorization': context['auth'] || aux_auth_token
            }
        })
            .then(res => res.data)
            .catch(err => console.log(err));
        let response = Libros;
        let response_arr = [];

        Object.keys(response).forEach((key, index) => {
            if (response[key].titulo.toLowerCase().includes(titulo.toLowerCase()))
                response_arr.push(response[key]);
        });
        return response_arr;
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
    juguetes_nombre: async ({ nombre }, context) => {
        const res = await instance.get("/api/juguetes", {
            headers: {
                'Authorization': context['auth'] || aux_auth_token
            }
        })
            .then(res => res.data)
            .catch(err => console.log(err));
        let response = res["Juguetes"];
        // console.log(typeof response);
        // console.log(Object.keys(response));
        
        let keys = Object.keys(response);
        // keys.forEach((key, index) => {
        //     console.log(`${key}: ${JSON.stringify(response[key])}`);
        // });
        let response_arr = [];
        keys.forEach((key, index) => {
            if (response[key].nombre.toLowerCase().includes(nombre.toLowerCase()))
                response_arr.push(response[key]);
            // console.log(`${key}: ${JSON.stringify(response[key])}`);
        });
        return response_arr;
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
    },
    item_juguete_nombre: async({ nombre }, context) => {
        const { Juguetes } = await instance.get("/api/inventario_juguetes", {
            headers: {
                'Authorization': context['auth'] || aux_auth_token
            }
        })
            .then(res => res.data)
            .catch(err => console.log(err));
        let response = Juguetes;
        let response_arr = [];

        Object.keys(response).forEach((key, index) => {
            if (response[key].nombre.toLowerCase().includes(nombre.toLowerCase()))
                response_arr.push(response[key]);
        });
        return response_arr;
    }
}

module.exports = { resolvers };