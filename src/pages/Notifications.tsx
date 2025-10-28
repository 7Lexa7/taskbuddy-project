import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { getNotifications, markAsRead as markAsReadAPI, deleteNotification as deleteNotificationAPI, Notification as APINotification } from '@/lib/notifications';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

const Notifications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить уведомления',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await markAsReadAPI(id);
      await loadNotifications();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отметить как прочитанное',
        variant: 'destructive'
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      for (const notif of notifications.filter(n => !n.isRead)) {
        await markAsReadAPI(notif.id);
      }
      await loadNotifications();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отметить все как прочитанные',
        variant: 'destructive'
      });
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await deleteNotificationAPI(id);
      await loadNotifications();
      toast({
        title: 'Удалено',
        description: 'Уведомление успешно удалено'
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить уведомление',
        variant: 'destructive'
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'deadline_reminder':
      case 'deadline':
        return { icon: 'AlertCircle' as const, color: 'text-red-600' };
      case 'task_completed':
        return { icon: 'CheckCircle' as const, color: 'text-green-600' };
      case 'task_created':
        return { icon: 'Plus' as const, color: 'text-blue-600' };
      case 'reminder':
        return { icon: 'Bell' as const, color: 'text-blue-600' };
      case 'achievement':
        return { icon: 'Trophy' as const, color: 'text-yellow-600' };
      case 'system':
      case 'success':
        return { icon: 'Info' as const, color: 'text-purple-600' };
      default:
        return { icon: 'Bell' as const, color: 'text-gray-600' };
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr + 'Z');
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} ${days === 1 ? 'день' : days <= 4 ? 'дня' : 'дней'} назад`;
    if (hours > 0) return `${hours} ${hours === 1 ? 'час' : hours <= 4 ? 'часа' : 'часов'} назад`;
    if (minutes > 0) return `${minutes} ${minutes === 1 ? 'минуту' : minutes <= 4 ? 'минуты' : 'минут'} назад`;
    return 'Только что';
  };

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);

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
                  <Card key={notification.id} className={notification.isRead ? 'opacity-60' : 'border-2'}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className={`mt-1 ${color}`}>
                          <Icon name={icon} size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-semibold">{notification.title}</h3>
                            {!notification.isRead && (
                              <Badge variant="default" className="shrink-0">Новое</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">{getTimeAgo(notification.createdAt)}</p>
                        </div>
                        <div className="flex gap-1">
                          {!notification.isRead && (
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
                          <p className="text-xs text-muted-foreground">{getTimeAgo(notification.createdAt)}</p>
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
                          <p className="text-xs text-muted-foreground">{getTimeAgo(notification.createdAt)}</p>
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