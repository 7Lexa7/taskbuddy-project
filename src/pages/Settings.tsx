import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';

const Settings = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [telegramNotifications, setTelegramNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-background to-purple-50/30">
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                <Icon name="CheckSquare" className="text-white" size={18} />
              </div>
              <span className="text-xl font-bold gradient-text">TaskBuddy</span>
            </button>
            <div className="hidden md:flex gap-1">
              <Button variant="ghost" size="sm" className="gap-2" onClick={() => navigate('/app')}>
                <Icon name="LayoutDashboard" size={16} />
                Панель
              </Button>
              <Button variant="ghost" size="sm" className="gap-2" onClick={() => navigate('/calendar')}>
                <Icon name="Calendar" size={16} />
                Календарь
              </Button>
              <Button variant="ghost" size="sm" className="gap-2" onClick={() => navigate('/settings')}>
                <Icon name="Settings" size={16} />
                Настройки
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/notifications')}>
              <Icon name="Bell" size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
              <Icon name="User" size={18} />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <Icon name="Settings" size={32} className="text-primary" />
            Настройки
          </h1>
          <p className="text-muted-foreground text-lg">Персонализируйте TaskBuddy под себя</p>
        </div>

        <div className="space-y-6">
          <Card className="border-2 shadow-lg animate-scale-in">
            <CardHeader>
              <CardTitle>Уведомления</CardTitle>
              <CardDescription>Настройте способы получения напоминаний о задачах</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications" className="text-base">Включить уведомления</Label>
                  <p className="text-sm text-muted-foreground">
                    Получать напоминания о задачах и дедлайнах
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="telegram" className="text-base">Telegram уведомления</Label>
                  <p className="text-sm text-muted-foreground">
                    Напоминания через Telegram бота
                  </p>
                </div>
                <Switch
                  id="telegram"
                  checked={telegramNotifications}
                  onCheckedChange={setTelegramNotifications}
                  disabled={!notifications}
                />
              </div>

              {telegramNotifications && (
                <div className="pl-4 space-y-2">
                  <Label htmlFor="telegram-username">Telegram Username</Label>
                  <Input
                    id="telegram-username"
                    placeholder="@username"
                    defaultValue="@username"
                  />
                  <Button variant="outline" size="sm">
                    <Icon name="Link" className="mr-2" size={14} />
                    Подключить бота
                  </Button>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email" className="text-base">Email уведомления</Label>
                  <p className="text-sm text-muted-foreground">
                    Получать еженедельный отчёт на почту
                  </p>
                </div>
                <Switch
                  id="email"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  disabled={!notifications}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="reminder-time">Время напоминаний по умолчанию</Label>
                <Select defaultValue="1hour">
                  <SelectTrigger id="reminder-time">
                    <SelectValue placeholder="Выберите время" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10min">За 10 минут</SelectItem>
                    <SelectItem value="30min">За 30 минут</SelectItem>
                    <SelectItem value="1hour">За 1 час</SelectItem>
                    <SelectItem value="1day">За 1 день</SelectItem>
                    <SelectItem value="1week">За 1 неделю</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-lg animate-scale-in" style={{animationDelay: '0.1s'}}>
            <CardHeader>
              <CardTitle>Внешний вид</CardTitle>
              <CardDescription>Настройте тему и оформление интерфейса</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode" className="text-base">Тёмная тема 🌙</Label>
                  <p className="text-sm text-muted-foreground">
                    Переключить на тёмное оформление
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="accent-color">Акцентный цвет</Label>
                <Select defaultValue="blue">
                  <SelectTrigger id="accent-color">
                    <SelectValue placeholder="Выберите цвет" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">🔵 Синий</SelectItem>
                    <SelectItem value="purple">🟣 Фиолетовый</SelectItem>
                    <SelectItem value="green">🟢 Зелёный</SelectItem>
                    <SelectItem value="orange">🟠 Оранжевый</SelectItem>
                    <SelectItem value="pink">🩷 Розовый</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-lg animate-scale-in" style={{animationDelay: '0.2s'}}>
            <CardHeader>
              <CardTitle>Категории</CardTitle>
              <CardDescription>Управляйте категориями задач</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="Briefcase" size={20} className="text-blue-600" />
                    <span className="font-medium">Работа</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Icon name="Settings" size={16} />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="GraduationCap" size={20} className="text-purple-600" />
                    <span className="font-medium">Учёба</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Icon name="Settings" size={16} />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="Home" size={20} className="text-green-600" />
                    <span className="font-medium">Дом</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Icon name="Settings" size={16} />
                  </Button>
                </div>
                <Button variant="outline" className="w-full">
                  <Icon name="Plus" className="mr-2" size={16} />
                  Добавить категорию
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-lg bg-red-50/50 animate-scale-in" style={{animationDelay: '0.3s'}}>
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <Icon name="AlertTriangle" size={20} />
                Опасная зона
              </CardTitle>
              <CardDescription>Необратимые действия с вашим аккаунтом</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full">
                Экспорт данных
              </Button>
              <Button variant="destructive" className="w-full">
                Удалить аккаунт
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => navigate('/app')}>
              Отмена
            </Button>
            <Button>
              Сохранить изменения
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;