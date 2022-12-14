import datetime as _datetime
import sqlalchemy as _sqlalchemy
import sqlalchemy.dialects.postgresql as _psql
import sqlalchemy.inspection as _sqlinspect
import sqlalchemy.orm as _orm
import database as _database
import uuid as _uuid



from sqlalchemy_utils.types.ts_vector import TSVectorType



class Elemento(_database.Base):
    __tablename__ = 'elemento'
    nombre = _sqlalchemy.Column(_sqlalchemy.String, primary_key=True)
    tipo = _sqlalchemy.Column(_sqlalchemy.String, nullable=False)

    peso = _sqlalchemy.Column(_sqlalchemy.Float, nullable=True)
    dimensiones = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    proveedor = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    ranking = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    
    __mapper_args__ = {
        "polymorphic_identity": "elemento",
        "polymorphic_on": tipo
    }

    # def insert(self):
    #     session = _database.Session()
    #     try:
    #         session.add(self)
    #         session.commit()
    #         session.refresh(self)
    #         pk = _sqlinspect.inspect(self).identity
    #         return {
    #             "success": True,
    #             "pk": pk
    #         }
    #     except Exception as e:
    #         session.rollback()
    #         return {
    #             "success": False,
    #             "error": {
    #                 "type": str(type(e.orig)),
    #                 "code": e.code
    #             }
    #         }
    #     finally:
    #         session.close()
    
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
       return f"Element({self.nombre} {self.tipo} {self.proveedor})"

class Libro(Elemento):
    __tablename__ = 'libro'
    titulo = _sqlalchemy.Column(_sqlalchemy.String, _sqlalchemy.ForeignKey("elemento.nombre"), primary_key=True)
    isbn = _sqlalchemy.Column(_sqlalchemy.String, nullable=False)

    autor = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    idioma = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    editorial = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    formato = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    fecha_publicacion = _sqlalchemy.Column(_sqlalchemy.Date, nullable=True)
    genero = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    edicion = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    nro_paginas = _sqlalchemy.Column(_sqlalchemy.Integer, nullable=True)
    
    
    __mapper_args__ = {
        "polymorphic_identity": "libro"
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

    inventario = _orm.relationship("Inventario_libro", back_populates="libro")

    # def insert(self):
    #     session = _database.Session()
    #     try:
    #         session.add(self)
    #         session.commit()
    #         session.refresh(self)
    #         pk = _sqlinspect.inspect(self).identity
    #         return {
    #             "success": True,
    #             "pk": pk
    #         }
    #     except Exception as e:
    #         session.rollback()
    #         return {
    #             "success": False,
    #             "error": {
    #                 "type": str(type(e.orig)),
    #                 "code": e.code
    #             }
    #         }
    #     finally:
    #         session.close()
    
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
        return f"Libro ({self.titulo} {self.autor} {self.edicion})"

class Juguete(Elemento):
    __tablename__ = "juguete"
    nombre = _sqlalchemy.Column(_sqlalchemy.Unicode(255), _sqlalchemy.ForeignKey("elemento.nombre"), primary_key=True)

    tema = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    material_principal = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    fuente_energia = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    modo_juego = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    publico_objetivo = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    
    __mapper_args__ = {
        "polymorphic_identity": "juguete"
    }

    inventario = _orm.relationship("Inventario_juguete", back_populates="juguete")

    # def insert(self):
    #     session = _database.Session()
    #     try:
    #         session.add(self)
    #         session.commit()
    #         session.refresh(self)
    #         pk = _sqlinspect.inspect(self).identity
    #         return {
    #             "success": True,
    #             "pk": pk
    #         }
    #     except Exception as e:
    #         session.rollback()
    #         return {
    #             "success": False,
    #             "error": {
    #                 "type": str(type(e.orig)),
    #                 "code": e.code
    #             }
    #         }
    #     finally:
    #         session.close()
    
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
        return f"Juguete ({self.nombre} {self.tema} {self.publico_objetivo})"

class Inmueble(Elemento):
    __tablename__ = "inmueble"
    nombre = _sqlalchemy.Column(_sqlalchemy.String, _sqlalchemy.ForeignKey("elemento.nombre"), primary_key=True)
    categoria = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    descripcion = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    estado = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)

    __mapper_args__ = {
        "polymorphic_identity": "inmueble"
    }
    def format(self):
        return {
            'uuid': self.uuid,
            'nombre': self.nombre,
            'rango_edad': self.rango_edad,
        }

    # def insert(self):
    #     session = _database.Session()
    #     try:
    #         session.add(self)
    #         session.commit()
    #         session.refresh(self)
    #         pk = _sqlinspect.inspect(self).identity
    #         return {
    #             "success": True,
    #             "pk": pk
    #         }
    #     except Exception as e:
    #         session.rollback()
    #         return {
    #             "success": False,
    #             "error": {
    #                 "type": str(type(e.orig)),
    #                 "code": e.code
    #             }
    #         }
    #     finally:
    #         session.close()
    
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
        return super().__repr__()

