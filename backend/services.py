import dotenv as _dotenv
_dotenv.load_dotenv()

import jwt as _jwt
import fastapi as _fastapi
import fastapi.security as _security
import os
import passlib.hash as _hash
import pymongo as _pymongo
import sqlalchemy.orm as _orm

import mongo as _mongo
import database as _database
import models as _models
import schemas as _schemas

oauth2_scheme = _security.OAuth2PasswordBearer(tokenUrl="/api/login")
JWT_SECRET = os.environ.get("JWT_SECRET_KEY")

def create_database():
    return _database.Base.metadata.create_all(bind=_database.engine)

def get_mongo_db():
    return _mongo.no_sql_db

def get_mongo_client():
    return _mongo.client

async def get_current_user(
    mongo_db: _pymongo.database.Database = _fastapi.Depends(get_mongo_db),
    token: str = _fastapi.Depends(oauth2_scheme),
):
    """Get email and password of current user if it is logged in"""
    collection = "users"
    try:
        payload: dict = _jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user: dict = mongo_db[collection].find_one({"email": payload["email"]})
    except:
        raise _fastapi.HTTPException(
            status_code=401, detail="Invalid Email or Password"
        )

    return _schemas._UserCredentials(**user)

async def authenticate_user(
    user_email: str, 
    password: str, 
    mongo_db: _pymongo.database.Database
):
    """Check if user exists in collection"""
    collection = "users"
    user: dict = mongo_db[collection].find_one({"email": user_email})

    if not user:
        return False
    if not _hash.bcrypt.verify(password, user["password"]):
        return False

    return user

async def create_token(user: dict):
    """Create a JWT based on user email"""
    user_obj = _schemas._UserBase(**user)
    token: str = _jwt.encode(user_obj.dict(), JWT_SECRET)

    return {
        "access_token": token,
        "token_type": "bearer"
    }

"""
https://www.simplilearn.com/tutorials/python-tutorial/yield-in-python
https://stackoverflow.com/questions/231767/what-does-the-yield-keyword-do

https://fastapi.tiangolo.com/python-types/
https://pydantic-docs.helpmanual.io/
https://fastapi.tiangolo.com/tutorial/security/

DOCKER:
    https://www.youtube.com/watch?v=NVvZNmfqg6M
"""