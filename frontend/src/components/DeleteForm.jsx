import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";

import './../styles/Main_page.css';
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";

import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

const l_icon = require('./../oficial_icon.png');


function sc_gen(name, key, shift) {
    if (!shift) {
        return name + " (Alt + " + key + ")"
    } else {
        return name + " (Alt + shift + " + key + ")"
    }
}

function extractValues() {
    /*
    s_type = document.getElementById("type_select").value;
    i_author = document.getElementById("author_input").value;
    i_tittle = document.getElementById("tittle_input").value;
    i_publisher = document.getElementById("publisher_input").value;
    i_edition = document.getElementById("edition_input").value;
    s_genre = document.getElementById("genre_select").value;
    i_year = document.getElementById("year_input").value;
    i_isbn = document.getElementById("isbn_input").value;
    */
}

const randomTable = [
    {Tittle:"Introduction to Algorithms", Author:"Thomas H., Cormen", Edition:"4th", 
        Publisher:"The MIT press", Genre: "Education", Year: "2021", ISBN: "978-0262046305"},
    {Tittle:"Computability, Complexity, and Languages: Fundamentals of Theoretical Computer Science", Author:"Martin D., Davis", Edition:"2nd",
        Publisher:"Morgan Kaufmann", Genre: "Education", Year: "1994", ISBN: "978-0122063824"},
    {Tittle:"The Universal Computer: The Road from Leibniz to Turing", Author:"Davis, Martin", Edition:"1st",
        Publisher:"W. W. Norton & Company", Genre: "Education", Year: "2000", ISBN: "978-0393047851"},
    {Tittle:"Operating systems: Design and implementation", Author:"Tanenbaum A., Woodhull, A.", Edition:"3rd",
        Publisher:"Pearson", Genre: "Education", Year: "2006", ISBN: "978-0131429383"},
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

var isFirefox = typeof InstallTrigger !== 'undefined';


const paginationOptions = { rowsPerPageText: '' }
let columns,  tipo;
 

const Delete = () => {
    const [token, setToken] = useContext(UserContext);
    const navigate = useNavigate();
    const handleBack = (e) => { navigate("/Home")}

    const [val] = React.useState(isFirefox);

    const [data_out, setData_out] = useState([]); 
    let queries, variable;
    
    const handleDel = async (tipo_,props)  =>  {
        let uuid_ = props.uuid;
        console.log(uuid_)
        
        const response =  await axios.post(
            'http://127.0.0.1:8000/api/delete', 
            {
                type: tipo_, 
                uuid: uuid_
            } 
            ,{
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token,
                }
            }
        )
        
        
    }
    
    const columns_libro = [
        { name: "uuid", selector: row => row.uuid, sortable: true, center: false, left: true, grow: 1.5 },
        { name: "Titulo", selector: row => row.titulo, sortable: true, center: false, right: true },
        {
            name: '¿Eliminar?',             
            button: true,
            cell: props => 
            {
            return(    
            <div onClick={() => {handleDel("Book",props)}}>
                <IconButton type="button"
                        aria-label="delete"
                        color="secondary"
                    >
                        <DeleteIcon/>
                    </IconButton>
            </div>)
            },
        },
    ]
    const columns_juguetes = [
        { name: "uuid", selector: row => row.uuid , sortable: true, center: false, left: true, grow: 1.5 },
        { name: "Nombre", selector: row => row.nombre, sortable: false, center: false, right: true },
        {
            name: '¿Eliminar?',
            button: true,
            cell: () => <button type="button">Sí</button>,
            
        },
    ]

    const get_elementos = async () => {

        
        let titulos, uuid;
        tipo = document.getElementById("type_select").value;

        if (tipo == "Book"){
            uuid = document.getElementById("author_input").value; 
            titulos = document.getElementById("title_input").value;             
            queries = `
            query($filter: FilterAND){
                item_libro(filter: $filter)	{
                     uuid
                     titulo
                   }
               }

            `
            variable = {
                "filter": {
                "and": [
                    
                    {
                    "or": [
                        {"field": "titulo",
                        "contains": titulos
                        }
                    ]
                    },

                    {
                        "or": [
                        {
                            "field": "uuid",
                            "contains": uuid
                        }
                        ],                        
                    },
            
                    
                ]	
                }
            };
            columns = columns_libro;



            
        } else { 
            uuid = document.getElementById("author_input").value; 
            titulos = document.getElementById("title_input").value; 
            
            queries = `
            query ($filter: FilterAND){
                item_juguete(filter: $filter){
                     uuid
                     nombre
                   }
               }

            `
            variable = {
                "filter": {
                    "and": [                    
                    {
                        
                        "or": [
                        {
                            "field": "nombre",
                            "contains": titulos
                        }
                        ]
                        
                    },

                    {
                        "or": [
                        {
                            "field": "uuid",
                            "contains": uuid
                        }
                        ],
                        
                    },
            
                ]
                } 
            }
            columns = columns_juguetes;
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

        
        if (tipo == "Toy"){
            
            setData_out(response.data.item_juguete);            
        } else {                        
            setData_out(response.data.item_libro);            
        }
        
    }
    const handlequery = (e) =>{ 
        e.preventDefault();

        get_elementos();
    }

    function forToysSearch(value) {
        if (document.getElementById("type_select").value == "Book") {
            document.getElementById("author_input").placeholder = sc_gen("UUID", "a", val);
            document.getElementById("tittle_input").placeholder = sc_gen("Titulo", "t", val);
        }
        else {
            document.getElementById("author_input").placeholder = sc_gen("UUID", "a", val);
            document.getElementById("tittle_input").placeholder = sc_gen("Nombre", "t", val);
        }
    }

    return (
        <section>
            <div className="sidebar">
                <button class="logout-button">
                    <span class="glyphicon glyphicon-log-out"></span> Log Out
                </button>

                <button class="back-button" onClick={handleBack}>
                    <span class="glyphicon glyphicon-chevron-left"></span> Back
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
                                    <option value="Book" selected>Item Book</option>
                                    <option value="Toy">Item Toy</option>
                                </select>   

                                 <input type="text" placeholder="UUID" id="author_input" accessKey="a"/>
                                    
                                 <input type="text" placeholder="Titulo" id="title_input" accessKey="t"/>
                                
                                
                            </div>

                            <div className="second-row"> </div>
                            <input type="submit" value="Search" onClick={handlequery}/>
                            <div className="third-row"> </div>
                        </form>

                            
                        <div className="results-wrapper-delete">
                        <div className="table-content">
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
                            <CSVLink data={randomTable} filename={"report.csv"}>Export</CSVLink>
                        </div>
                    </div>
                    </div>
                </div>
                   
            </section>
        </section>
    )
}

export default Delete;

/*
{ val ? <input type="text" placeholder="UUID" id="author_input" accessKey="a"/>:
                                    <input type="text" placeholder="UUID" id="author_input" accessKey="a"/> }
                                { val ? <input type="text" placeholder="Book title" id="title_input" accessKey="t"/>:
                                    <input type="text" placeholder="Book title" id="title_input" accessKey="t"/> }
 */