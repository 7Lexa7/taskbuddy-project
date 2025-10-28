'''
Business: Manage user profile (get, update)
Args: event - dict with httpMethod, body, headers
      context - object with request_id, function_name, etc.
Returns: HTTP response dict with profile data
'''

import json
import os
import psycopg2
from typing import Dict, Any, Optional

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def get_user_id_from_token(headers: Dict[str, str]) -> Optional[int]:
    token = headers.get('X-Auth-Token', '') or headers.get('x-auth-token', '')
    if not token:
        return None
    return 1

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = event.get('headers', {})
    user_id = get_user_id_from_token(headers)
    
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    try:
        if method == 'GET':
            return get_profile(user_id)
        elif method == 'PUT':
            return update_profile(event, user_id)
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'})
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }

def get_profile(user_id: int) -> Dict[str, Any]:
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute(
            """SELECT id, email, username, avatar_url, bio, telegram_chat_id, created_at 
               FROM users WHERE id = %s""",
            (user_id,)
        )
        user = cur.fetchone()
        
        if not user:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'User not found'})
            }
        
        cur.execute(
            "SELECT COUNT(*) FROM goals WHERE user_id = %s AND status != 'deleted'",
            (user_id,)
        )
        total_goals = cur.fetchone()[0]
        
        cur.execute(
            "SELECT COUNT(*) FROM goals WHERE user_id = %s AND status = 'completed'",
            (user_id,)
        )
        completed_goals = cur.fetchone()[0]
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'profile': {
                    'id': user[0],
                    'email': user[1],
                    'username': user[2],
                    'avatarUrl': user[3],
                    'bio': user[4],
                    'telegramChatId': user[5],
                    'createdAt': user[6].isoformat() if user[6] else None,
                    'stats': {
                        'totalGoals': total_goals,
                        'completedGoals': completed_goals
                    }
                }
            })
        }
    finally:
        cur.close()
        conn.close()

def update_profile(event: Dict[str, Any], user_id: int) -> Dict[str, Any]:
    body = json.loads(event.get('body', '{}'))
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        update_fields = []
        params = []
        
        if 'username' in body:
            update_fields.append('username = %s')
            params.append(body['username'])
        if 'bio' in body:
            update_fields.append('bio = %s')
            params.append(body['bio'])
        if 'avatarUrl' in body:
            update_fields.append('avatar_url = %s')
            params.append(body['avatarUrl'])
        if 'telegramChatId' in body:
            update_fields.append('telegram_chat_id = %s')
            params.append(body['telegramChatId'])
        
        if not update_fields:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'No fields to update'})
            }
        
        update_fields.append('updated_at = CURRENT_TIMESTAMP')
        params.append(user_id)
        
        query = f"UPDATE users SET {', '.join(update_fields)} WHERE id = %s RETURNING id, email, username, avatar_url, bio, telegram_chat_id, created_at"
        
        cur.execute(query, params)
        user = cur.fetchone()
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'profile': {
                    'id': user[0],
                    'email': user[1],
                    'username': user[2],
                    'avatarUrl': user[3],
                    'bio': user[4],
                    'telegramChatId': user[5],
                    'createdAt': user[6].isoformat() if user[6] else None
                }
            })
        }
    finally:
        cur.close()
        conn.close()
