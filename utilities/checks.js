import axios from 'axios';
import fetch from "node-fetch";
const isNumeric = (value) => /(\d+(?:\.\d+)?)/.test(value);

let nums = ["5", "-5", "-5.", "5.", 5, 5., .5, -5, 1e5, -1e5];

nums.forEach(num => console.log(`${typeof num} ${num} ${isNumeric(num)}`));

const instance = axios.create({
    baseURL: "http://127.0.0.1:8001",
    tiemout: 2000
})

let queries = [
    // `
    // libros_filter (filter: \"{ \"titulo\": \"algorithms\"}\"){
    //     titulo
    //     isbn
    // }`,
    // `
    // libros {
    //     titulo
    //     isbn
    //     autor
    // }`,
    // `
    // juguetes {
    //   nombre
    //   modo_juego
    // }`,
    // `
    // item_libro {
    //   uuid
    //   titulo
    //   sede
    //   valor
    // }
    // `,
    // `
    // item_juguete {
    //     uuid
    //     nombre
    //   }
    // `
]

let data = await axios.post(
    'http://127.0.0.1:8001/graphql', 
    {
        query: `
        {
            item_juguete { 
                uuid 
                nombre 
            },
            libros {
                titulo
                isbn
            },
            item_libro {
                uuid
                titulo
                sede
                valor
            },
            juguetes {
                nombre
                modo_juego
            }
        }
        `, variables: {
            filtro: "{ \"titulo\": \"algorithms\"}"
        }
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    }
)
    .then(res => res.data)
    .catch(err => console.log(err));

console.log(typeof data);
console.log(Object.keys(data))
console.log(Object.keys(data["data"]))
console.log(data["data"]["item_juguete"]);
console.log(data["data"]["item_libro"])
console.log(data["data"]["juguetes"])
console.log(data["data"]["libros"])


const endpoint = "http://127.0.0.1:8001/graphql";
const headers = {
	"content-type": "application/json"
};

let prueba = async() => {
    try {
        let filtro = "algorithms";
        let body =  { 
            query: `
                query {
                    libros_titulo(titulo:"${filtro}") {
                        titulo
                        isbn
                    }
                }
            `, 
            variables: {}
        }
        let options = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const rr = await axios.post('http://localhost:8001/graphql',body, options)
            .then((response)=>{
                console.log(response.data);
                return response.data;
        });
        console.log(typeof rr)
        console.log(Object.keys(rr))
        console.log(rr["data"]["libros_titulo"])
    } catch (error) {
        const rr = await axios.post("http://localhost:8001/graphql?query=%7B%0A%20%20libros_filter%20(filter%3A%20%22%7B%20%5C%22titulo%5C%22%3A%20%5C%22algorithms%5C%22%7D%22)%7B%0A%20%20%20%20titulo%0A%20%20%20%20isbn%0A%20%20%7D%0A%7D%0A")
            .then(response => {
                console.log(response.data)
                return response.data;
            });
        console.log(typeof rr);
        console.log(Object.keys(rr))
        console.log(rr["data"]["libros_filter"])
    }
    
}
await prueba();


