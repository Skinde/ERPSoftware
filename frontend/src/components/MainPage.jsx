import React, { useContext } from "react";
import './../styles/Main_page.css';
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from "axios";
//import DataTable from "react-data-table-component";


const l_icon_style = {marginTop: '6px'}
const l_icon = require('./../oficial_icon.png');
/*
const randomTable = [
    {Tittle:"Introduction to Algorithms", Author:"Thomas H., Cormen", Edition:"4th", 
        Publisher:"The MIT press", Genre: "Education", Year: "2021", ISBN: "978-0262046305"},
    {Tittle:"Computability, Complexity, and Languages: Fundamentals of Theoretical Computer Science", Author:"Martin D., Davis", Edition:"2nd",
        Publisher:"Morgan Kaufmann", Genre: "Education", Year: "1994", ISBN: "978-0122063824"},
    {Tittle:"The Universal Computer: The Road from Leibniz to Turing", Author:"Davis, Martin", Edition:"1st",
        Publisher:"W. W. Norton & Company", Genre: "Education", Year: "2000", ISBN: "978-0393047851"},
    {Tittle:"Operating systems: Design and implementation", Author:"Tanenbaum A., Woodhull, A.", Edition:"3rd",
        Publisher:"Pearson", Genre: "Education", Year: "2006", ISBN: "978-0131429383"},

    {Tittle:"Operating System Concepts", Author:"Silberchatz, Abraham", Edition:"10nd",
        Publisher:"Wiley", Genre: "Education", Year: "2021", ISBN: "978-1119800361"},
    {Tittle:"Operating System Concepts", Author:"Silberchatz, Abraham", Edition:"10nd",
        Publisher:"Wiley", Genre: "Education", Year: "2021", ISBN: "978-1119800361"},
    {Tittle:"Operating System Concepts", Author:"Silberchatz, Abraham", Edition:"10nd",
        Publisher:"Wiley", Genre: "Education", Year: "2021", ISBN: "978-1119800361"},
    {Tittle:"Operating System Concepts", Author:"Silberchatz, Abraham", Edition:"10nd",
        Publisher:"Wiley", Genre: "Education", Year: "2021", ISBN: "978-1119800361"},
    {Tittle:"Operating System Concepts", Author:"Silberchatz, Abraham", Edition:"10nd",
        Publisher:"Wiley", Genre: "Education", Year: "2021", ISBN: "978-1119800361"},
    {Tittle:"Operating System Concepts", Author:"Silberchatz, Abraham", Edition:"10nd",
        Publisher:"Wiley", Genre: "Education", Year: "2021", ISBN: "978-1119800361"},
    {Tittle:"Operating System Concepts", Author:"Silberchatz, Abraham", Edition:"10nd",
        Publisher:"Wiley", Genre: "Education", Year: "2021", ISBN: "978-1119800361"},
];

let Tablee = [];

const columns = [
    { name: "Tittle", selector: "Tittle", sortable: true, center: false, left: true, grow: 1.5 },    
    { name: "ISBN", selector: "ISBN", sortable: false, center: false, right: true }
]

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
*/
const MainPage = () => {
    const [token, setToken] = useContext(UserContext);

    const navigate = useNavigate();
    const get_elementos = async () => {
        const response =  await axios.post(
            'http://127.0.0.1:4000/graphql', 
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
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token,
                }
            }
        )
        .then(res => res.data)
        .catch(err => console.log(err));
        let placeholder =document.querySelector("#data-output");
        let out = "";
        for( let row of response.data.libros){
            out += `
                <tr>                 
                 <td scope="row">${row.titulo}</td>
                 <td>${row.isbn}</td>
                </tr>   
            `            
        }
        placeholder.innerHTML =out;
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
                        <option value="value_1">Book</option>
                        <option value="value_2">Toy</option>
                    </select>
                    
                    <input class="input_1" type="text" placeholder="Author"/>
                    <input class="input_1" type="text" placeholder="Book Tittle"/>
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
            
                    <table striped bordered hover>
                        <thead class="thead-dark">
                            <tr>
                                <th scope="col">Nombre</th>
                                <th scope="col">Código</th>
                            </tr>
                        </thead>
                        <tbody id="data-output">


                        </tbody>
                    </table>
            </div>
            
        </div>
    )
}

export default MainPage;