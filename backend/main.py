import fastapi as _fastapi
import fastapi.security as _security
from fastapi.middleware.cors import CORSMiddleware as _CORSMiddleware

import json as _json
import passlib.hash as _hash
import pymongo as _pymongo

import book_api_consumer as _consumer
import database as _database
import schemas as _schemas
import models as _models
import services as _services

import sqlalchemy as _sqlalchemy
import sqlalchemy.orm as _orm

_services.create_database()

# GLOBAL VARIABLES
app = _fastapi.FastAPI()
origins = ["http://localhost:3000"]
app.add_middleware(
    _CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "MONGO_DATA": [
            _services.get_mongo_client().address
        ],
        "PSQL_DATA": [
            _database.engine.url,
            _database.engine.driver
        ],
        "QUERIES": {
            "mongo_db databases: ": _services.get_mongo_client().list_database_names(),
            "mongo_db collections": _services.get_mongo_db().list_collection_names(),
            "psql schema names": _sqlalchemy.inspect(_database.engine).get_schema_names(),
            "psql tables": list(_database.Base.metadata.tables.keys())
        }
    }

# API ENDPOINTS
#   LOGIN ENDPOINTS
@app.post("/api/sign-up")
async def create_user(
    user: _schemas._UserCredentials,
    mongo_db: _pymongo.database.Database = _fastapi.Depends(_services.get_mongo_db)
):
    """Check if email already registered and register new user"""
    try:
        if not _services.validate_email(user.email):
            return _fastapi.HTTPException(status_code=406, detail="invalid email")
    
        old_user: dict = mongo_db["users"].find_one({"email": user.email})
        if old_user:
            return _fastapi.HTTPException(status_code=400, detail="e-mail already in use")
        
        user.password: str = _hash.bcrypt.hash(user.password)
        response: _pymongo.results.InsertOneResult = mongo_db["users"].insert_one(user.dict())

        return {
            "success": response.acknowledged,
            "message": "User create successfully" if response.acknowledged else "Email already in use",
            "inserted_id": str(response.inserted_id)
        }
    except Exception as e:
        print(e)

@app.post("/api/login")
async def generate_token(
    form_data: _security.OAuth2PasswordRequestForm = _fastapi.Depends(),
    mongo_db:  _pymongo.database.Database = _fastapi.Depends(_services.get_mongo_db)
):
    """Login user if exists in collection and return JWT"""
    user: dict = await _services.authenticate_user(form_data.username, form_data.password, mongo_db)
    
    if not user:
        return _fastapi.HTTPException(
            status_code=_fastapi.status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"}
        )

    response: dict = await _services.create_token(user)
    return response


@app.get("/api/me")
async def get_current_user(
    current_user = _fastapi.Depends(_services.get_current_user)
):
    return current_user

#   QUERY SERVICE
@app.get("/api/elementos")
async def get_elements(
    current_user = _fastapi.Depends(_services.get_current_user), 
    db: _orm.Session = _fastapi.Depends(_database.get_db),
    limit: int = 10, 
    page: int = 1,     
):
    paging: int = (page - 1) * limit

    try:
        elementos =  db.query(_models.Elemento).group_by(_models.Elemento.uuid).limit(limit).offset(paging).all()
        
        elements = []
        for row in elementos:         
            elements.append(row.format())
        
        return {
            'status': 'success', 
            'results': len(elements),
            'Elementos': elements
        }
    except Exception as e:
        print(e)

# CREATE ENDPOINTS
@app.post("/api/libros/insert")
async def add_books(
    libro : _schemas._Libro,
    current_user = _fastapi.Depends(_services.get_current_user), 
    db: _orm.Session = _fastapi.Depends(_database.get_db),
    qt: int = 1,
    pu: float = 0
):
    """Insert a book (item and data) in the database and return its identifier(PK)"""
    if qt < 1:
        return _fastapi.HTTPException(
            status_code=400, 
            detail="Invalid quantity",
            headers={"WWW-Authenticate": "Bearer"}
        )
    if pu < 0:
        pu = 0
    
    try:
        libro.titulo = libro.nombre
        db_response = db.query(_models.Libro).filter_by(titulo=libro.titulo).first()

        if not db_response:
            response_API = await _consumer.queryBookAPI({
                "isbn": libro.isbn
            })
            if response_API["success"]:
                try:
                    book_data = response_API["response"]["items"][0]
                    print(_json.dumps(book_data, indent=4))
                    print(type(book_data))

                    libro.autor = " & ".join(book_data["volumeInfo"]["authors"])
                    libro.nro_paginas = book_data["volumeInfo"]["pageCount"] 
                    libro.formato = book_data["volumeInfo"]["printType"]
                    libro.idioma = book_data["volumeInfo"]["language"]
                    libro.fecha_publicacion = book_data["volumeInfo"]["publishedDate"]
                    libro.editorial = book_data["volumeInfo"]["publisher"]
                except Exception as e:
                    print(e)

            libro.tipo = "libro"
            libro = _models.Libro(**dict(libro))
            libro_response = _services.insert_on_db(libro)

            if not libro_response["success"]:
                return _fastapi.HTTPException(
                    status_code=500,
                    detail=libro_response,
                    headers={"WWW-Authenticate": "Bearer"}
                )
        
        item_data = {
            "titulo": libro.titulo,
            "precio_compra": pu,
            "valor": pu
        }

        items_response = []
        for _ in range(qt):
            new_item = _models.Inventario_libro(**item_data)
            insert_item_response = _services.insert_on_db(new_item)
            items_response.append(insert_item_response)
        items_success = sum([res_item["success"] for res_item in items_response])
        return {
            "success": True,
            "libro": libro,
            "message": f"{items_success} items added sucessfully",
            "items response": items_response,
        }
    except Exception as e:
        print(e)
        return _fastapi.HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error type": str(type(e))
            },
            headers={"WWW-Authenticate": "Bearer"}
        )

