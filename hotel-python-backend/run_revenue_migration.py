"""
Run Revenue Reports Migration
Creates hotel_revenue_summary and non_hotel_revenue_summary tables with sample data
"""
import pymysql

def run_migration():
    print("Connecting to database...")
    connection = pymysql.connect(
        host='localhost',
        user='system',
        password='yont29921',
        database='hotel_system',
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
    
    try:
        with connection.cursor() as cursor:
            print("Reading migration file...")
            with open('database_reference/migration_add_revenue_reports.sql', 'r', encoding='utf-8') as f:
                sql_content = f.read()
            
            # Remove comments and split by semicolon
            lines = []
            for line in sql_content.split('\n'):
                line = line.strip()
                if line and not line.startswith('--'):
                    lines.append(line)
            
            clean_sql = ' '.join(lines)
            statements = [stmt.strip() for stmt in clean_sql.split(';') if stmt.strip()]
            
            print(f"Executing {len(statements)} SQL statements...")
            for i, statement in enumerate(statements, 1):
                if statement:
                    try:
                        cursor.execute(statement)
                        print(f"  ✓ Statement {i} executed successfully")
                    except Exception as e:
                        error_msg = str(e)
                        if "already exists" in error_msg.lower():
                            print(f"  ⚠ Statement {i}: Table already exists (skipping)")
                        else:
                            print(f"  ✗ Error in statement {i}: {error_msg}")
                            raise
            
            connection.commit()
            print("\n✓ Migration completed successfully!")
            
            # Verify the data
            cursor.execute("SELECT COUNT(*) as count FROM hotel_revenue_summary")
            hotel_count = cursor.fetchone()['count']
            print(f"  - Hotel revenue records: {hotel_count}")
            
            cursor.execute("SELECT COUNT(*) as count FROM non_hotel_revenue_summary")
            non_hotel_count = cursor.fetchone()['count']
            print(f"  - Non-hotel revenue records: {non_hotel_count}")
            
    except Exception as e:
        print(f"\n✗ Migration failed: {str(e)}")
        connection.rollback()
        raise
    finally:
        connection.close()
        print("\nDatabase connection closed.")

if __name__ == "__main__":
    run_migration()
