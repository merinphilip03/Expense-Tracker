from sqlalchemy import Column, Integer, String, Float, Text, Date, DateTime, Enum as SAEnum
from sqlalchemy.sql import func
from database import Base
import enum

class CategoryEnum(str, enum.Enum):
    Food          = "Food"
    Transport     = "Transport"
    Shopping      = "Shopping"
    Bills         = "Bills"
    Entertainment = "Entertainment"
    Other         = "Other"

class Expense(Base):
    __tablename__ = "expenses"

    id         = Column(Integer, primary_key=True, index=True)
    title      = Column(String(100), nullable=False)
    amount     = Column(Float, nullable=False)
    category   = Column(SAEnum(CategoryEnum), nullable=False)
    date       = Column(Date, nullable=False)
    note       = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())