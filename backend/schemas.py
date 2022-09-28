import pydantic as _pydantic

class _UserBase(_pydantic.BaseModel):
    username: str
    email: str

class UserCreate(_UserBase):
    password: str

    class Config:
        orm_mode = True