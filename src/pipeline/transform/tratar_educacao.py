import pandas as pd
from pandas import DataFrame
import re

def tratar_anos_estudo(df: DataFrame) -> DataFrame:
  df['anos_estudo'] = df['anos_estudo'].fillna(0)
  return df


def tratar_educacao(df: DataFrame) -> DataFrame:

  df = tratar_anos_estudo(df)

  return df