'''
Business: Handle Telegram bot integration (webhook, send notifications)
Args: event - dict with httpMethod, body, queryStringParameters
      context - object with request_id, function_name, etc.
Returns: HTTP response dict
'''

import json
import os
import psycopg2
import requests
from typing import Dict, Any, Optional

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def get_bot_token() -> str:
    return os.environ.get('TELEGRAM_BOT_TOKEN', '')

def send_telegram_message(chat_id: int, text: str) -> bool:
    bot_token = get_bot_token()
    if not bot_token:
        return False
    
    url = f'https://api.telegram.org/bot{bot_token}/sendMessage'
    data = {
        'chat_id': chat_id,
        'text': text,
        'parse_mode': 'HTML'
    }
    
    try:
        response = requests.post(url, json=data, timeout=10)
        return response.status_code == 200
    except Exception:
        return False

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    try:
        if method == 'POST':
            body_str = event.get('body', '{}')
            if body_str:
                body = json.loads(body_str)
            else:
                body = {}
            
            if 'message' in body:
                return handle_webhook(body)
            else:
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'ok': True})
                }
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

def handle_webhook(update: Dict[str, Any]) -> Dict[str, Any]:
    message = update.get('message', {})
    chat_id = message.get('chat', {}).get('id')
    text = message.get('text', '')
    
    if not chat_id:
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True})
        }
    
    if text.startswith('/start'):
        conn = get_db_connection()
        cur = conn.cursor()
        
        try:
            parts = text.split()
            if len(parts) > 1:
                user_id = int(parts[1])
                
                cur.execute(
                    "UPDATE t_p59845625_taskbuddy_project.users SET telegram_chat_id = %s WHERE id = %s",
                    (chat_id, user_id)
                )
                conn.commit()
                
                send_telegram_message(
                    chat_id,
                    '<b>✅ Telegram успешно подключен!</b>\n\n'
                    'Теперь вы будете получать уведомления о ваших задачах прямо в Telegram.'
                )
            else:
                send_telegram_message(
                    chat_id,
                    '<b>👋 Добро пожаловать в TaskBuddy Bot!</b>\n\n'
                    'Для подключения уведомлений используйте ссылку из настроек профиля.'
                )
        finally:
            cur.close()
            conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({'ok': True})
    }