from typing import Type, List, TypeVar
from pandas import Series
from sqlalchemy import Column, ForeignKey, MetaData
from sqlalchemy.orm import declarative_base

YEAR_EXTRACTION = 2021

Base = declarative_base(metadata=MetaData(schema='dimensional'))


T = TypeVar('T', bound=Base)


def get_cols(table: Type[T] | T) -> List[Column]:
    return [c for c in table.__table__.columns]


def get_pk(table: Type[T] | T) -> Column:
    return next(table.__table__.primary_key.__iter__())


def create_fk(table: Type[T] | T) -> ForeignKey:
    return ForeignKey(get_pk(table))


def extrair_tupla(row: Series, table: Type[T]) -> T:
    columns = [x.name for x in get_cols(table)]
    columns.remove(get_pk(table).name)

    return table(**row[columns].to_dict())