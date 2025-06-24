from src.util.data_pattern import patter
from pandas import DataFrame
import src.dimensional_models as models

def _normalizar_campos_texto(col: any) -> str:
    return patter(col) if isinstance(col, str) else col


def tratar_campos_texto(df: DataFrame) -> DataFrame:
    date_columns = []
    int_columns = ['renda_mensal', 'horas_trabalhadas_semana','idade','anos_estudo','ano','trimestre']
    str_columns = df.select_dtypes(include='object').columns.difference(date_columns + int_columns)

    # Trocar Nulos por menor data psql(Para campos data)
    # Ajustar para checar se o campo data existe antes de realizar o filtro de nulos
    # for col in date_columns:
    #     if col in df.columns:
    #         df[col] = df[col].fillna('1900-01-01')

    # Trocar Nulos por DADO AUSENTE em campos strings
    for col in str_columns:
        if col in df.columns:
            df[col] = df[col].fillna('NAO APLICAVEL')

    # Normalizar campos de texto (UPPER, REMOVER ACENTOS)
    # df = df.map(_normalizar_campos_texto)
    str_columns = str_columns.difference(models.COLUNAS_NAO_NORMALIZADAS)
    df[str_columns] = df[str_columns].map(_normalizar_campos_texto)


    return df
