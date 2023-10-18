from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import Session
from app.database import Base


class Story(Base):
    __tablename__ = "stories"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String)
    likes = Column(Integer, default=0)
