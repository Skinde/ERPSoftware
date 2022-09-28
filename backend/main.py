import fastapi as _fastapi
import passlib.hash as _hash


import database as _database
import schemas as _schemas
import models as _models
import services as _services

from sqlalchemy import inspect

_services.create_database()

# GLOBAL VARIABLES
app = _fastapi.FastAPI()

# ENDPOINTS
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
            "psql schema names": inspect(_database.engine).get_schema_names(),
            "psql tables": list(_database.Base.metadata.tables.keys())
        }
    }

@app.post("/api/users")
async def create_user(
    user: _schemas.UserCreate
):
    user.password = _hash.pbkdf2_sha256.hash(user.password)

    mongo_db = _services.get_mongo_db()
    response = mongo_db["users"].insert_one(user.dict())
    
    query = mongo_db["users"].find_one({"email": user.email})
    query = {k:str(v) for k, v in query.items()}
    
    return {
        "success": response.acknowledged,
        "inserted_id": str(response.inserted_id),
        "query on inserted_object": query
    }


@app.post("/try/users")
async def sign_up(username: str, password: str):
    # MONGO
    mongo_db = _services.get_mongo_db()
    
    mongo_db["users"].delete_many({})
    response = mongo_db["users"].insert_one({
        "username": username,
        "password": _hash.pbkdf2_sha256.hash(password)
    })
    
    # PSQL
    session = _database.Session()
    session.query(_models.Usuario).delete()

    new_user = _models.Usuario(**{
        "username": username,
        "password": password
    })
    session.add(new_user)
    session.commit()
    
    query_all = session.query(_models.Usuario).all()
    session.close()

    return {
        "mongo_db": {
            "success": response.acknowledged,
            "inserted_id": str(response.inserted_id)
        },
        "psql": query_all
    }

@app.get("/try/users/{username}")
async def query_user(username):
    mongo_db = _services.get_mongo_db()
    db_response = mongo_db["users"].find_one({"username": username})
    return {
        "mongo_db": { k:str(v) for k,v in db_response.items() },
        "psql": {
            
        }
    }


"""
TASKS:
- manage migrations with sqlalchemy

SOURCES:
https://stackoverflow.com/questions/3582552/what-is-the-format-for-the-postgresql-connection-string-url
https://www.tutorialspoint.com/sqlalchemy/index.htm
"""