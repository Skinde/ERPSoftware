const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const aux_auth_token = `${process.env.JWT_TOKEN_TYPE} ${process.env.JWT_AUTH_TOKEN}`;
const instance = axios.create({
    baseURL: process.env.API_HOST,
    // timeout: 6000
});

const op = {
    eq : (f, s) => f === s,
    gte: (f, s) => f >= s,
    gt: (f, s) => f > s,
    lte: (f, s) => f <= s,
    lt: (f, s) => f < s,
    contains: (f, s) => f.toLowerCase().includes(s.toLowerCase())
}

const resolvers = {
    test: () => 'Test success',
    // OLD
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
    },
    // NEW
    filter_libro: async({ filter }, context) => {
        // PARSE filter ARGUMENT -> CONSTRUCT filter_funcs ARRAY
        filter = JSON.parse(JSON.stringify(filter));
        let filter_funcs = [];
        for (const [index, list] of Object.entries(filter.and))
        {
            let filter_or = [];
            for (const fil of list.or)
            {
                for (const key of Object.keys(fil))
                    if (key !== 'field')            
                        filter_or.push({
                            field: fil['field'],
                            s: fil[key],
                            op: op[key]      
                        })
            }
            filter_funcs.push(filter_or);
        }
        console.log(`\tFILTER ARRAY`);
        console.log(filter_funcs);

        // GET libros FROM centralAPI OR RedisCache
        let { Libros } = await instance.get("/api/libros", {
            headers: {
                'Authorization': context['auth'] || aux_auth_token
            }
        })
            .then(res => res.data)
            .catch(err => console.log(err));
        
        // FILTER LOGIC
        for (const or_list of filter_funcs)
        {
            Libros = Libros.filter((libro) => {
                let flag = false;
                for (const param of or_list)
                    if (param.field in libro)
                        flag |= param.op(libro[param.field], param.s);
                return flag;
            });
        }

        return Libros;
    },
    filter_juguete: async({ filter }, context) => {
        // PARSE filter ARGUMENT -> CONSTRUCT filter_funcs ARRAY
        filter = JSON.parse(JSON.stringify(filter));
        let filter_funcs = [];
        for (const [index, list] of Object.entries(filter.and))
        {
            let filter_or = [];
            for (const fil of list.or)
            {
                for (const key of Object.keys(fil))
                    if (key !== 'field')            
                        filter_or.push({
                            field: fil['field'],
                            s: fil[key],
                            op: op[key]      
                        })
            }
            filter_funcs.push(filter_or);
        }
        console.log(`\tFILTER ARRAY`);
        console.log(filter_funcs);

        // GET juguetes FROM centralAPI OR RedisCache
        let { Juguetes } = await instance.get("/api/juguetes", {
            headers: {
                'Authorization': context['auth'] || aux_auth_token
            }
        })
            .then(res => res.data)
            .catch(err => console.log(err));
        
        // FILTER LOGIC
        for (const or_list of filter_funcs)
        {
            Juguetes = Juguetes.filter((libro) => {
                let flag = false;
                for (const param of or_list)
                    if (param.field in libro)
                        flag |= param.op(libro[param.field], param.s);
                return flag;
            });
        }

        return Juguetes;
    }
}

module.exports = { resolvers };

/**
 * IDEA: 
 * filter js => function that return a function
 */