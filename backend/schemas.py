import datetime as _datetime
import pydantic as _pydantic
import typing as _typing

# USER
class _UserBase(_pydantic.BaseModel):
    email: _pydantic.EmailStr 

class _UserCredentials(_UserBase):    
    password: str

    class Config:
        orm_mode = True

class _UserData(_UserBase):
    documento: _typing.Optional[str] = ""
    sede: _typing.Optional[str] = ""

    class Config:
        orm_mode = True

# ELEMENTO
class _Elemento(_pydantic.BaseModel):
    nombre: str
    tipo: _typing.Optional[str] = ""

    peso: _typing.Optional[float] = -1
    dimensiones: _typing.Optional[str] = ""
    proveedor: _typing.Optional[str] = ""
    ranking: _typing.Optional[str] = ""
    class Config:
        orm_mode = True

# LIBRO
class _Libro(_Elemento):
    autor: _typing.Optional[str] = ""
    idioma: _typing.Optional[str] = ""
    editorial: _typing.Optional[str] = ""
    formato: _typing.Optional[str] = ""
    fecha_publicacion: _typing.Optional[_datetime.date]
    genero: _typing.Optional[str] = ""
    edicion: _typing.Optional[str] = ""
    nro_paginas: _typing.Optional[int] = -1

    class Config:
        orm_mode = True

# JUGUETE
class _Juguete(_Elemento):
    tema: _typing.Optional[str] = ""
    material_principal: _typing.Optional[str] = ""
    fuente_energia: _typing.Optional[str] = ""
    modo_juego: _typing.Optional[str] = ""
    publico_objetivo: _typing.Optional[str] = ""

    class Config:
        orm_mode = True

# INMUEBLE
class _Inmueble(_Elemento):
    nombre: str

    categoria: _typing.Optional[str] = ""
    descripcion: _typing.Optional[str] = ""
    estado: _typing.Optional[str] = ""

    class Config:
        orm_mode = True

# ITEM LIBRO
class _ItemLibro(_pydantic.BaseModel):
    isbn: str
    titulo: str

    estado: _typing.Optional[str] = ""
    sede: _typing.Optional[str] = ""
    precio_compra: _typing.Optional[float] = -1
    valor: _typing.Optional[float] = -1
    fecha_adquisicion: _typing.Optional[_datetime.datetime] = _datetime.datetime.now
    fecha_caducidad: _typing.Optional[_datetime.datetime]

    class Config:
        orm_mode = True

# ITEM JUGUETE
class _ItemJuguete(_pydantic.BaseModel):
    uuid: str
    nombre: str

    estado: _typing.Optional[str] = ""
    sede: _typing.Optional[str] = ""
    precio_compra: _typing.Optional[float] = -1
    valor: _typing.Optional[float] = -1
    fecha_adquisicion: _typing.Optional[_datetime.datetime] = _datetime.datetime.now
    fecha_caducidad: _typing.Optional[_datetime.datetime]

    class Config:
        orm_mode = True
