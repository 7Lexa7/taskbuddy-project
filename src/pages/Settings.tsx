import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const API_BASE = 'https://functions.poehali.dev';

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: false,
    telegramNotifications: true,
    reminderTime: '1day'
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/867eda63-4bc6-4dc2-be1c-296913159724?action=settings`, {
        headers: { 'X-Auth-Token': token }
      });

      if (!response.ok) throw new Error('Failed to load settings');

      const data = await response.json();
      setSettings({
        notifications: data.notifications ?? true,
        emailNotifications: data.emailNotifications ?? false,
        telegramNotifications: data.telegramNotifications ?? true,
        reminderTime: data.reminderTime ?? '1day'
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (key: string, value: any) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/867eda63-4bc6-4dc2-be1c-296913159724?action=settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify({ [key]: value })
      });

      if (!response.ok) throw new Error('Failed to save settings');

      toast({
        title: 'Настройки сохранены',
        description: 'Изменения применены успешно'
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить настройки',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSwitchChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    saveSettings(key, value);
  };

  const handleSelectChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    saveSettings(key, value);
  };

  const connectTelegram = () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      window.open(`https://t.me/YourTaskBuddyBot?start=${userId}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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
                  checked={settings.notifications}
                  onCheckedChange={(v) => handleSwitchChange('notifications', v)}
                  disabled={saving}
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
                  checked={settings.telegramNotifications}
                  onCheckedChange={(v) => handleSwitchChange('telegramNotifications', v)}
                  disabled={!settings.notifications || saving}
                />
              </div>

              {settings.telegramNotifications && (
                <div className="pl-4">
                  <Button variant="outline" size="sm" onClick={connectTelegram}>
                    <Icon name="MessageCircle" className="mr-2" size={14} />
                    Подключить Telegram бота
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Нажмите, чтобы открыть бота и подключить уведомления
                  </p>
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
                  checked={settings.emailNotifications}
                  onCheckedChange={(v) => handleSwitchChange('emailNotifications', v)}
                  disabled={!settings.notifications || saving}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="reminder-time">Время напоминаний по умолчанию</Label>
                <Select 
                  value={settings.reminderTime} 
                  onValueChange={(v) => handleSelectChange('reminderTime', v)}
                  disabled={saving}
                >
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
        </div>
      </div>
    </div>
  );
};

export default Settings;