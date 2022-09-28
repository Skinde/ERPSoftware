import fastapi as _fastapi
import fastapi.security as _security
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
@app.post("/api/users")
async def create_user(
    user: _schemas._UserCreate,
    mongo_db: _pymongo.database.Database = _fastapi.Depends(_services.get_mongo_db)
):
    old_user: dict = mongo_db["users"].find_one({"email": user.email})

    if old_user:
        raise _fastapi.HTTPException(status_code=400, detail="e-mail already in use")

    try:
        user.password = _hash.pbkdf2_sha256.hash(user.password)

        response: _pymongo.results.InsertOneResult = mongo_db["users"].insert_one(user.dict())

        return {
            "success": response.acknowledged,
            "inserted_id": str(response.inserted_id)
        }
    except Exception as e:
        print(e)

@app.post("/api/token")
async def generate_token(
    form_data: _security.OAuth2PasswordRequestForm = _fastapi.Depends(),
    mongo_db:  _pymongo.database.Database = _fastapi.Depends(_services.get_mongo_db)
):
    user: dict = await _services.authenticate_user(form_data.username, form_data.password, mongo_db)
    
    if not user:
        raise _fastapi.HTTPException(status_code=401, detail="Invalid Credentials")

    response: dict = await _services.create_token(user)
    return response


@app.get("/api/users/me")
async def get_current_user(current_user = _fastapi.Depends(_services.get_current_user)):
    return current_user

# TEST ENDPOINTS
@app.post("/try/users")
async def sign_up(username: str, password: str):
    # MONGO
    mongo_db = _services.get_mongo_db()
    
    mongo_db["users"].delete_many({})
    response = mongo_db["users"].insert_one({
        "username": username,
        "password": _hash.pbkdf2_sha256.hash(password)
    })

    return {
        "mongo_db": {
            "success": response.acknowledged,
            "inserted_id": str(response.inserted_id)
        }
    }

@app.get("/try/users/{user_email}")
async def query_user(user_email):
    # MONGO
    mongo_db = _services.get_mongo_db()
    db_response = mongo_db["users"].find_one({"email": user_email})

    return {
        "mongo_db": { k:str(v) for k,v in db_response.items() }
    }

"""
TASKS:
- manage migrations with sqlalchemy

SOURCES:
https://stackoverflow.com/questions/3582552/what-is-the-format-for-the-postgresql-connection-string-url
https://www.tutorialspoint.com/sqlalchemy/index.htm
"""