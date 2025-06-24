from src.dimensional_models import Base
from src.connection import source_engine
from src.pipeline import etl


def recreate_schema():
    # TODO: Create and Drop Schema
    # Drop Tabelas ORM
    Base.metadata.drop_all(bind=source_engine)
    # Create Tabelas ORM
    Base.metadata.create_all(bind=source_engine)


def main():
    recreate_schema()
    etl.run_etl()


if __name__ == "__main__":
    main()
