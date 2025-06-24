import unicodedata
from pathlib import Path
ROOT_DIR = Path(__file__).parent.parent.parent
DATA_DIR = ROOT_DIR / 'data'

def patter(input_str):
    str_no_accents = remove_accents(input_str)
    str_no_accents_upper = upper_case(str_no_accents)

    return str_no_accents_upper


def remove_accents(input_str):
    processamento_1 = unicodedata.normalize("NFD", input_str)
    processamento_2 = processamento_1.encode("ascii", "ignore")
    processamento_3 = processamento_2.decode("utf-8")

    return processamento_3


def upper_case(input_str: str):
    return input_str.upper().strip()
