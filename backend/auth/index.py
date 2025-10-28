'''
Business: Handle user authentication (register, login, verify token)
Args: event - dict with httpMethod, body, queryStringParameters
      context - object with request_id, function_name, etc.
Returns: HTTP response dict with auth tokens or user data
'''

import json
import os
import psycopg2
import hashlib
import secrets
from typing import Dict, Any, Optional
from datetime import datetime, timedelta

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token() -> str:
    return secrets.token_urlsafe(32)

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    path = event.get('queryStringParameters', {}).get('action', '')
    
    try:
        if method == 'POST' and path == 'register':
            return register_user(event)
        elif method == 'POST' and path == 'login':
            return login_user(event)
        elif method == 'GET' and path == 'verify':
            return verify_token(event)
        else:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Not found'})
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }

def register_user(event: Dict[str, Any]) -> Dict[str, Any]:
    body = json.loads(event.get('body', '{}'))
    email = body.get('email', '').strip().lower()
    password = body.get('password', '')
    username = body.get('username', '').strip()
    
    if not email or not password or not username:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email, password and username are required'})
        }
    
    password_hash = hash_password(password)
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute(
            "INSERT INTO users (email, password_hash, username) VALUES (%s, %s, %s) RETURNING id, email, username, created_at",
            (email, password_hash, username)
        )
        user = cur.fetchone()
        user_id = user[0]
        
        cur.execute(
            "INSERT INTO notifications (user_id, title, message, type) VALUES (%s, %s, %s, %s)",
            (user_id, 'Добро пожаловать в TaskBuddy!', 'Вы успешно зарегистрировались. Начните создавать свои первые задачи!', 'success')
        )
        
        conn.commit()
        
        token = generate_token()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'user': {
                    'id': user[0],
                    'email': user[1],
                    'username': user[2],
                    'created_at': user[3].isoformat() if user[3] else None
                },
                'token': token
            })
        }
    except psycopg2.IntegrityError:
        conn.rollback()
        return {
            'statusCode': 409,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'User with this email already exists'})
        }
    finally:
        cur.close()
        conn.close()

def login_user(event: Dict[str, Any]) -> Dict[str, Any]:
    body = json.loads(event.get('body', '{}'))
    email = body.get('email', '').strip().lower()
    password = body.get('password', '')
    
    if not email or not password:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email and password are required'})
        }
    
    password_hash = hash_password(password)
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute(
            "SELECT id, email, username, password_hash, created_at FROM users WHERE email = %s",
            (email,)
        )
        user = cur.fetchone()
        
        if not user or user[3] != password_hash:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid email or password'})
            }
        
        token = generate_token()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'user': {
                    'id': user[0],
                    'email': user[1],
                    'username': user[2],
                    'created_at': user[4].isoformat() if user[4] else None
                },
                'token': token
            })
        }
    finally:
        cur.close()
        conn.close()

def verify_token(event: Dict[str, Any]) -> Dict[str, Any]:
    headers = event.get('headers', {})
    token = headers.get('X-Auth-Token', '') or headers.get('x-auth-token', '')
    
    if not token:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Token required'})
        }
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'valid': True})
    }