'''
Business: Manage user goals (create, read, update, delete)
Args: event - dict with httpMethod, body, queryStringParameters, headers
      context - object with request_id, function_name, etc.
Returns: HTTP response dict with goals data
'''

import json
import os
import psycopg2
from typing import Dict, Any, Optional, List
from datetime import datetime

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
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
            return get_goals(user_id)
        elif method == 'POST':
            return create_goal(event, user_id)
        elif method == 'PUT':
            return update_goal(event, user_id)
        elif method == 'DELETE':
            return delete_goal(event, user_id)
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

def get_goals(user_id: int) -> Dict[str, Any]:
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute(
            """SELECT id, title, description, category, priority, status, 
               start_date, end_date, progress, created_at, updated_at 
               FROM goals WHERE user_id = %s ORDER BY created_at DESC""",
            (user_id,)
        )
        rows = cur.fetchall()
        
        goals = []
        for row in rows:
            goals.append({
                'id': row[0],
                'title': row[1],
                'description': row[2],
                'category': row[3],
                'priority': row[4],
                'status': row[5],
                'startDate': row[6].isoformat() if row[6] else None,
                'endDate': row[7].isoformat() if row[7] else None,
                'progress': row[8],
                'createdAt': row[9].isoformat() if row[9] else None,
                'updatedAt': row[10].isoformat() if row[10] else None
            })
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'goals': goals})
        }
    finally:
        cur.close()
        conn.close()

def create_goal(event: Dict[str, Any], user_id: int) -> Dict[str, Any]:
    body = json.loads(event.get('body', '{}'))
    
    title = body.get('title', '').strip()
    description = body.get('description', '').strip()
    category = body.get('category', '')
    priority = body.get('priority', 'medium')
    status = body.get('status', 'pending')
    start_date = body.get('startDate')
    end_date = body.get('endDate')
    progress = body.get('progress', 0)
    
    if not title:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Title is required'})
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute(
            """INSERT INTO goals (user_id, title, description, category, priority, 
               status, start_date, end_date, progress) 
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) 
               RETURNING id, title, description, category, priority, status, 
               start_date, end_date, progress, created_at, updated_at""",
            (user_id, title, description, category, priority, status, 
             start_date, end_date, progress)
        )
        row = cur.fetchone()
        conn.commit()
        
        goal = {
            'id': row[0],
            'title': row[1],
            'description': row[2],
            'category': row[3],
            'priority': row[4],
            'status': row[5],
            'startDate': row[6].isoformat() if row[6] else None,
            'endDate': row[7].isoformat() if row[7] else None,
            'progress': row[8],
            'createdAt': row[9].isoformat() if row[9] else None,
            'updatedAt': row[10].isoformat() if row[10] else None
        }
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'goal': goal})
        }
    finally:
        cur.close()
        conn.close()

def update_goal(event: Dict[str, Any], user_id: int) -> Dict[str, Any]:
    body = json.loads(event.get('body', '{}'))
    goal_id = body.get('id')
    
    if not goal_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Goal ID is required'})
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        update_fields = []
        params = []
        
        if 'title' in body:
            update_fields.append('title = %s')
            params.append(body['title'])
        if 'description' in body:
            update_fields.append('description = %s')
            params.append(body['description'])
        if 'category' in body:
            update_fields.append('category = %s')
            params.append(body['category'])
        if 'priority' in body:
            update_fields.append('priority = %s')
            params.append(body['priority'])
        if 'status' in body:
            update_fields.append('status = %s')
            params.append(body['status'])
        if 'startDate' in body:
            update_fields.append('start_date = %s')
            params.append(body['startDate'])
        if 'endDate' in body:
            update_fields.append('end_date = %s')
            params.append(body['endDate'])
        if 'progress' in body:
            update_fields.append('progress = %s')
            params.append(body['progress'])
        
        update_fields.append('updated_at = CURRENT_TIMESTAMP')
        
        params.extend([user_id, goal_id])
        
        query = f"""UPDATE goals SET {', '.join(update_fields)} 
                   WHERE user_id = %s AND id = %s 
                   RETURNING id, title, description, category, priority, status, 
                   start_date, end_date, progress, created_at, updated_at"""
        
        cur.execute(query, params)
        row = cur.fetchone()
        conn.commit()
        
        if not row:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Goal not found'})
            }
        
        goal = {
            'id': row[0],
            'title': row[1],
            'description': row[2],
            'category': row[3],
            'priority': row[4],
            'status': row[5],
            'startDate': row[6].isoformat() if row[6] else None,
            'endDate': row[7].isoformat() if row[7] else None,
            'progress': row[8],
            'createdAt': row[9].isoformat() if row[9] else None,
            'updatedAt': row[10].isoformat() if row[10] else None
        }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'goal': goal})
        }
    finally:
        cur.close()
        conn.close()

def delete_goal(event: Dict[str, Any], user_id: int) -> Dict[str, Any]:
    query_params = event.get('queryStringParameters', {})
    goal_id = query_params.get('id')
    
    if not goal_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Goal ID is required'})
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute(
            "SELECT id FROM goals WHERE user_id = %s AND id = %s",
            (user_id, goal_id)
        )
        if not cur.fetchone():
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Goal not found'})
            }
        
        cur.execute(
            "UPDATE goals SET status = 'deleted', updated_at = CURRENT_TIMESTAMP WHERE user_id = %s AND id = %s",
            (user_id, goal_id)
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