class Inventario_libro(_database.Base):
    __tablename__ = "inventario_libro"
    uuid = _sqlalchemy.Column(_psql.UUID(as_uuid=True), primary_key=True, server_default=_sqlalchemy.text("md5(random()::text || clock_timestamp()::text)::uuid"))
    titulo = _sqlalchemy.Column(_sqlalchemy.String, _sqlalchemy.ForeignKey("libro.titulo"), unique=False)
    
    estado = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    sede = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    precio_compra = _sqlalchemy.Column(_sqlalchemy.Float, nullable=True)
    valor = _sqlalchemy.Column(_sqlalchemy.Float, nullable=True)
    fecha_adquisicion = _sqlalchemy.Column(_sqlalchemy.DateTime, default=_datetime.datetime.now)
    fecha_caducidad = _sqlalchemy.Column(_sqlalchemy.DateTime, nullable=True)

    libro = _orm.relationship("Libro", back_populates="inventario")

    # def insert(self):
    #     session = _database.Session()
    #     try:
    #         session.add(self)
    #         session.commit()
    #         session.refresh(self)
    #         pk = _sqlinspect.inspect(self).identity
    #         return {
    #             "success": True,
    #             "pk": pk
    #         }
    #     except Exception as e:
    #         session.rollback()
    #         return {
    #             "success": False,
    #             "error": {
    #                 "type": str(type(e.orig)),
    #                 "code": e.code
    #             }
    #         }
    #     finally:
    #         session.close()
    
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
        return f"InventarioLibro({self.uuid} {self.estado} {self.valor} {self.fecha_adquisicion})"

class Inventario_juguete(_database.Base):
    __tablename__ = "inventario_juguete"
    uuid = _sqlalchemy.Column(_psql.UUID(as_uuid=True), primary_key=True, server_default=_sqlalchemy.text("md5(random()::text || clock_timestamp()::text)::uuid"))
    nombre = _sqlalchemy.Column(_sqlalchemy.String, _sqlalchemy.ForeignKey("juguete.nombre"), unique=False)

    estado = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    sede = _sqlalchemy.Column(_sqlalchemy.String, nullable=True)
    precio_compra = _sqlalchemy.Column(_sqlalchemy.Float, nullable=True)
    valor = _sqlalchemy.Column(_sqlalchemy.Float, nullable=True)
    fecha_adquisicion = _sqlalchemy.Column(_sqlalchemy.DateTime, default=_datetime.datetime.now)
    fecha_caducidad = _sqlalchemy.Column(_sqlalchemy.DateTime, nullable=True)

    juguete = _orm.relationship("Juguete", back_populates="inventario")

    # def insert(self):
    #     session = _database.Session()
    #     try:
    #         session.add(self)
    #         session.commit()
    #         session.refresh(self)
    #         pk = _sqlinspect.inspect(self).identity
    #         return {
    #             "success": True,
    #             "pk": pk
    #         }
    #     except Exception as e:
    #         session.rollback()
    #         return {
    #             "success": False,
    #             "error": {
    #                 "type": str(type(e.orig)),
    #                 "code": e.code
    #             }
    #         }
    #     finally:
    #         session.close()
        
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
        return f"InventarioJuguete ({self.uuid} {self.estado} {self.valor} {self.fecha_adquisicion})"

