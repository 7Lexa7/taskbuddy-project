import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Notification {
  id: string;
  type: 'reminder' | 'deadline' | 'achievement' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'deadline',
      title: 'Скоро дедлайн',
      message: 'Задача "Подготовить презентацию по математике" завтра!',
      time: '2 часа назад',
      read: false
    },
    {
      id: '2',
      type: 'reminder',
      title: 'Напоминание',
      message: 'Не забудьте выполнить задачу "Записаться к стоматологу"',
      time: '5 часов назад',
      read: false
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Достижение разблокировано! 🏆',
      message: 'Вы получили награду "Огненная серия" за 12 дней подряд',
      time: '1 день назад',
      read: true
    },
    {
      id: '4',
      type: 'deadline',
      title: 'Срочно',
      message: 'Задача "Сдать лабораторную работу по физике" сегодня!',
      time: '3 часа назад',
      read: false
    },
    {
      id: '5',
      type: 'system',
      title: 'Обновление TaskBuddy',
      message: 'Появились новые возможности календаря',
      time: '2 дня назад',
      read: true
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'deadline':
        return { icon: 'AlertCircle' as const, color: 'text-red-600' };
      case 'reminder':
        return { icon: 'Bell' as const, color: 'text-blue-600' };
      case 'achievement':
        return { icon: 'Trophy' as const, color: 'text-yellow-600' };
      case 'system':
        return { icon: 'Info' as const, color: 'text-purple-600' };
      default:
        return { icon: 'Bell' as const, color: 'text-gray-600' };
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Icon name="CheckSquare" className="text-white" size={18} />
              </div>
              <span className="text-xl font-bold">TaskBuddy</span>
            </button>
            <div className="hidden md:flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => navigate('/app')}>
                <Icon name="Home" className="mr-2" size={16} />
                Главная
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/calendar')}>
                <Icon name="Calendar" className="mr-2" size={16} />
                Календарь
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/settings')}>
                <Icon name="Settings" className="mr-2" size={16} />
                Настройки
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/notifications')}>
              <Icon name="Bell" size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
              <Icon name="User" size={18} />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Уведомления 🔔</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `У вас ${unreadCount} непрочитанных уведомлений` : 'Все уведомления прочитаны'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <Icon name="CheckCheck" className="mr-2" size={16} />
              Прочитать все
            </Button>
          )}
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all">
              Все ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              Непрочитанные ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="read">
              Прочитанные ({readNotifications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Icon name="Bell" size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">Нет уведомлений</p>
                </CardContent>
              </Card>
            ) : (
              notifications.map(notification => {
                const { icon, color } = getNotificationIcon(notification.type);
                return (
                  <Card key={notification.id} className={notification.read ? 'opacity-60' : 'border-2'}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className={`mt-1 ${color}`}>
                          <Icon name={icon} size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-semibold">{notification.title}</h3>
                            {!notification.read && (
                              <Badge variant="default" className="shrink-0">Новое</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                        <div className="flex gap-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Icon name="Check" size={16} />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            {unreadNotifications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Icon name="CheckCheck" size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">Все уведомления прочитаны</p>
                </CardContent>
              </Card>
            ) : (
              unreadNotifications.map(notification => {
                const { icon, color } = getNotificationIcon(notification.type);
                return (
                  <Card key={notification.id} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className={`mt-1 ${color}`}>
                          <Icon name={icon} size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-semibold">{notification.title}</h3>
                            <Badge variant="default" className="shrink-0">Новое</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Icon name="Check" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="read" className="space-y-4">
            {readNotifications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Icon name="Bell" size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">Нет прочитанных уведомлений</p>
                </CardContent>
              </Card>
            ) : (
              readNotifications.map(notification => {
                const { icon, color } = getNotificationIcon(notification.type);
                return (
                  <Card key={notification.id} className="opacity-60">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className={`mt-1 ${color}`}>
                          <Icon name={icon} size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold mb-2">{notification.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Notifications;
