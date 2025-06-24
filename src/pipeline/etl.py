import datetime
import pandas as pd
from pandas import DataFrame, read_sql, Series
from sqlalchemy import select, text, delete
from sqlalchemy.orm import sessionmaker, Session
from src.connection import source_engine
import src.dimensional_models as models
from typing import Type, Dict, List
from src.util.orm_utils import get_pk, get_cols, T, extrair_tupla
from src.pipeline.transform.tratar_campos_texto import tratar_campos_texto
from src.util.orm_utils import YEAR_EXTRACTION
from src.pipeline.extract import extract_from_source
from src.pipeline.transform.tratar_educacao import tratar_educacao
from src.pipeline.transform.tratar_fato_trabalho_pessoa import tratar_fato_trabalho_pessoa
import ipdb

DIMENSOES_PNAD = [models.Tempo, models.Regiao, models.Individuo, models.Educacao, models.Trabalho]

CACHE: Dict[Type[T], None | DataFrame] = {
    d: None for d in [
        *DIMENSOES_PNAD
    ]
}

def extract(year: int,apply_web_scraping=False,debug=False) -> DataFrame:
    return extract_from_source(year, apply_web_scraping=True,debug=True)


def transform_pnad(df: DataFrame) -> DataFrame:
    df = tratar_campos_texto(df)
    df = tratar_educacao(df)
    df = tratar_fato_trabalho_pessoa(df)

    return df
    
def insert_if_not_exists(session: Session, registro: Series, tabela: Type[T]) -> T:
    registro_tabela = extrair_tupla(registro, tabela)

    codigo = get_pk(tabela)
    stmt = select(tabela)

    for col in get_cols(tabela):
        if col is codigo or col.name in models.COLUNAS_NAO_NORMALIZADAS:
            continue
        stmt = stmt.where(getattr(tabela, col.name) == getattr(registro_tabela, col.name))

    result = session.execute(stmt).fetchone()

    if result is not None:
        return result.__getitem__(0)

    session.add(registro_tabela)
    return registro_tabela


def load_dimension(session: Session, tabela: Type[T], df: DataFrame) -> DataFrame:

    cod = get_pk(tabela)
    dreg = {}
    has_change = False
    cols = [c.name for c in get_cols(tabela) if c != cod]
    df_table = df[cols].drop_duplicates()

    if CACHE[tabela] is not None:
        df_table = df_table.merge(CACHE[tabela], on=cols, how='left')
    else:
        df_table = df_table.assign(**{cod.name: None})

    for index, row in df_table[df_table[cod.name].isnull()].iterrows():
        registro = insert_if_not_exists(session, row, tabela)
        dreg[index] = registro
        has_change = True

    if has_change:
        session.commit()

        for index, reg in dreg.items():
            df_table.loc[index, cod.name] = int(getattr(reg, cod.name))

        if CACHE[tabela] is not None:
            CACHE[tabela] = pd.concat([CACHE[tabela], df_table]).drop_duplicates()
        else:
            CACHE[tabela] = df_table



    df_merged = df.merge(df_table, on=cols, how='left')
    return df_merged.drop(cols, axis='columns')


def load_fato(session: Session, df: DataFrame,tabela: Type[T]):
    i = 0
    for row in df.to_dict(orient='records'):
        # print(row)
        session.add(tabela(**row))
        i += 1
        if i % 1000 == 0:
            session.commit()

            
def load(df: DataFrame,session : Session,dims: List[Type[T]],fato: Type[T]) -> None:
    # load_defaults(session)
    for dim in dims:
        df = load_dimension(session, dim, df)

    #a lista de colunas validas é a lista de colunas do fato menos as chaves estrangeiras
    cod = get_pk(fato)
    cols = [c.name for c in get_cols(fato) if c != cod]
    df = df[[col for col in df.columns if col in cols]]
    
    load_fato(session, df,fato)


# def load_defaults(session: Session) -> None:
#     for tupla, table in [(default_values, models.Dimensao)]:
#         insert_if_not_exists(session, tupla, table)
#     session.commit()

def run_etl():
    ti = datetime.datetime.now()
    chunksize = 2000
    Session = sessionmaker(bind=source_engine)
    apply_web_scraping=True
    debug=False

    with Session() as session:
        
        
        # fato trabalho pessoa
        it = extract(YEAR_EXTRACTION,apply_web_scraping=apply_web_scraping,debug=debug)
        
        df_transformed = transform_pnad(it)
        load(df_transformed, session, DIMENSOES_PNAD, models.Fato_Trabalho_pessoa)

        session.commit()
        
        print(f"Total: {datetime.datetime.now() - ti} segundos ")