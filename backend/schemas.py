import pydantic as _pydantic
import typing as _typing

class _UserBase(_pydantic.BaseModel):
    email: str
    id: _typing.Optional[str] = "1"
    documento: _typing.Optional[str] = ""

class _UserCreate(_UserBase):    
    password: str

    class Config:
        orm_mode = True