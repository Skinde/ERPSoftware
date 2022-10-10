import fastapi as _fastapi
import fastapi.security as _security
import json as _json
import passlib.hash as _hash
import pymongo as _pymongo

import database as _database
import schemas as _schemas
import models as _models
import services as _services

import sqlalchemy as _sqlalchemy
import sqlalchemy.orm as _orm

_services.create_database()

# GLOBAL VARIABLES
app = _fastapi.FastAPI()

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
            raise _fastapi.HTTPException(status_code=406, detail="invalid email")
    
        old_user: dict = mongo_db["users"].find_one({"email": user.email})
        if old_user:
            raise _fastapi.HTTPException(status_code=400, detail="e-mail already in use")
        
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
        raise _fastapi.HTTPException(
            status_code=_fastapi.status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"}
        )

    response: dict = await _services.create_token(user)
    return response


@app.get("/api/me")
async def get_current_user(current_user = _fastapi.Depends(_services.get_current_user)):
    return current_user

#   QUERY SERVICE
@app.get("/api/elementos")
async def get_elements(
    current_user = _fastapi.Depends(_services.get_current_user), 
    db: _orm.Session = _fastapi.Depends(_database.get_db),
    limit: int = 10, 
    page: int = 1, 
    search: str = ''
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
@app.post("/api/libros")
async def add_books(
    libro : _schemas._Libro,
    current_user = _fastapi.Depends(_services.get_current_user), 
    db: _orm.Session = _fastapi.Depends(_database.get_db)
):
    try:
        libro = dict(libro)
        libro = _models.Libro(**libro)
        libro_uuid = libro.insert()

        return {
            "uuid": libro_uuid,
            "success": True,
            "libro": libro
        }
    except Exception as e:
        print(e)

@app.post("/api/juguetes")
async def add_toys(
    juguete : _schemas._Juguete,
    current_user = _fastapi.Depends(_services.get_current_user), 
    db: _orm.Session = _fastapi.Depends(_database.get_db)
):
    try:
        juguete = dict(juguete)
        juguete = _models.Juguete(**juguete)
        juguete_uuid = juguete.insert()
        
        return {
            "uuid": juguete_uuid,
            "success": True,
            "juguete": juguete
        }
    except Exception as e:
        print(e)

# QUERY ENDPOINTS
@app.get("/api/libros")
async def get_books(
    #libro : _schemas._Libro,
    current_user = _fastapi.Depends(_services.get_current_user), 
    db: _orm.Session = _fastapi.Depends(_database.get_db),
    limit: int = 10, 
    page: int = 1, 
    search: str = ''
):
    paging: int = (page - 1) * limit

    try:
        elementos =  db.query(_models.Libro).limit(limit).offset(paging).all()
        
        elements = []
        for row in elementos:         
            elements.append(row.format())
        
        return {
            'status': 'success', 
            'results': len(elements),
            'Libros': elements
        }
    except Exception as e:
        print(e)

    

@app.get("/api/juguetes")
async def get_toys(
    #juguete : _schemas._Juguete,
    current_user = _fastapi.Depends(_services.get_current_user), 
    db: _orm.Session = _fastapi.Depends(_database.get_db),
    limit: int = 10, 
    page: int = 1, 
    search: str = ''
):
    paging: int = (page - 1) * limit

    try:
        elementos =  db.query(_models.Juguete).limit(limit).offset(paging).all()
        
        elements = []
        for row in elementos:         
            elements.append(row.format())
        
        return {
            'status': 'success', 
            'results': len(elements),
            'Juguetes': elements
        }
    except Exception as e:
        print(e)
    

# TEST ENDPOINTS
""" 
@app.post("/try/users")
async def sign_up(username: str, password: str):
    mongo_db = _services.get_mongo_db()
    collection = "users"
    
    del_response: _pymongo.results.DeleteResult = mongo_db[collection].delete_many({})
    
    response: _pymongo.results.InsertOneResult = mongo_db[collection].insert_one({
        "username": username,
        "password": _hash.pbkdf2_sha256.hash(password),
    })

    return {
        "mongo_db": {
            "success": response.acknowledged,
            "inserted_id": str(response.inserted_id),
            "del response": {
                "success": response.acknowledged,
                "deleted count": del_response.deleted_count
            }
        }
    }

@app.get("/try/users/{user_email}")
async def query_user(user_email):
    mongo_db = _services.get_mongo_db()
    db_response: _pymongo.results.InsertOneResult = mongo_db["users"].find_one({"email": user_email})

    return {
        "mongo_db": { k:str(v) for k,v in db_response.items() }
    }
"""

"""
PSQL URI
    https://stackoverflow.com/questions/3582552/what-is-the-format-for-the-postgresql-connection-string-url
    https://www.tutorialspoint.com/sqlalchemy/index.htm

TypeError: ObjectId('') is not JSON serializable
    https://stackoverflow.com/questions/16586180/typeerror-objectid-is-not-json-serializable
"""