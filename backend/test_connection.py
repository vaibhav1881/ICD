from sqlalchemy import create_engine, text
import os

# Read from .env or use default
DATABASE_URL = "postgresql://postgres:postgres@localhost/idea_collision"

print("🔍 Testing PostgreSQL connection...")
print(f"📍 Connection string: {DATABASE_URL}")

try:
    # Create engine
    engine = create_engine(DATABASE_URL)
    
    # Test connection
    with engine.connect() as connection:
        result = connection.execute(text("SELECT version();"))
        version = result.fetchone()[0]
        print(f"\n✅ Successfully connected to PostgreSQL!")
        print(f"📊 Version: {version[:50]}...")
        
        # Check if tables exist
        result = connection.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """))
        tables = [row[0] for row in result]
        
        if tables:
            print(f"\n📋 Existing tables: {', '.join(tables)}")
        else:
            print("\n📋 No tables yet (will be created when backend starts)")
        
except Exception as e:
    print(f"\n❌ Connection failed!")
    print(f"Error: {e}")
    print("\n💡 Make sure:")
    print("  1. PostgreSQL is running")
    print("  2. Database 'idea_collision' exists")
    print("  3. Username/password are correct (postgres/postgres)")
