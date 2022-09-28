from typing import final
import fastapi as _fastapi
import passlib.hash as _hash
import sqlalchemy.orm as _orm

import mongo as _mongo
import database as _database

def create_database():
    return _database.Base.metadata.create_all(bind=_database.engine)


def get_psql():
    db = _database.Session()
    try:
        yield db
    finally:
        db.close()

def get_mongo_db():
    return _mongo.no_sql_db

def get_mongo_client():
    return _mongo.client

"""
https://www.simplilearn.com/tutorials/python-tutorial/yield-in-python
https://stackoverflow.com/questions/231767/what-does-the-yield-keyword-do

https://fastapi.tiangolo.com/python-types/
https://pydantic-docs.helpmanual.io/
https://fastapi.tiangolo.com/tutorial/security/

DOCKER:
    https://www.youtube.com/watch?v=NVvZNmfqg6M
"""