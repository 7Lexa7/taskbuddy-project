# Настройка системы уведомлений TaskBuddy

## 1. Настройка Telegram бота

### Шаг 1: Получить токен бота
1. Найти @BotFather в Telegram
2. Создать бота командой /newbot
3. Сохранить полученный токен в секреты проекта как TELEGRAM_BOT_TOKEN

### Шаг 2: Установка вебхука
Выполните в браузере (замените YOUR_BOT_TOKEN):
```
https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook?url=https://functions.poehali.dev/56ae3126-ff54-4116-b337-0d24caaf1ab1
```

### Шаг 3: Проверка вебхука
```
https://api.telegram.org/botYOUR_BOT_TOKEN/getWebhookInfo
```

## 2. Как работает система уведомлений

### Автоматические уведомления
- **Задача добавлена** - создаётся при добавлении новой задачи
- **Задача выполнена** - создаётся при завершении задачи
- **Напоминание о дедлайне** - отправляется за день до дедлайна

### Telegram-напоминания
1. Пользователь нажимает "Подключить Telegram" в настройках
2. Открывается бот с параметром start={user_id}
3. Бот получает /start команду и сохраняет chat_id
4. Система автоматически отправляет напоминания в Telegram

### Страница настроек
- Включение/отключение уведомлений
- Telegram уведомления (с кнопкой подключения бота)
- Email уведомления (еженедельный отчёт)
- Время напоминаний по умолчанию

## 3. Запуск напоминаний о дедлайнах

Для проверки работы напоминаний выполните:
```
curl -X POST "https://functions.poehali.dev/867eda63-4bc6-4dc2-be1c-296913159724?action=reminders"
```

Эту команду можно добавить в cron для ежедневной проверки дедлайнов.

## 4. URL функций

- **Auth**: https://functions.poehali.dev/6714bf23-2b98-4086-b7cf-7f34787b13b1
- **Goals**: https://functions.poehali.dev/3f03e5f8-24ed-4ceb-8910-272d2edf248d
- **Notifications**: https://functions.poehali.dev/867eda63-4bc6-4dc2-be1c-296913159724
- **Profile**: https://functions.poehali.dev/73db2568-4852-43e9-8d48-f0043157119d
- **Telegram Bot**: https://functions.poehali.dev/56ae3126-ff54-4116-b337-0d24caaf1ab1
