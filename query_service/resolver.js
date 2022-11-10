const axios = require('axios');
const dotenv = require('dotenv');
const Redis = require('ioredis');
dotenv.config();

const redis = new Redis();

const instance = axios.create({
    baseURL: process.env.API_HOST,
    timeout: 6000
});

const op = {
    eq : (f, s) => f == s,
    gte: (f, s) => f >= s,
    gt: (f, s) => f > s,
    lte: (f, s) => f <= s,
    lt: (f, s) => f < s,
    contains: (f, s) => f.toLowerCase().includes(s.toLowerCase())
};

const parse_query_arg = (filter) => {
    // PARSE filter ARGUMENT -> CONSTRUCT filter_funcs ARRAY
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
    return filter_funcs;
};

const exec_filters = (obj, filters) => {
    // FILTER LOGIC
    for (const or_list of filters)
    {
        obj = obj.filter((libro) => {
            let flag = false;
            for (const param of or_list)
                if (param.field in libro)
                    flag |= param.op(libro[param.field], param.s);
            return flag;
        });
    }

    return obj;
}

const get_data = async (key, endpoint, jwt) => {
    try {
        // WITH REDIS
        const reply = await redis.get(key);
        if (reply){
            return JSON.parse(reply);
        }
        else {
            // WITHOUT REDIS
            let response_data = await instance.get(endpoint, {
                headers: {
                    'Authorization': jwt
                }
            })
                .then(res => res.data)
                .catch(err => console.log(err));    
            
            let response = response_data[key];
            // SAVE DATA ON REDIS
            await redis.set(key, JSON.stringify(response), 'EX', 300);
            return response;
        }
    } catch (error) {
        console.log(error);
    }
}

const resolvers = {
    test: () => 'Test success',
    // OLD
    libros: async ({}, context) => {     
        const books = await instance.get("/api/libros", {
            headers: {
                'Authorization': context['auth']
            }
        })
            .then(res => res.data)
            .catch(err => console.log(err));
        
        return books["Libros"] || [];
    },
    juguetes: async ({}, context) => {
        const toys = await instance.get("/api/juguetes", {
            headers: {
                'Authorization': context['auth']
            }
        })
            .then(res => res.data)
            .catch(err => console.log(err));
        
        return toys["Juguetes"];
    },
    // NEW
    filter_libro: async({ filter }, context) => {
        filter = JSON.parse(JSON.stringify(filter));
        console.log(`\tPARSED QUERY\n${JSON.stringify(filter)}`);
        // PARSE parameter of GraphQL query
        let filter_funcs = parse_query_arg(filter);
        console.log(`\tFILTER ARRAY`);
        for (const [func] of filter_funcs)
            console.log(func);

        // GET libros FROM centralAPI OR RedisCache
        let libros = await get_data("Libros", "/api/libros", context['auth']);
        
        // EXECUTE filter parse parameters over objects
        let response = exec_filters(libros, filter_funcs);
        
        // GET COUNT
        let stock_libros = await get_data("stock_libros", "/api/stock_libros", context['auth']);
        
        for (let obj of response)
            obj.stock = stock_libros[obj.nombre] || 0;
            
        // response.forEach(element => {
        //     element.stock = stock_libros[element.nombre];
        // });
        
        return response;
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
                'Authorization': context['auth']
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
    },
    item_libro: async ({ filter }, context) => {     
        // PARSE filter ARGUMENT
        let res = await resolvers.filter_libro({filter}, context);

        return res;


        filter = JSON.parse(JSON.stringify(filter));
        // console.log(`\tPARSED QUERY\n${JSON.stringify(filter)}`);
        
        // PARSE parameter of GraphQL query
        let filter_funcs = parse_query_arg(filter);

        const libros = await get_data("Libros", "/api/libros", context["auth"]);
        
        // EXECUTE filter parse parameters over objects
        let response = exec_filters(libros, filter_funcs);

        return response;
    },
    item_juguete: async({ filter }, context) => {
        let res = await resolvers.filter_juguete({filter}, context);

        return res;

        // PARSE filter ARGUMENT
        filter = JSON.parse(JSON.stringify(filter));
        console.log(`\tPARSED QUERY\n${JSON.stringify(filter)}`);
        
        // PARSE parameter of GraphQL query
        let filter_funcs = parse_query_arg(filter);

        const juguetes = await get_data("Juguetes", "/api/inventario_juguetes", context["auth"]);

        // EXECUTE filter parse parameters over objects
        let response = exec_filters(juguetes, filter_funcs);
        
        return response;
    }
}

module.exports = { resolvers };
