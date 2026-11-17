import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

engine = create_engine(os.environ["DATABASE_URL"])

with engine.connect() as connection:
    database = connection.execute(
        text("SELECT current_database()")
    ).scalar()

    print("Connected to database:", database)