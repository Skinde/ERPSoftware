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
    id: _typing.Optional[int] = -1
    username: _typing.Optional[str] = ""
    documento: _typing.Optional[str] = ""
    sede: str

    class Config:
        orm_mode = True

# ELEMENTO
class _Elemento(_pydantic.BaseModel):
    proveedor: _typing.Optional[str]
    tipo: str
    fecha_adquisicion: _datetime.datetime = _datetime.datetime.now()
    fecha_caducidad: _typing.Optional[_datetime.datetime]
    peso: _typing.Optional[float]
    precio_compra: _typing.Optional[float]
    sede: _typing.Optional[str]

    class Config:
        orm_mode = True

# LIBRO
class _Libro(_Elemento):
    titulo: str

    isbn: _typing.Optional[str]
    autor: _typing.Optional[str]
    genero: _typing.Optional[str]
    edicion: _typing.Optional[str]
    editorial: _typing.Optional[str]
    idioma: _typing.Optional[str]

    fecha_publicacion: _typing.Optional[_datetime.date]
    nro_paginas: _typing.Optional[int]

    class Config:
        orm_mode = True

# JUGUETE
class _Juguete(_Elemento):
    nombre: str

    rango_edad: _typing.Optional[str]
    class Config:
        orm_mode = True