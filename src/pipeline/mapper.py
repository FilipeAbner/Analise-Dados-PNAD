# Mapeamento de códigos que serão utilizados no modelo dimensional
COLUMN_MAPPER = {
    
    # Caracteristicas Temporais / Classe Tempo
    'Ano': 'ano',
    'Trimestre': 'trimestre',

    # Caracteristicas Geograficas / Classe Regiao
    'UF': 'nome_uf',
    'V1023': 'area',
    'V1022': 'situacao_domicilio',
    
    # Características Gerais dos Residentes / Classe Individuo
    'V2007': 'sexo',
    'V2009': 'idade',
    'V2010': 'cor_raca',
    'V2001': 'nmr_pessoas_domicilio',
    
    # Características de Educação
    'V3002': 'frequenta_escola',
    'VD3004': 'nivel_instrucao_max',
    'VD3005': 'anos_estudo',
    'V3001': 'sabe_ler_escrever',
    'V3002A': 'tipo_escola',

    # Características de Trabalho / Classe Trabalho
    'VD4002': 'condicao_ocupacao', #ocupada ou desocupada
    'VD4008': 'posicao_ocupacao_trabalho_principal', #Posição no Trabalho Principal (Detalhada)',
    'VD4010': 'atividade_principal',

    # Características de Trabalho / Classe Fato_Trabalho_pessoa
    'V4039C' : 'horas_trabalhadas_semana',
    'VD4020': 'renda_mensal',

    # Características Gerais dos Residentes / Classe Individuo
    
    'VD4007': 'Posição no Trabalho Principal',
    'VD4009': 'Posição no Trabalho Principal (Agrupada)',
    'VD4011': 'Agrupamentos Ocupacionais',
    
    # Identificação e Controle
    'V1031': 'Peso do Domicílio',
    'V1032': 'Peso da Pessoa',
    'RM_RIDE': 'Região Metropolitana',
    'Capital': 'Município Capital',

    'V3003A': 'Curso que Frequenta',
    'V3009A': 'Curso Mais Elevado Frequentado Anteriormente',
    
    # Rendimento de Outras Fontes
    'V5001A2': 'Valor Recebido de BPC-LOAS',
    'V5002A2': 'Valor Recebido de Bolsa Família',
    'V5003A2': 'Valor Recebido de Aposentadoria',
    'V5004A2': 'Valor Recebido de Pensão',
    'V5005A2': 'Valor Recebido de Abono Permanente',
    'V5006A2': 'Valor Recebido de Aluguel',
    'V5007A2': 'Valor Recebido de Outras Fontes',
    
    # Características de Moradia e TIC
    'S01001': 'Tipo de Domicílio',

    # Características de Saneamento / Classe Saneamento (Não presentes na base)
    # 'S01007': 'agua',
    # 'S01012A': 'esgoto',
    # 'S01013': 'lixo',
    # 'S01014': 'eletricidade',
    # 'S01021': 'nmr_celular',
    # 'S01029': 'internet',
    # 'S01031': 'veiculo',
    # 'S01028': 'microcomputador',

    #Novos atr


    # Características de Moradia e TIC
}