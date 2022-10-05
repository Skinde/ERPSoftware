import pydantic as _pydantic
import typing as _typing

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