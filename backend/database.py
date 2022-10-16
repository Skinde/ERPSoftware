import sqlalchemy as _sqlalchemy
import sqlalchemy.orm as _orm
import dotenv as _dotenv
_dotenv.load_dotenv()

import os

SQLALCHEMY_DATABASE_URL = os.environ.get('PSQL_URI')

engine = _sqlalchemy.create_engine(SQLALCHEMY_DATABASE_URL) # connect_args = {"check_same_thread": False}

Session = _orm.sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = _orm.declarative_base(bind=engine)

def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()

"""
SOURCE:
    https://docs.sqlalchemy.org/en/14/orm/quickstart.html
    https://docs.sqlalchemy.org/en/14/tutorial/engine.html
    https://docs.sqlalchemy.org/en/14/orm/session_api.html#sqlalchemy.orm.Session
    https://docs.sqlalchemy.org/en/14/orm/extensions/declarative/
"""