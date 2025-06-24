from sqlalchemy import Column, Integer, VARCHAR, Numeric, Date, Boolean, SmallInteger, UniqueConstraint
from src.util.orm_utils import create_fk, Base

# Permite a criação de tabelas com campos de diferentes tipos de string(varchar,char...)
TIPO_STRING = VARCHAR
COLUNAS_NAO_NORMALIZADAS = [

]

class Educacao(Base):
    __tablename__ = 'educacao'
    codigo_educacao = Column(Integer, primary_key=True)
    nivel_instrucao_max_desc = Column(TIPO_STRING(255))
    tipo_escola_desc = Column(TIPO_STRING(255))

class Regiao(Base):
    __tablename__ = 'regiao'
    codigo_regiao = Column(Integer, primary_key=True)
    nome_uf_desc = Column(TIPO_STRING(255))
    area_desc = Column(TIPO_STRING(255))
    situacao_domicilio_desc = Column(TIPO_STRING(255))

class Individuo(Base):
    __tablename__ = 'individuo'
    codigo_individuo = Column(Integer, primary_key=True)
    sexo_desc = Column(TIPO_STRING(255))
    idade = Column(SmallInteger)
    cor_raca_desc = Column(TIPO_STRING(255))
    nmr_pessoas_domicilio = Column(SmallInteger)

class Tempo(Base):
    __tablename__ = 'tempo'
    codigo_tempo = Column(Integer, primary_key=True)
    ano = Column(SmallInteger)
    trimestre = Column(SmallInteger)

class Trabalho(Base):
    __tablename__ = 'trabalho'
    codigo_trabalho = Column(Integer, primary_key=True)
    condicao_ocupacao_desc = Column(TIPO_STRING(255))
    posicao_ocupacao_trabalho_principal_desc = Column(TIPO_STRING(255))
    atividade_principal_desc = Column(TIPO_STRING(255))

class Fato_Trabalho_pessoa(Base):
    __tablename__ = 'fato_trabalho_pessoa'
    codigo_trabalho_pessoa = Column(Integer, primary_key=True)
    codigo_individuo = Column(Integer, create_fk(Individuo))
    codigo_tempo = Column(Integer, create_fk(Tempo))
    codigo_regiao = Column(Integer, create_fk(Regiao))
    codigo_educacao = Column(Integer, create_fk(Educacao))
    codigo_trabalho = Column(Integer, create_fk(Trabalho))
    horas_trabalhadas_semana = Column(SmallInteger)
    renda_mensal = Column(Numeric)
    anos_estudo = Column(SmallInteger)