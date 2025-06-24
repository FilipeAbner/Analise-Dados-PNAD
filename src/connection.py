from sqlalchemy import create_engine, URL
from dotenv import load_dotenv
from os import getenv

load_dotenv()

url = URL.create(
    drivername="postgresql+psycopg2",
    username=getenv('DB_SOURCE_USER'),
    host=getenv('DB_SOURCE_HOST'),
    database=getenv('DB_SOURCE_DATABASE'),
    password=getenv('DB_SOURCE_PASSWORD'),
    port=getenv('DB_SOURCE_PORT')
)

# parametro echo=True, exibe todas as querys realizadas da engine
source_engine = create_engine(url)

target_engine = source_engine