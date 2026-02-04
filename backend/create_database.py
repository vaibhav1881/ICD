import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Connect to PostgreSQL server (not to a specific database)
try:
    connection = psycopg2.connect(
        user="postgres",
        password="postgres",
        host="localhost",
        port="5432"
    )
    connection.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    
    cursor = connection.cursor()
    
    # Check if database exists
    cursor.execute("SELECT 1 FROM pg_database WHERE datname='idea_collision'")
    exists = cursor.fetchone()
    
    if exists:
        print("✅ Database 'idea_collision' already exists!")
    else:
        # Create database
        cursor.execute("CREATE DATABASE idea_collision")
        print("✅ Database 'idea_collision' created successfully!")
    
    cursor.close()
    connection.close()
    
except Exception as error:
    print(f"❌ Error: {error}")
