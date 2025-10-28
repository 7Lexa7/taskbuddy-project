'''
Business: Manage user notifications (get, mark as read, create)
Args: event - dict with httpMethod, queryStringParameters, headers
      context - object with request_id, function_name, etc.
Returns: HTTP response dict with notifications data
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
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute(
            "SELECT user_id FROM tokens WHERE token = %s AND expires_at > CURRENT_TIMESTAMP",
            (token,)
        )
        result = cur.fetchone()
        return result[0] if result else None
    finally:
        cur.close()
        conn.close()

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
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
            return get_notifications(user_id)
        elif method == 'PUT':
            return mark_as_read(event, user_id)
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

def get_notifications(user_id: int) -> Dict[str, Any]:
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute(
            """SELECT id, title, message, type, is_read, created_at 
               FROM notifications 
               WHERE user_id = %s 
               ORDER BY created_at DESC 
               LIMIT 50""",
            (user_id,)
        )
        rows = cur.fetchall()
        
        notifications = []
        for row in rows:
            notifications.append({
                'id': row[0],
                'title': row[1],
                'message': row[2],
                'type': row[3],
                'isRead': row[4],
                'createdAt': row[5].isoformat() if row[5] else None
            })
        
        unread_count = sum(1 for n in notifications if not n['isRead'])
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'notifications': notifications,
                'unreadCount': unread_count
            })
        }
    finally:
        cur.close()
        conn.close()

def mark_as_read(event: Dict[str, Any], user_id: int) -> Dict[str, Any]:
    body = json.loads(event.get('body', '{}'))
    notification_id = body.get('id')
    
    if not notification_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Notification ID is required'})
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute(
            "UPDATE notifications SET is_read = TRUE WHERE id = %s AND user_id = %s",
            (notification_id, user_id)
        )
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True})
        }
    finally:
        cur.close()
        conn.close()