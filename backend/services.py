import dotenv as _dotenv
_dotenv.load_dotenv()

import jwt as _jwt
import fastapi as _fastapi
import fastapi.security as _security
import os
import passlib.hash as _hash
import pymongo as _pymongo
import re as _re
import sqlalchemy.inspection as _sqlinspect
import sqlalchemy.orm as _orm

import mongo as _mongo
import database as _database
import models as _models
import schemas as _schemas

oauth2_scheme = _security.OAuth2PasswordBearer(tokenUrl="/api/login")
JWT_SECRET = os.environ.get("JWT_SECRET_KEY")

# BASIC SERVICES
def create_database():
    return _database.Base.metadata.create_all(bind=_database.engine)

def get_mongo_db():
    return _mongo.no_sql_db

def get_mongo_client():
    return _mongo.client

def validate_email(email: str):
    email_regex = "^[a-zA-Z0-9-_.]+@[a-zA-Z0-9]+(\.[a-z]{1,3})+$"
    
    if _re.match(email_regex, email):
        return True
    return False

# PSQL SERVICES
def insert_on_db(obj):
    session = _database.Session()
    try:
        session.add(obj)
        session.commit()
        session.refresh(obj)
        pk = _sqlinspect.inspect(obj).identity
        return {
            "success": True,
            "pk": pk
        }
    except Exception as e:
        session.rollback()
        return {
            "success": False,
            "error": {
                "type": str(type(e.orig)),
                "code": e.code
            }
        }
    finally:
        session.close()

def update_on_db(obj):
    session = _database.Session()
    try:
        session.commit()
    except Exception as e:
        session.rollback()
    finally:
        session.close()

def delete_on_db(obj):
    session = _database.Session()
    try:
        session.delete(obj)
        session.commit()
    except Exception as e:
        session.rollback()
    finally:
        session.close()

# API SERVICES
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
    """Check if user exists in collection and return it"""
    collection = "users"
    user: dict = mongo_db[collection].find_one({"email": user_email})

    if not user:
        return False
    if not _hash.bcrypt.verify(password, user["password"]):
        return False

    return user

async def create_token(user: dict):
    """Create a JWT based on user email and return it"""
    user_obj = _schemas._UserBase(**user)
    token: str = _jwt.encode(user_obj.dict(), JWT_SECRET)

    return {
        "access_token": token,
        "token_type": "bearer"
    }
