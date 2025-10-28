# Настройка Telegram бота

## Шаг 1: Установка вебхука

Выполните этот запрос (замените YOUR_BOT_TOKEN на токен бота):

```bash
curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://functions.poehali.dev/56ae3126-ff54-4116-b337-0d24caaf1ab1"
  }'
```

Или через браузер:
```
https://api.telegram.org/bot8484882642:AAFUNxUGJJuxv_I00a5TRdfhR1BxyAu_iDE/setWebhook?url=https://functions.poehali.dev/56ae3126-ff54-4116-b337-0d24caaf1ab1
```

## Шаг 2: Проверка вебхука

```
https://api.telegram.org/bot8484882642:AAFUNxUGJJuxv_I00a5TRdfhR1BxyAu_iDE/getWebhookInfo
```

## Как это работает:

1. Пользователь нажимает "Подключить Telegram" в профиле
2. Открывается бот с параметром start={user_id}
3. Бот получает команду /start {user_id}
4. Бот сохраняет telegram_chat_id пользователя в базу
5. Теперь можно отправлять уведомления через Telegram API
