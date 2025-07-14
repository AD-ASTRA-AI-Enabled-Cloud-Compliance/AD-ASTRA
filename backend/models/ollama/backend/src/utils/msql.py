# First, make sure to install mysql-connector-python:
# pip install mysql-connector-python

import mysql.connector
from datetime import date

def connect_to_database():
    try:
        connection = mysql.connector.connect(
            host="http://mysql.savanten.com",
            port=80,
            user="admin",
            password="adminSKYLOCK",
            database="sckylock"
        )
        return connection
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None

def insert_employee(connection, first_name, last_name, email, hire_date, salary):
    try:
        cursor = connection.cursor()
        
        # SQL query
        sql = """INSERT INTO employees 
                (first_name, last_name, email, hire_date, salary) 
                VALUES (%s, %s, %s, %s, %s)"""
        
        # Data tuple
        values = (first_name, last_name, email, hire_date, salary)
        
        cursor.execute(sql, values)
        connection.commit()
        print("Employee data inserted successfully")
        
    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        cursor.close()

def main():
    # Connect to database
    connection = connect_to_database()
    
    if connection is not None:
        try:
            # Example insertion
            insert_employee(
                connection,
                "John",
                "Doe",
                "john.doe@example.com",
                date(2025, 7, 6),
                65000.00
            )
            
        finally:
            connection.close()

if __name__ == "__main__":
    main()