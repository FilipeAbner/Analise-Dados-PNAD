# Tabela: educacao
| Nome do Campo              | Tipo         | Descrição                                     |
| -------------------------- | ------------ | --------------------------------------------- |
| `codigo_educacao`          | Integer (PK) | Chave primária da tabela educacao |
| `nivel_instrucao_max_desc` | String(255)  | Nível máximo de instrução alcançado pelo indivíduo (ex: Ensino Fundamental, Ensino Superior)          |
| `tipo_escola_desc`         | String(255)  | Tipo de escola (ex: Pública, Privada)       |

# Tabela: regiao
| Nome do Campo             | Tipo         | Descrição                                    |
| ------------------------- | ------------ | -------------------------------------------- |
| `codigo_regiao`           | Integer (PK) | Chave primária da tabela regiao                |
| `nome_uf_desc`            | String(255)  | Nome da Unidade da Federação                 |
| `area_desc`               | String(255)  | Tipo de área (ex: Capital, Resto da UF)          |
| `situacao_domicilio_desc` | String(255)  | Situação do domicílio (ex: Urbano, Rural) |

# Tabela: individuo
| Nome do Campo           | Tipo         | Descrição                             |
| ----------------------- | ------------ | ------------------------------------- |
| `codigo_individuo`      | Integer (PK) | Chave primária da tabela indivíduo      |
| `sexo_desc`             | String(255)  | Sexo do indivíduo (ex: HOMEM, MULHER) |
| `idade`                 | SmallInteger | Idade do indivíduo                    |
| `cor_raca_desc`         | String(255)  | Cor ou raça do indivíduo              |
| `nmr_pessoas_domicilio` | SmallInteger | Número de pessoas no domicílio        |

# Tabela: tempo
| Nome do Campo  | Tipo         | Descrição                    |
| -------------- | ------------ | ---------------------------- |
| `codigo_tempo` | Integer (PK) | Chave primária da tabela tempo |
| `ano`          | SmallInteger | Ano da observação            |
| `trimestre`    | SmallInteger | Trimestre (1 a 4)            |

# Tabela: trabalho
| Nome do Campo                              | Tipo         | Descrição                                               |
| ------------------------------------------ | ------------ | ------------------------------------------------------- |
| `codigo_trabalho`                          | Integer (PK) | Chave primária da tabela trabalho                        |
| `condicao_ocupacao_desc`                   | String(255)  | Condição de ocupação na semana de referência para pessoas de 14 anos ou mais de idade (ex: ocupado, desocupado) |
| `posicao_ocupacao_trabalho_principal_desc` | String(255)  | Posição na ocupação no trabalho principal da semana de referência para pessoas de 14 anos ou mais de idade (com subcategorias de empregados) |
| `atividade_principal_desc`                 | String(255)  | Grupamentos de atividade principal do empreendimento do trabalho principal da semana de referência para pessoas de 14 anos ou mais de idade               |

# Tabela: fato_trabalho_pessoa
| Nome do Campo              | Tipo         | Descrição                                  |
| -------------------------- | ------------ | ------------------------------------------ |
| `codigo_trabalho_pessoa`   | Integer (PK) | Chave primária da tabela fato              |
| `codigo_individuo`         | Integer (FK) | Referência à tabela `individuo`            |
| `codigo_tempo`             | Integer (FK) | Referência à tabela `tempo`                |
| `codigo_regiao`            | Integer (FK) | Referência à tabela `regiao`               |
| `codigo_educacao`          | Integer (FK) | Referência à tabela `educacao`             |
| `codigo_trabalho`          | Integer (FK) | Referência à tabela `trabalho`             |
| `horas_trabalhadas_semana` | SmallInteger | Quantas horas trabalhou efetivamente na semana de referência no trabalho principal |
| `renda_mensal`             | Numeric      | Rendimento mensal efetivo de todos os trabalhos para pessoas de 14 anos ou mais de idade (apenas para pessoas que receberam em dinheiro, produtos ou mercadorias em qualquer trabalho)                    |
| `anos_estudo`              | SmallInteger | Quantos anos de estudo o indivíduo possui                  |