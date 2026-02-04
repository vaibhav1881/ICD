"""
Test all database connections: PostgreSQL, Neo4j, and Redis
"""
import sys

print("=" * 60)
print("🔍 Testing Database Connections")
print("=" * 60)

# Test 1: PostgreSQL
print("\n1️⃣  Testing PostgreSQL...")
try:
    from sqlalchemy import create_engine, text
    engine = create_engine("postgresql://postgres:postgres@localhost/idea_collision")
    with engine.connect() as conn:
        result = conn.execute(text("SELECT version();"))
        version = result.fetchone()[0]
        print(f"   ✅ PostgreSQL Connected!")
        print(f"   📊 Version: {version[:50]}...")
except Exception as e:
    print(f"   ❌ PostgreSQL Failed: {e}")
    sys.exit(1)

# Test 2: Neo4j
print("\n2️⃣  Testing Neo4j...")
try:
    from neo4j import GraphDatabase
    driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "password"))
    with driver.session() as session:
        result = session.run("RETURN 'Connection successful!' AS message")
        message = result.single()["message"]
        print(f"   ✅ Neo4j Connected!")
        print(f"   📊 Message: {message}")
    driver.close()
except Exception as e:
    print(f"   ❌ Neo4j Failed: {e}")
    print(f"   💡 Make sure Docker containers are running: docker ps")
    sys.exit(1)

# Test 3: Redis
print("\n3️⃣  Testing Redis...")
try:
    import redis
    r = redis.Redis(host='localhost', port=6379, decode_responses=True)
    r.ping()
    print(f"   ✅ Redis Connected!")
    print(f"   📊 Status: Ping successful")
except Exception as e:
    print(f"   ❌ Redis Failed: {e}")
    print(f"   💡 Make sure Docker containers are running: docker ps")
    sys.exit(1)

print("\n" + "=" * 60)
print("🎉 All databases connected successfully!")
print("=" * 60)
print("\n✅ Your backend is ready to start!")
print("   Run: uvicorn app.main:app --reload")
