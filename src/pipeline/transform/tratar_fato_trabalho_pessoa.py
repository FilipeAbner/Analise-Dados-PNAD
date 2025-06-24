from pandas import DataFrame




def tratar_fato_trabalho_pessoa(df: DataFrame) -> DataFrame:
    
    df['horas_trabalhadas_semana'] = df['horas_trabalhadas_semana'].fillna(-1)
    df['renda_mensal'] = df['renda_mensal'].fillna(-1)

    return df