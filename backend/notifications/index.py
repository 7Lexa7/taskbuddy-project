'''
Business: Manage user notifications (get, mark as read, create) and settings
Args: event - dict with httpMethod, queryStringParameters, headers, pathParams
      context - object with request_id, function_name, etc.
Returns: HTTP response dict with notifications data or settings
'''

import json
import os
import psycopg2
import requests
from typing import Dict, Any, Optional
from datetime import datetime, timedelta

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
    path_params = event.get('queryStringParameters', {})
    action = path_params.get('action', '')
    
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
    
    if action == 'reminders':
        return check_and_send_reminders()
    
    if action == 'settings':
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
                return get_settings(user_id)
            elif method == 'PUT':
                return update_settings(event, user_id)
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)})
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
        elif method == 'DELETE':
            return delete_notification(event, user_id)
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

def delete_notification(event: Dict[str, Any], user_id: int) -> Dict[str, Any]:
    params = event.get('queryStringParameters', {})
    notification_id = params.get('id')
    
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
            "DELETE FROM notifications WHERE id = %s AND user_id = %s",
            (notification_id, user_id)
        )
        conn.commit()
        
        if cur.rowcount == 0:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Notification not found'})
            }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True})
        }
    finally:
        cur.close()
        conn.close()

def get_settings(user_id: int) -> Dict[str, Any]:
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute(
            """SELECT notifications, email_notifications, telegram_notifications, reminder_time
               FROM user_settings 
               WHERE user_id = %s""",
            (user_id,)
        )
        row = cur.fetchone()
        
        if not row:
            cur.execute(
                """INSERT INTO user_settings (user_id) VALUES (%s)
                   RETURNING notifications, email_notifications, telegram_notifications, reminder_time""",
                (user_id,)
            )
            row = cur.fetchone()
            conn.commit()
        
        settings = {
            'notifications': row[0],
            'emailNotifications': row[1],
            'telegramNotifications': row[2],
            'reminderTime': row[3]
        }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(settings)
        }
    finally:
        cur.close()
        conn.close()

def update_settings(event: Dict[str, Any], user_id: int) -> Dict[str, Any]:
    body = json.loads(event.get('body', '{}'))
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        update_fields = []
        params = []
        
        if 'notifications' in body:
            update_fields.append('notifications = %s')
            params.append(body['notifications'])
        if 'emailNotifications' in body:
            update_fields.append('email_notifications = %s')
            params.append(body['emailNotifications'])
        if 'telegramNotifications' in body:
            update_fields.append('telegram_notifications = %s')
            params.append(body['telegramNotifications'])
        if 'reminderTime' in body:
            update_fields.append('reminder_time = %s')
            params.append(body['reminderTime'])
        
        if not update_fields:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'No fields to update'})
            }
        
        params.append(user_id)
        
        query = f"""UPDATE user_settings SET {', '.join(update_fields)} 
                   WHERE user_id = %s
                   RETURNING notifications, email_notifications, telegram_notifications, reminder_time"""
        
        cur.execute(query, params)
        row = cur.fetchone()
        conn.commit()
        
        settings = {
            'notifications': row[0],
            'emailNotifications': row[1],
            'telegramNotifications': row[2],
            'reminderTime': row[3]
        }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(settings)
        }
    finally:
        cur.close()
        conn.close()

def check_and_send_reminders() -> Dict[str, Any]:
    conn = get_db_connection()
    cur = conn.cursor()
    
    sent_count = 0
    
    try:
        tomorrow = datetime.now() + timedelta(days=1)
        tomorrow_str = tomorrow.strftime('%Y-%m-%d')
        
        cur.execute(
            """SELECT g.id, g.title, g.end_date, g.user_id, u.name, u.telegram_chat_id, 
                      s.telegram_notifications
               FROM goals g
               JOIN users u ON g.user_id = u.id
               JOIN user_settings s ON u.id = s.user_id
               WHERE g.status != 'completed'
               AND g.end_date::date = %s
               AND s.telegram_notifications = TRUE
               AND u.telegram_chat_id IS NOT NULL""",
            (tomorrow_str,)
        )
        
        upcoming_goals = cur.fetchall()
        
        bot_token = os.environ.get('TELEGRAM_BOT_TOKEN', '')
        
        for goal in upcoming_goals:
            goal_id, title, end_date, user_id, user_name, chat_id, tg_enabled = goal
            
            if tg_enabled and chat_id:
                message = f"🔔 Напоминание!\n\n📋 Задача: {title}\n⏰ Дедлайн: завтра\n\nНе забудьте завершить задачу вовремя!"
                
                send_telegram_message(bot_token, chat_id, message)
                
                cur.execute(
                    """INSERT INTO notifications (user_id, title, message, type, is_read) 
                       VALUES (%s, %s, %s, %s, FALSE)""",
                    (user_id, 'Напоминание о дедлайне', 
                     f'Задача "{title}" должна быть завершена завтра', 'deadline_reminder')
                )
                
                sent_count += 1
        
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'remindersSent': sent_count
            })
        }
        
    finally:
        cur.close()
        conn.close()

def send_telegram_message(bot_token: str, chat_id: str, text: str) -> bool:
    if not bot_token:
        return False
    
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    
    try:
        response = requests.post(url, json={
            'chat_id': chat_id,
            'text': text,
            'parse_mode': 'HTML'
        })
        return response.status_code == 200
    except Exception:
        return False