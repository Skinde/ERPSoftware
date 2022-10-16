import datetime as _datetime
import sqlalchemy as _sqlalchemy
import sqlalchemy.orm as _orm
import sqlalchemy.dialects.postgresql as _psql
import database as _database
import uuid as _uuid

def generate_uuid():
    return str(_uuid.uuid4())
class Elemento(_database.Base):
    __tablename__ = 'elemento'
    uuid = _sqlalchemy.Column(_psql.UUID(as_uuid=True), primary_key=True, server_default=_sqlalchemy.text("md5(random()::text || clock_timestamp()::text)::uuid"))
    # uuid = _sqlalchemy.Column(_sqlalchemy.String, primary_key=True, default=generate_uuid)

    proveedor = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    tipo = _sqlalchemy.Column(_sqlalchemy.String, nullable=False)

    fecha_adquisicion = _sqlalchemy.Column(_sqlalchemy.DateTime, default=_datetime.datetime.now)
    fecha_caducidad = _sqlalchemy.Column(_sqlalchemy.DateTime, nullable=True)
    
    peso = _sqlalchemy.Column(_sqlalchemy.Float, nullable=True)
    precio_compra = _sqlalchemy.Column(_sqlalchemy.Float, nullable=True)
    sede = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)    
    
    __mapper_args__ = {
        "polymorphic_identity": "elemento"
    }

    def format(self):
        return {
            'uuid': self.uuid,
            'proveedor': self.proveedor,
            'tipo': self.tipo,
            'fecha_adquisicion': self.fecha_adquisicion,
            'fecha_caducidad': self.fecha_caducidad,                   
            'peso': self.peso,                                         
            'precio_compra': self.precio_compra,                                         
            'sede': self.sede,                                         
        }

    def insert(self):
        session = _database.Session()
        try:
            session.add(self)
            session.commit()

            return self.uuid
        except Exception as e:
            session.rollback()
        finally:
            session.close()
    
    def update(self):
        session = _database.Session()
        try:
            session.commit()
        except Exception as e:
            session.rollback()
        finally:
            session.close()

    def delete(self):
        session = _database.Session()
        try:
            session.delete(self)
            session.commit()
        except Exception as e:
            session.rollback()
        finally:
            session.close()

    def __repr__(self) -> str:
       return f"Element({self.uuid} {self.tipo})"

class Libro(Elemento):
    __tablename__ = 'libro'
    uuid = _sqlalchemy.Column(_psql.UUID(as_uuid=True), _sqlalchemy.ForeignKey("elemento.uuid"), primary_key=True)
    titulo = _sqlalchemy.Column(_sqlalchemy.String, nullable=False)

    isbn = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    autor = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    genero = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    edicion = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    editorial = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    idioma = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)

    fecha_publicacion = _sqlalchemy.Column(_sqlalchemy.Date, nullable=True)
    nro_paginas = _sqlalchemy.Column(_sqlalchemy.Integer, nullable=True)

    __mapper_args__ = {
        "polymorphic_identity": "libro",
        "inherit_condition": (uuid == Elemento.uuid)
    }
    def format(self):
        return {
            'uuid': self.uuid,
            'titulo': self.titulo,
            'isbn': self.isbn,
            'autor': self.autor,
            'genero': self.genero,
            'edicion': self.edicion,                   
            'editorial': self.editorial,                                         
            'idioma': self.idioma,                                         
            'fecha_publicacion': self.fecha_publicacion,                                         
            'nro_paginas': self.nro_paginas,                                         
        }

    def insert(self):
        session = _database.Session()
        try:
            session.add(self)
            session.commit()

            return self.uuid
        except Exception as e:
            session.rollback()
        finally:
            session.close()
    
    def update(self):
        session = _database.Session()
        try:
            session.commit()
        except Exception as e:
            session.rollback()
        finally:
            session.close()

    def delete(self):
        session = _database.Session()
        try:
            session.delete(self)
            session.commit()
        except Exception as e:
            session.rollback()
        finally:
            session.close()
    
    def __repr__(self) -> str:
        return f"Libro ({self.uuid} {self.nombre})"

class Juguete(Elemento):
    __tablename__ = "juguete"
    uuid = _sqlalchemy.Column(_psql.UUID(as_uuid=True), _sqlalchemy.ForeignKey("elemento.uuid"), primary_key=True)
    nombre = _sqlalchemy.Column(_sqlalchemy.String, nullable=False)

    rango_edad = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)

    __mapper_args__ = {
        "polymorphic_identity": "juguete",
        "inherit_condition": (uuid == Elemento.uuid)
    }
    def format(self):
        return {
            'uuid': self.uuid,
            'nombre': self.nombre,
            'rango_edad': self.rango_edad,
        }

    def insert(self):
        session = _database.Session()
        try:
            session.add(self)
            session.commit()

            return self.uuid
        except Exception as e:
            session.rollback()
        finally:
            session.close()
    
    def update(self):
        session = _database.Session()
        try:
            session.commit()
        except Exception as e:
            session.rollback()
        finally:
            session.close()

    def delete(self):
        session = _database.Session()
        try:
            session.delete(self)
            session.commit()
        except Exception as e:
            session.rollback()
        finally:
            session.close()
    
    def __repr__(self) -> str:
        return f"Juguete ({self.uuid} {self.nombre})"

"""
MANAGE UUID
https://stackoverflow.com/questions/183042/how-can-i-use-uuids-in-sqlalchemy
https://stackoverflow.com/questions/55917056/how-to-prevent-uuid-primary-key-for-new-sqlalchemy-objects-being-created-with-th

SQLALCHEMY INHERITANCE
https://stackoverflow.com/questions/1337095/sqlalchemy-inheritance
https://docs.sqlalchemy.org/en/14/orm/inheritance.html
"""