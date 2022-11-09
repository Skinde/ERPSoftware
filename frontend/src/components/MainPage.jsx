import React, { useContext, useState } from "react";
import './../styles/Main_page.css';
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useForm } from "react-hook-form";

const l_icon_style = {marginTop: '6px'}
const l_icon = require('./../oficial_icon.png');



let columns = [];

const for_juguetes = [
    { name: "Nombre", selector: row => row.nombre, sortable: true, center: false, left: true, grow: 1.5 },    
    { name: "Modo de juego", selector: row => row.modo_juego, sortable: false, center: false, right: true },
    { name: "Tema", selector: row => row.tema, sortable: false, center: false, right: true },
    { name: "Público objetivo", selector: row => row.publico_objetivo, sortable: false, center: false, right: true },
    { name: "Fuente de energía", selector: row => row.fuente_energia, sortable: false, center: false, right: true },
    { name: "Material principal", selector: row => row.material_principal, sortable: false, center: false, right: true },
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
const MainPage = () => {

    //let s_type, i_author, i_tittle;

    const [token, setToken] = useContext(UserContext);
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
            nombre = document.getElementById("title_input").value; 
            modo_juego = document.getElementById("author_input").value;
            tema = document.getElementById("publisher_input").value; 
            publico_objetivo = document.getElementById("genre_input").value; 
            fuente_energia = document.getElementById("isbn_input").value ;
            material_principal = document.getElementById("edition_input").value ;
            queries = `
            query ($filter: FilterAND){
                filter_juguete(filter: $filter)	{
                     nombre
                     modo_juego
                     publico_objetivo
                     tema
                     fuente_energia
                     material_principal
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

        //s_type = document.getElementById("type_select").value;
        //i_author = document.getElementById("author_input").value;
        //i_tittle = document.getElementById("tittle_input").value;

        get_elementos();
    }

    const handleClickLogOut = (e) => { 
        setToken(null)              
        navigate("/"); 
    }   
    return (
        <div class="wrapper" >     
            <div class="image_wrapper">
                <div class="side_image">
                    <div style={l_icon_style}>
                        <img src={l_icon} width="125px" alt="Side Icon"/>
                    </div>
                </div>

                <button class="logout-button" onClick={handleClickLogOut}>
                    <span class="glyphicon glyphicon-log-out"></span> Log Out
                </button>
            </div>

            <form class="all-inputs">
                <div class = "first-row">
                    <select name="t_product" id="type_select">
                        <option value="" selected disabled>Type</option>
                        <option value="libros">Book</option>
                        <option value="juguetes">Toy</option>
                    </select>
                    
                    <input class="input_1" type="text" placeholder="Author" id="author_input"/>
                    <input class="input_1" type="text" placeholder="Book Title" id="title_input"/>
                </div>

                <div class = "second-row">
                    <input type="text" placeholder="Publisher" id="publisher_input"/>
                    <input type="text" placeholder="Edition" id="edition_input"/>

                    <select name="t_product" id="genre_input" >
                        <option value="" selected disabled>Genre</option>
                        <option value="accion">Action</option>
                        <option value="aventura">Adventure</option>
                        <option value="educacion">Education</option>
                    </select>
                </div>

                <div class="third-row">
                    <input type="text" placeholder="Year" id="year_input"/>
                    <input type="text" placeholder="ISBN" id="isbn_input"/>
                </div>

                <input type="submit" value="Search" onClick={handlequery}/>
            </form>

            <div class="Results-Wrapper">
            
                <div class="For-table">
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
            </div>
        </div>
    )
}

export default MainPage;