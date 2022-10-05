import datetime as _datetime
import sqlalchemy as _sqlalchemy
import database as _database
import uuid as _uuid

class Usuario(_database.Base):
    __tablename__ = 'usuario'
    id = _sqlalchemy.Column(_sqlalchemy.Integer, primary_key=True, index=True)

    username = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    password = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    email = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    documento = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    sede = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)

    def insert(self):
        pass

    def update(self):
        pass

    def delete(self):
        pass

    def __repr__(self) -> str:
       return f"User({self.id} {self.username})"

class Elemento(_database.Base):
    __tablename__ = 'elemento'

    uuid = _sqlalchemy.Column(_sqlalchemy.String, primary_key=True, default=_uuid.uuid4)
    nombre = _sqlalchemy.Column(_sqlalchemy.String)
    proveedor = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    tipo = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)

    fecha_adquisicion = _sqlalchemy.Column(_sqlalchemy.DateTime, default=_datetime.datetime.now, nullable=True)
    fecha_caducidad = _sqlalchemy.Column(_sqlalchemy.DateTime, nullable=True)
    
    peso = _sqlalchemy.Column(_sqlalchemy.Float, nullable=True)
    precio_compra = _sqlalchemy.Column(_sqlalchemy.Float, nullable=True)
    sede = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)    
    
    __mapper_args__ = {
        "polymorphic_identity": "elemento"
    }

    def insert(self):
        pass

    def update(self):
        pass

    def delete(self):
        pass

    def __repr__(self) -> str:
       return f"Element({self.uuid} {self.nombre})"

class Libro(Elemento):
    __tablename__ = 'libro'

    uuid = _sqlalchemy.Column(_sqlalchemy.String, _sqlalchemy.ForeignKey("elemento.uuid"), primary_key=True)
    # titulo = _sqlalchemy.Column(_sqlalchemy.String, _sqlalchemy.ForeignKey("elemento.nombre"), primary_key=True)
    
    isbn = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    autor = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    genero = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    edicion = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    editorial = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    idioma = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)

    fecha_publicacion = _sqlalchemy.Column(_sqlalchemy.Date, nullable=True)
    nro_paginas = _sqlalchemy.Column(_sqlalchemy.Integer, nullable=True)

    __mapper_args__ = {
        "polymorphic_identity": "libro"
    }

    def insert(self):
        pass

    def update(self):
        pass

    def delete(self):
        pass

class Juguete(Elemento):
    __tablename__ = "juguete"
    uuid = _sqlalchemy.Column(_sqlalchemy.String, _sqlalchemy.ForeignKey("elemento.uuid"), primary_key=True)
    # nombre = _sqlalchemy.Column(_sqlalchemy.String, _sqlalchemy.ForeignKey("elemento.nombre"), primary_key=True)
    
    rango_edad = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    __mapper_args__ = {
        "polymorphic_identity": "juguete"
    }

    def insert(self):
        pass

    def update(self):
        pass

    def delete(self):
        pass

"""
MANAGE UUID
https://stackoverflow.com/questions/183042/how-can-i-use-uuids-in-sqlalchemy
https://stackoverflow.com/questions/55917056/how-to-prevent-uuid-primary-key-for-new-sqlalchemy-objects-being-created-with-th

SQLALCHEMY INHERITANCE
https://stackoverflow.com/questions/1337095/sqlalchemy-inheritance
https://docs.sqlalchemy.org/en/14/orm/inheritance.html
"""