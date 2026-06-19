from __future__ import annotations

from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import date
from typing import Optional

import models
import schemas


def get_expenses(
    db:           Session,
    category:     Optional[str]  = None,
    date_from:    Optional[date] = None,
    date_to:      Optional[date] = None,
    title_search: Optional[str]  = None,
) -> list[models.Expense]:
    query = db.query(models.Expense)

    if category:
        query = query.filter(models.Expense.category == category)
    if date_from:
        query = query.filter(models.Expense.date >= date_from)
    if date_to:
        query = query.filter(models.Expense.date <= date_to)
    if title_search:
        query = query.filter(
            models.Expense.title.ilike(f"%{title_search}%")
        )

    return query.order_by(models.Expense.date.desc()).all()


def get_expense_by_id(db: Session, expense_id: int) -> models.Expense | None:
    return db.query(models.Expense).filter(models.Expense.id == expense_id).first()


def create_expense(db: Session, expense: schemas.ExpenseCreate) -> models.Expense:
    db_expense = models.Expense(**expense.model_dump())
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense


def update_expense(
    db:         Session,
    expense_id: int,
    updates:    schemas.ExpenseUpdate,
) -> models.Expense | None:
    db_expense = get_expense_by_id(db, expense_id)
    if not db_expense:
        return None

    for field, value in updates.model_dump(exclude_unset=True).items():
        setattr(db_expense, field, value)

    db.commit()
    db.refresh(db_expense)
    return db_expense


def delete_expense(db: Session, expense_id: int) -> bool:
    db_expense = get_expense_by_id(db, expense_id)
    if not db_expense:
        return False

    db.delete(db_expense)
    db.commit()
    return True


def get_monthly_summary(db: Session, month: int, year: int) -> schemas.MonthlySummary:
    rows = (
        db.query(
            models.Expense.category,
            func.sum(models.Expense.amount).label("total"),
            func.count(models.Expense.id).label("count"),
        )
        .filter(extract("month", models.Expense.date) == month)
        .filter(extract("year",  models.Expense.date) == year)
        .group_by(models.Expense.category)
        .all()
    )

    breakdown = [
        schemas.CategorySummary(category=row.category, total=round(row.total, 2), count=row.count)
        for row in rows
    ]

    total_spent = round(sum(item.total for item in breakdown), 2)

    return schemas.MonthlySummary(
        month=month,
        year=year,
        total_spent=total_spent,
        breakdown=breakdown,
    )