import dotenv as _dotenv
import pymongo as _pymongo

import os

_dotenv.load_dotenv()
MONGO_URI = os.environ.get("MONGO_URI")
MONGO_DATABASE = os.environ.get("MONGO_DATABASE")

client = _pymongo.MongoClient(MONGO_URI)
no_sql_db = client[MONGO_DATABASE]
