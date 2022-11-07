const axios = require('axios');
const dotenv = require('dotenv');
const { createClient } = require('redis');
dotenv.config();

const client = createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});
client.on('error', (err) => console.log('redis-cli error', err));

const instance = axios.create({
    baseURL: process.env.API_HOST,
    timeout: 6000
});

const op = {
    eq : (f, s) => f === s,
    gte: (f, s) => f >= s,
    gt: (f, s) => f > s,
    lte: (f, s) => f <= s,
    lt: (f, s) => f < s,
    contains: (f, s) => f.toLowerCase().includes(s.toLowerCase())
};

const resolvers = {
    test: () => 'Test success',
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
                'Authorization': context['auth']
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
    }
}

module.exports = { resolvers };
