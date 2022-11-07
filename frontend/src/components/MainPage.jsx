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
    { name: "Idioma", selector: row => row.idioma, sortable: false, center: false, right: true },
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
    const [token, setToken] = useContext(UserContext);
    const [data_out, setData_out] = useState([]); 
    const { register, handleSubmit, getValues, formState: {errors} } = useForm();
    let tipo = ""; 

    const navigate = useNavigate();



    const get_elementos = async () => {
        const response =  await axios.post(
            'http://127.0.0.1:4000/graphql', 
            {
                query: `
                {
                    
                    libros {
                        isbn
                        autor
                        idioma
                        editorial
                        formato
                        fecha_publicacion
                        genero
                        edicion
                        nro_paginas
                    },
                    juguetes {
                        nombre
                        tema
                        material_principal
                        fuente_energia
                        modo_juego
                        publico_objetivo
                    }
                }
                `
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token,
                }
            }
        )
        .then(res => res.data)
        .catch(err => console.log(err));        
        if (tipo === "juguetes"){
            setData_out( response.data.libros);
            columns = for_libros;
        } else {
            setData_out( response.data.juguetes);
            columns = for_juguetes;
            
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
                    <select name="t_product">
                        <option value="" selected disabled>Type</option>
                        <option value="libros">Book</option>
                        <option value="juguetes">Toy</option>
                    </select>
                    
                    <input {...register("author")}/>
                    <input {...register("book tittle")}/>
                </div>

                <div class = "second-row">
                    <input type="text" placeholder="Publisher"/>
                    <input type="text" placeholder="Edition"/>

                    <select name="t_product">
                        <option value="" selected disabled>Genre</option>
                        <option value="value_1">Action</option>
                        <option value="value_2">Adventure</option>
                        <option value="value_3">Education</option>
                    </select>
                </div>

                <div class="third-row">
                    <input type="text" placeholder="Year"/>
                    <input type="text" placeholder="ISBN"/>
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