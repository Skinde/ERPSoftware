import React, { useContext, useState } from "react";
import './../styles/Main_page.css';
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useForm } from "react-hook-form";
import { CSVLink } from "react-csv";

const l_icon = require('./../oficial_icon.png');



let columns = [];

const for_juguetes = [
    { name: "Nombre", selector: row => row.nombre, sortable: true, center: false, left: true, grow: 1.5 },    
    { name: "Modo de juego", selector: row => row.modo_juego, sortable: false, center: false, right: true },
    { name: "Tema", selector: row => row.tema, sortable: false, center: false, right: true },
    { name: "Público objetivo", selector: row => row.publico_objetivo, sortable: false, center: false, right: true },
    { name: "Fuente de energía", selector: row => row.fuente_energia, sortable: false, center: false, right: true },
    { name: "Material principal", selector: row => row.material_principal, sortable: false, center: false, right: true },
    { name: "Stock", selector: row => row.stock, sortable: false, center: false, right: true },
];


const for_libros = [
    { name: "Titulo", selector: row => row.titulo, sortable: true, center: false, left: true, grow: 1.5 },    
    { name: "ISBN", selector: row => row.isbn, sortable: false, center: false, right: true },
    { name: "Autor", selector: row => row.autor, sortable: false, center: false, right: true },    
    { name: "Editorial", selector: row => row.editorial, sortable: false, center: false, right: true },
    { name: "Formato", selector: row => row.formato, sortable: false, center: false, right: true },
    { name: "Fecha de publicación", selector: row => row.fecha_publicacion, sortable: false, center: false, right: true },
    { name: "Género", selector: row => row.genero, sortable: false, center: false, right: true },
    { name: "Edición", selector: row => row.edicion, sortable: false, center: false, right: true },
    { name: "N° de páginas", selector: row => row.nro_paginas, sortable: false, center: false, right: true },
    { name: "Stock", selector: row => row.stock, sortable: false, center: false, right: true },

];  


const customStyles = {
    rows: {
        style: { minHeight: '40px', paddingRight: '10px' },
    },
    cells: {
        style: {
            paddingLeft: '8px',
            paddingRight: '8px',
        },
    },
}
const paginationOptions = { rowsPerPageText: '' }

var isFirefox = typeof InstallTrigger !== 'undefined';

//Shortcuts strings
function sc_gen(name, key, shift) {
    if (!shift) {
        return name + " (Alt + " + key + ")"
    } else {
        return name + " (Alt + shift + " + key + ")"
    }
}

