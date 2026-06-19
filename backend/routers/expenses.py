from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import date, datetime
from typing import Optional

import crud
import schemas
from database import get_db

router = APIRouter(prefix="/expenses", tags=["expenses"])


@router.get("/summary", response_model=schemas.MonthlySummary)
def get_monthly_summary(
    month: int = Query(default=None, ge=1, le=12),
    year:  int = Query(default=None, ge=2000),
    db:    Session = Depends(get_db),
):
    today = datetime.today()
    return crud.get_monthly_summary(
        db,
        month=month or today.month,
        year=year  or today.year,
    )


@router.get("/", response_model=list[schemas.ExpenseResponse])
def get_expenses(
    category:     Optional[str]  = Query(default=None),
    date_from:    Optional[date] = Query(default=None),
    date_to:      Optional[date] = Query(default=None),
    title_search: Optional[str]  = Query(default=None),
    db:           Session        = Depends(get_db),
):
    return crud.get_expenses(
        db,
        category=category,
        date_from=date_from,
        date_to=date_to,
        title_search=title_search,
    )


@router.get("/{expense_id}", response_model=schemas.ExpenseResponse)
def get_expense(expense_id: int, db: Session = Depends(get_db)):
    expense = crud.get_expense_by_id(db, expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense


@router.post("/", response_model=schemas.ExpenseResponse, status_code=201)
def create_expense(expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    return crud.create_expense(db, expense)


@router.put("/{expense_id}", response_model=schemas.ExpenseResponse)
def update_expense(
    expense_id: int,
    updates:    schemas.ExpenseUpdate,
    db:         Session = Depends(get_db),
):
    expense = crud.update_expense(db, expense_id, updates)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense


@router.delete("/{expense_id}", status_code=204)
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_expense(db, expense_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Expense not found")