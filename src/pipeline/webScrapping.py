import os
import requests
import zipfile
import shutil
from src.util.data_pattern import DATA_DIR

def clean_directory(directory):
    """Remove all files and subdirectories in the given directory."""
    if os.path.exists(directory):
        print(f"Limpando diretório {directory}...")
        for filename in os.listdir(directory):
            file_path = os.path.join(directory, filename)
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)


def get_microdata(year):
    output_dir = DATA_DIR / f'PNAD{year}'
    print(f"Iniciando extração de {year}...")
    
    microdados = f"https://ftp.ibge.gov.br/Trabalho_e_Rendimento/Pesquisa_Nacional_por_Amostra_de_Domicilios_continua/Trimestral/Microdados/{year}/"
    
    microdados_zip_files = [
        f"PNADC_01{year}_20220916.zip",
        f"PNADC_02{year}_20220916.zip",
        f"PNADC_03{year}_20220916.zip",
        f"PNADC_04{year}_20220916.zip",
    ]

    os.makedirs(output_dir, exist_ok=True)

    for zip_file in microdados_zip_files:
        url = microdados + zip_file
        file_path = os.path.join(output_dir, zip_file)
        try:
            print(f"Baixando: {url}")
            response = requests.get(url, stream=True)
            response.raise_for_status()
            with open(file_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            print(f"Download concluído: {file_path}")
            if file_path.endswith('.zip'):
                print(f"Descompactando {file_path}...")
                with zipfile.ZipFile(file_path, 'r') as zip_ref:
                    zip_ref.extractall(output_dir)
                    
                    # Renomeia cada arquivo extraído
                    for member in zip_ref.namelist():
                        original_path = os.path.join(output_dir, member)
                        if os.path.isfile(original_path):
                            # Descobre o trimestre a partir do nome do zip
                            trim = zip_file.split('_')[1][:2]
                            new_name = f"PNADC_{trim}{year}.txt"
                            new_path = os.path.join(output_dir, new_name)
                            os.rename(original_path, new_path)
                            print(f"Arquivo renomeado para: {new_path}")

                print(f"Arquivo ZIP descompactado em: {output_dir}")
        except requests.exceptions.RequestException as e:
            print(f"Erro ao baixar {url}: {e}")
        except zipfile.BadZipFile:
            print(f"Erro: {file_path} ZIP inválido ou corrompido.")
        except Exception as e:
            print(f"Erro inesperado ao processar {url}: {e}")


def get_dicionario():
    url_dicionario = f"https://ftp.ibge.gov.br/Trabalho_e_Rendimento/Pesquisa_Nacional_por_Amostra_de_Domicilios_continua/Trimestral/Microdados/Documentacao/Dicionario_e_input_20221031.zip"

    response = requests.get(url_dicionario)
    response.raise_for_status()
    with open(DATA_DIR / f'dicionario_e_input.zip', 'wb') as f:
        f.write(response.content)

    with zipfile.ZipFile(DATA_DIR / f'dicionario_e_input.zip', 'r') as zip_ref:
        zip_ref.extractall(DATA_DIR)

    return DATA_DIR / f'dicionario_e_input.zip'