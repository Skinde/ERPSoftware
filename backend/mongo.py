import dotenv as _dotenv
import pymongo as _pymongo

import os

_dotenv.load_dotenv()
MONGO_URI = os.environ.get("MONGO_URI")
MONGO_DATABASE = os.environ.get("MONGO_DATABASE")

client: _pymongo.mongo_client.MongoClient = _pymongo.MongoClient(MONGO_URI)
no_sql_db: _pymongo.database.Database = client[MONGO_DATABASE]