const MainPage = () => {

    //let s_type, i_author, i_tittle;

    const [token, setToken] = useContext(UserContext);
    const handleDeleteredirect = (e) => { navigate("/Delete")}

    const [data_out, setData_out] = useState([]); 
    const { register, handleSubmit, getValues, formState: {errors} } = useForm();
    let tipo, titulo, autor, editorial, genero, isbn, edicion, year; 
    let nombre, modo_juego, tema, publico_objetivo, fuente_energia, material_principal; 

    let queries,variable ;
    const navigate = useNavigate();
    const get_elementos = async () => {

        tipo = document.getElementById("type_select").value;
        
        let titulos = [];
        let nombres = []

        if (tipo == "juguetes"){
            nombre = document.getElementById("author_input").value; 
            modo_juego = document.getElementById("isbn_input").value;
            tema = document.getElementById("title_input").value; 
            publico_objetivo = document.getElementById("year_input").value; 
            fuente_energia = document.getElementById("edition_input").value ;
            material_principal = document.getElementById("publisher_input").value ;
            queries = `
            query ($filter: FilterAND){
                filter_juguete(filter: $filter)	{
                     nombre
                     modo_juego
                     publico_objetivo
                     tema
                     fuente_energia
                     material_principal
                     stock
                   }
               }

            `
            for(var nom of nombre.split(", ")){
                nombres.push(
                    {"field": "nombre",
                    "contains": nom
                    }      );
            }

            variable = {
            "filter": {
                "and": [
                {
                    "or": nombres
                }, 
                {
                    "or": [
                    {
                        "field": "modo_juego",
                        "contains": modo_juego
                    }
                    ]
                }, 
                {
                    "or": [
                    {
                        "field": "publico_objetivo",
                        "contains": publico_objetivo
                    }
                    ]
                }, 
                {
                    "or": [
                    {
                        "field": "fuente_energia",
                        "contains": fuente_energia
                    }
                    ]
                }, 
                {
                    "or": [
                    {
                        "field": "material_principal",
                        "contains": material_principal
                    }
                    ]
                }
                
                ]
                }
            }
            columns = for_juguetes;
        } 
        
        else {            
            titulo = document.getElementById("title_input").value ;
            autor = document.getElementById("author_input").value;
            editorial = document.getElementById("publisher_input").value; 
            genero = document.getElementById("genre_input").value; 
            isbn = document.getElementById("isbn_input").value ;
            edicion = document.getElementById("edition_input").value ;
            year = document.getElementById("year_input").value;
            
            queries = `
                query($filter: FilterAND) {
                    filter_libro(filter : $filter){                                        
                        isbn
                        autor
                        idioma
                        editorial
                        formato
                        fecha_publicacion
                        genero
                        edicion
                        nro_paginas    
                        titulo
                        stock                
                    },                    
                }                
            `            
            
            for(var tit of titulo.split(", ")){
                titulos.push(
                    {"field": "titulo",
                    "contains": tit
                    }      
                );
            }
            if(year != "")
            {    variable = {
                    "filter": {
                    "and": [
                        {
                        "or": titulos
                        },
                        {
                        "or": [
                            {"field": "editorial",
                            "contains": editorial
                            }
                        ]
                        },
                        {
                        "or": [
                            {"field": "isbn",
                            "contains": isbn
                            }
                        ]
                        },
                        {
                            "or": [
                            {"field": "autor",
                                "contains": autor
                            }
                            ]
                        },
                        {
                            "or": [
                            {"field": "genero",
                                "contains": genero
                            }
                            ]
                        },
                        {
                            "or": [
                            {"field": "edicion",
                                "contains": edicion
                            }
                            ]
                        },
                        {
                            "or": [
                            {"field": "fecha_publicacion",
                                "eq": year
                            }
                            ]
                        }
                    ]	
                    }
            };
        } else{
            variable = {
                "filter": {
                "and": [
                    {
                    "or": titulos
                    },
                    {
                    "or": [
                        {"field": "editorial",
                        "contains": editorial
                        }
                    ]
                    },
                    {
                    "or": [
                        {"field": "isbn",
                        "contains": isbn
                        }
                    ]
                    },
                    {
                        "or": [
                        {"field": "autor",
                            "contains": autor
                        }
                        ]
                    },
                    {
                        "or": [
                        {"field": "genero",
                            "contains": genero
                        }
                        ]
                    },
                    {
                        "or": [
                        {"field": "edicion",
                            "contains": edicion
                        }
                        ]
                    }
                ]	
                }
        };

        }
            columns = for_libros;
            
        }


        const response =  await axios.post(
            'http://127.0.0.1:4000/graphql', 
            {
                query: queries, 
                variables: variable
        } 
            ,{
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token,
                }
            }
        )
        .then(res => res.data)
        .catch(err => console.log(err));     
        console.log(response.data);
        console.log(response);

        if (tipo === "juguetes"){
            
            setData_out(response.data.filter_juguete);            
        } else {                        
            setData_out(response.data.filter_libro);            
        }
        

    }
    
    const handlequery = (e) =>{ 
        e.preventDefault();

        get_elementos();
    }

    const handleClickLogOut = (e) => { 
        setToken(null)              
        navigate("/"); 
    }

    //For browser
    const [val] = React.useState(isFirefox);

    function forToysSearch(value) {
        let ts = document.getElementById("type_select").value;
        if (ts == "libros") {
            document.getElementById("author_input").placeholder = sc_gen("Autor", "a", val);
            document.getElementById("tittle_input").placeholder = sc_gen("Titulo", "t", val);
            document.getElementById("publisher_input").placeholder = sc_gen("Publicista", "p", val);
            document.getElementById("edition_input").placeholder = sc_gen("Edición", "k", val);
            document.getElementById("year_input").placeholder = sc_gen("Año", "y", val);
            document.getElementById("isbn_input").placeholder = sc_gen("ISBN", "i", val);

            // Extras
            document.getElementById("isbn_input").type = "text"
        }
        else if (ts == "juguetes") {
            document.getElementById("author_input").placeholder = sc_gen("Nombre", "a", val);
            document.getElementById("tittle_input").placeholder = sc_gen("Tema", "t", val);
            document.getElementById("publisher_input").placeholder = sc_gen("Material", "p", val);
            document.getElementById("edition_input").placeholder = sc_gen("Energía", "k", val);
            document.getElementById("year_input").placeholder = sc_gen("Publico", "y", val);
            document.getElementById("isbn_input").placeholder = sc_gen("Modo", "i", val);

            // Extras
            document.getElementById("isbn_input").type = "text"
        }
        else if (ts == "libro_item") {
            document.getElementById("author_input").placeholder = sc_gen("UUID", "a", val);
            document.getElementById("tittle_input").placeholder = sc_gen("Titulo", "t", val);
            document.getElementById("publisher_input").placeholder = sc_gen("Estado", "p", val);
            document.getElementById("edition_input").placeholder = sc_gen("Sede", "k", val);
            document.getElementById("year_input").placeholder = sc_gen("Precio de compra", "y", val);
            document.getElementById("isbn_input").placeholder = sc_gen("Valor", "i", val);

            // Extras
            document.getElementById("isbn_input").type = "number"
        }
        else {
            document.getElementById("author_input").placeholder = sc_gen("UUID", "a", val);
            document.getElementById("tittle_input").placeholder = sc_gen("Nombre", "t", val);
            document.getElementById("publisher_input").placeholder = sc_gen("Estado", "p", val);
            document.getElementById("edition_input").placeholder = sc_gen("Sede", "k", val);
            document.getElementById("year_input").placeholder = sc_gen("Precio de compra", "y", val);
            document.getElementById("isbn_input").placeholder = sc_gen("Valor", "i", val);

            // Extras
            document.getElementById("isbn_input").type = "number"
        }
    }

    return (
        <section>
            <div className="sidebar">
                <button class="logout-button" onClick={handleClickLogOut}>
                    <span class="glyphicon glyphicon-log-out"></span> Log Out
                </button>

                <button class="delete-button" onClick={handleDeleteredirect}>
                    <span class="glyphicon glyphicon-trash"></span> Inventario
                </button>
            </div>

        
            <section className="all-main-wrapper">
                <div className="main-container-box">
                    <div className="top-left">                    
                        <div className="side-image">
                            <img src={l_icon} className="side-icon" alt="icon"/>
                        </div>
                    </div>

                    <div className="top-right">
                        <form className="all-inputs">
                            <div className="first-row">
                                <select name="t_product" id="type_select" onChange={forToysSearch}>
                                    <option value="libros" selected>Book</option>
                                    <option value="juguetes">Toy</option>
                                </select>   

                                { val ? <input type="text" pplaceholder="Autor (Alt + shift + a)" id="author_input" accessKey="a"/>:
                                    <input type="text" placeholder="Autor (Alt + a)" id="author_input" accessKey="a"/> }
                                { val ? <input type="text" placeholder="Titulo (Alt + shift + t)" id="title_input" accessKey="t"/>:
                                    <input type="text" placeholder="Titulo (Alt + t)" id="title_input" accessKey="t"/> }
                                
                            </div>

                            <div className="second-row">
                                <select name="t_genre" id="genre_input">
                                    <option value="" selected disabled>Genre</option>
                                    <option value="Action" id="genre_select_v1">Action</option>
                                    <option value="Adventure">Adventure</option>
                                    <option value="Education">Education</option>
                                </select>

                                { val ? <input type="text" placeholder="Publicista (Alt + shift + p)" id="publisher_input" accessKey="p"/>:
                                    <input type="text" placeholder="Publicista (Alt + p)" id="publisher_input" accessKey="p"/> }
                                { val ?  <input type="text" placeholder="Edición (Alt + shift + k)" id="edition_input" accessKey="k"/>:
                                    <input type="text" placeholder="Edición (Alt + k)" id="edition_input" accessKey="k"/> }
                            </div>

                            <div className="third-row">
                                { val ? <input type="number" placeholder="Año (Alt + shift + y)" id="year_input" accessKey="y"/>:
                                    <input type="number" placeholder="Año (Alt + y)" id="year_input" accessKey="y"/> }
                                { val ? <input type="text" placeholder="ISBN (Alt + shift + i)" id="isbn_input" accessKey="i"/>:
                                    <input type="text" placeholder="ISBN (Alt + i)" id="isbn_input" accessKey="i"/>}
                                
                            </div>
                            <input type="submit" value="Search" onClick={handlequery}/>
                        </form>
                    </div>

                    <div className="results-wrapper">
                        <div class="table-content">
                            <DataTable
                                columns={columns}
                                data={data_out}
                                customStyles = {customStyles}                            
                                pagination
                                paginationComponentOptions={paginationOptions}
                                paginationRowsPerPageOptions={[]}
                                fixedHeader
                            />
                        </div>
                        <div className="to_download">
                            <CSVLink data={data_out} filename={"report.csv"}>Export</CSVLink>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    )
}

export default MainPage;