@app.post("/api/juguetes/insert")
async def add_toys(
    juguete : _schemas._Juguete,
    current_user = _fastapi.Depends(_services.get_current_user), 
    db: _orm.Session = _fastapi.Depends(_database.get_db),
    qt: int = 1,
    pu: float = 0
):
    """Insert a toy(item and data) in the database and return its identifier(uuid)"""
    if qt < 1:
        return _fastapi.HTTPException(
            status_code=400, 
            detail="Invalid quantity",
            headers={"WWW-Authenticate": "Bearer"}
        )
    if pu < 0:
        pu = 0
    
    try:
        db_response = db.query(_models.Juguete).filter_by(nombre=juguete.nombre).first()
        if not db_response:
            juguete.tipo = "juguete"
            juguete = _models.Juguete(**dict(juguete))
            juguete_response = _services.insert_on_db(juguete)

            if not juguete_response["success"]:
                return _fastapi.HTTPException(
                    status_code=500,
                    detail=juguete_response,
                    headers={"WWW-Authenticate": "Bearer"}
                )

        item_data = {
            "nombre": juguete.nombre,
            "precio_compra": pu,
            "valor": pu
        }
        items_response = []
        for _ in range(qt):
            new_item = _models.Inventario_juguete(**item_data)
            insert_item_response = _services.insert_on_db(new_item) 
            items_response.append(insert_item_response)
        
        items_success = sum([res_item["success"] for res_item in items_response])

        return {
            "success": True,
            "juguete": juguete,
            "message": f"{items_success} items added sucessfully",
            "items response": items_response,
        }
    except Exception as e:
        print(e)
        return _fastapi.HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error type": str(type(e))
            },
            headers={"WWW-Authenticate": "Bearer"}
        )

# QUERY ENDPOINTS
@app.get("/api/libros")
async def get_books(
    current_user = _fastapi.Depends(_services.get_current_user), 
    db: _orm.Session = _fastapi.Depends(_database.get_db),
    limit: int = 10, 
    page: int = 1
):
    paging: int = (page - 1) * limit

    try:
        books =  db.query(_models.Libro).limit(limit).offset(paging).all()
        
        response = []
        for book in books:         
            response.append(book.__dict__)
        
        return {
            'status': 'success', 
            'results': len(response),
            'Libros': response
        }
    except Exception as e:
        print(e)
        return _fastapi.HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error type": str(type(e))
            },
            headers={"WWW-Authenticate": "Bearer"}
        )

@app.get("/api/juguetes")
async def get_toys(
    current_user = _fastapi.Depends(_services.get_current_user), 
    db: _orm.Session = _fastapi.Depends(_database.get_db),
    limit: int = 10, 
    page: int = 1
):
    if page < 0:
        return _fastapi.HTTPException(
            status_code=400,    # Bad request
            detail={
                "success": False,
                "error type": "pagging not valid"
            },
            headers={"WWW-Authenticate": "Bearer"}
        )
    paging: int = (page - 1) * limit

    try:
        juguetes =  db.query(_models.Juguete).limit(limit).offset(paging).all()
        
        response = []
        for juguete in juguetes:         
            response.append(juguete.__dict__)
        
        return {
            'status': 'success', 
            'results': len(response),
            'Juguetes': response
        }
    except Exception as e:
        print(e)
        return _fastapi.HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error type": str(type(e))
            },
            headers={"WWW-Authenticate": "Bearer"}
        )

@app.get("/api/inventario_libros")
async def get_inventario_libros(
    current_user = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_database.get_db),
):
    try:
        db_response = db.query(_models.Inventario_libro).all()
        return {
            "success": True,
            "#": len(db_response),
            "Libros": [ins.__dict__ for ins in db_response]
        }
    except Exception as e:
        print(e)
        return _fastapi.HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error type": str(type(e))
            },
            headers={"WWW-Authenticate": "Bearer"}
        )

@app.get("/api/inventario_juguetes")
async def get_inventario_juguetes(
    current_user = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_database.get_db),
):
    try:
        db_response = db.query(_models.Inventario_juguete).all()
        return {
            "success": True,
            "#": len(db_response),
            "Juguetes": [ins.__dict__ for ins in db_response]
        }
    except Exception as e:
        print(e)
        return _fastapi.HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error type": str(type(e))
            },
            headers={"WWW-Authenticate": "Bearer"}
        )