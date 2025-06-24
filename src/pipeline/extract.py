import pandas as pd
from pandas import DataFrame
import os
from pathlib import Path
import re
from src.pipeline.mapper import COLUMN_MAPPER
from collections import defaultdict
from src.util.data_pattern import DATA_DIR
from src.pipeline.webScrapping import get_microdata, get_dicionario, clean_directory

def extract_sas(year,file : int, debug=False) -> DataFrame:
    sas_code_file = DATA_DIR / 'input_PNADC_trimestral.txt'  # arquivo sas em formato txt
    data_file = DATA_DIR / f'PNAD2021/PNADC_0{file}{year}.txt'  # arquivo de dados reais (.txt)

    colspecs = []
    names = []
    dtypes = {}  # Dicionário para armazenar os tipos de dados

    with open(sas_code_file, encoding="latin1") as f:
        for line in f:
            # Regex para extrair informações do formato SAS:
            # @123 VARIAVEL $10.  ->  @(posição) (nome) (tipo$)(tamanho).
            # r"@(\d+)\s+(\w+)\s+\$?(\d+)\."
            # @ - marca o início da posição
            # (\d+) - captura um ou mais dígitos (posição inicial)
            # \s+ - um ou mais espaços em branco
            # (\w+) - captura um ou mais caracteres alfanuméricos (nome da variável)
            # \s+ - um ou mais espaços em branco
            # \$? - captura o $ opcional (indica variável string)
            # (\d+) - captura um ou mais dígitos (tamanho do campo)
            # \. - ponto final
            match = re.match(r"@(\d+)\s+(\w+)\s+\$?(\d+)\.", line)
            if match:
                start = int(match.group(1)) - 1
                name = match.group(2)
                length = int(match.group(3))
                end = start + length
                
                colspecs.append((start, end))
                names.append(name)
                
                # Verifica se é string ($) ou número
                if '$' in line:
                    dtypes[name] = 'str'
                else:
                    dtypes[name] = 'float'

    # Lê o arquivo de dados com os tipos corretos
    df = pd.read_fwf(
        data_file,
        colspecs=colspecs,
        names=names,
        encoding="latin1",
        dtype=dtypes,
    )

    df = converter_floats_para_int(df)

    # Mantém apenas as colunas mapeadas no DataFrame
    colunas_existentes = [col for col in COLUMN_MAPPER.keys() if col in df.columns]
    df = df[colunas_existentes]

    if debug:
        df.to_csv(DATA_DIR / f'df_completo{year}0{file}.csv', index=False)
    return df

def converter_floats_para_int(df):
    """
    Converte as colunas de float para int se todos os valores forem inteiros
    Args:
        df (DataFrame): DataFrame com as colunas de float
    Returns:
        df (DataFrame): DataFrame com as colunas de float convertidas para int
    """
    for col in df.select_dtypes(include=['float', 'float64']).columns:
        if (df[col].dropna() % 1 == 0).all():
            df[col] = df[col].astype('Int64')
    return df


def gerar_dicionarios_variaveis(path_excel: str, sheet_name=0,debug=False):

    df_dic = pd.read_excel(path_excel, sheet_name=sheet_name, header=None)
    
    #dropa a primeira e segunda coluna e 3
    df_dic = df_dic.drop(columns=[0,1,3,4,7])

    # define o header e o nome das colunas
    df_dic = df_dic.iloc[4:]
    df_dic.columns = ['codigo', 'tipo', 'descricao']
    df_dic = df_dic.iloc[2:]
    
    #Preenche os valores nulos da coluna codigo com o valor da linha anterior
    df_dic['codigo'] = df_dic['codigo'].ffill()
    
    df_dic = df_dic[df_dic['tipo'].apply(lambda x: str(x).strip().isdigit())]

    # cria um dicionario para cada codigo
    dicionarios = defaultdict(dict)
    for i, row in df_dic.iterrows():
        codigo = row['codigo']
        tipo = int(str(row['tipo']).strip())
        descricao = row['descricao']
        dicionarios[codigo][tipo] = descricao

    if debug:
        df_dic.to_csv(DATA_DIR / 'dicionario.csv', index=False)
    return dicionarios

def tratar_dicionario(df, dicionarios):
    # Para cada código (nome de coluna) presente no dicionário adiono uma nova coluna com o nome do codigo+'_descricao' e entao preencho com 
    # o valor do dicionario
    # exemplo: UF 
            # 17 se o codigo for 17, a nova coluna(UF_desc) será preenchida naquela linha com o valor do dicionario

    for codigo, dicionario in dicionarios.items():
        if codigo in df.columns:
            desc_col = f"{codigo}_desc"
            df[desc_col] = df[codigo].apply(
                lambda x: dicionario.get(int(x)) if pd.notna(x) and str(x).isdigit() and int(x) in dicionario else None
            )

    return df

def tratar_dados(df):

    # filtra apenas os dados do estado de minas gerais
    df['UF'] = df['UF'].astype(int)
    filter_mg = df['UF'] == 31
    df = df.loc[filter_mg]

    # renomeia as colunas
    df = df.rename(columns=COLUMN_MAPPER)
    desc_mapper = {f"{k}_desc": f"{v}_desc" for k, v in COLUMN_MAPPER.items()}
    df = df.rename(columns=desc_mapper)

    return df

def extract_from_source(year,apply_web_scraping=True, debug=False) -> DataFrame:
    if apply_web_scraping:
        clean_directory(DATA_DIR)
        get_microdata(year)
        get_dicionario()

    dicionarios = gerar_dicionarios_variaveis(DATA_DIR / 'dicionario_PNADC_microdados_trimestral.xls')
    
    df = None
    for file in range(1, 5): #trimestre 1 a 4
        #concatena todos os dfs
        df = pd.concat([df, extract_sas(year,file, debug=debug)])

    df = tratar_dicionario(df,dicionarios)
    df = tratar_dados(df)

    if debug:
        df.to_csv(DATA_DIR / f'df_to_sas{year}.csv', index=False)

    return df

