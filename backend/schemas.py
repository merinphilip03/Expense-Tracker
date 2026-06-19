from __future__ import annotations
from pydantic import BaseModel, Field
from typing import Optional
import datetime
from models import CategoryEnum


class ExpenseBase(BaseModel):
    title:    str          = Field(..., min_length=1, max_length=100)
    amount:   float        = Field(..., gt=0)
    category: CategoryEnum
    date:     datetime.date
    note:     Optional[str] = None


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(BaseModel):
    title:    Optional[str]          = Field(None, min_length=1, max_length=100)
    amount:   Optional[float]        = Field(None, gt=0)
    category: Optional[CategoryEnum] = None
    date:     Optional[datetime.date] = None
    note:     Optional[str]          = None


class ExpenseResponse(ExpenseBase):
    id:         int
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True


class CategorySummary(BaseModel):
    category: CategoryEnum
    total:    float
    count:    int


class MonthlySummary(BaseModel):
    month:       int
    year:        int
    total_spent: float
    breakdown:   list[CategorySummary]
