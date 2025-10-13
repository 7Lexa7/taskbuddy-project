import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';

const Profile = () => {
  const navigate = useNavigate();

  const stats = {
    totalTasks: 47,
    completedTasks: 32,
    streakDays: 12,
    categoriesUsed: 5
  };

  const completionRate = (stats.completedTasks / stats.totalTasks) * 100;

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
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
              <Icon name="User" size={18} />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  АП
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">Александр Петров</h1>
                <p className="text-muted-foreground mb-4">alex.petrov@example.com</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge variant="secondary" className="gap-1">
                    <Icon name="Target" size={14} />
                    Личные цели
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Icon name="GraduationCap" size={14} />
                    Учёба
                  </Badge>
                  <Badge className="gap-1 bg-gradient-to-r from-orange-500 to-pink-500">
                    <Icon name="Flame" size={14} />
                    {stats.streakDays} дней подряд
                  </Badge>
                </div>
              </div>
              <Button variant="outline" onClick={() => navigate('/settings')}>
                <Icon name="Settings" className="mr-2" size={16} />
                Редактировать
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Статистика продуктивности</CardTitle>
              <CardDescription>Ваши достижения за всё время</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Выполнено задач</span>
                  <span className="text-sm text-muted-foreground">
                    {stats.completedTasks}/{stats.totalTasks}
                  </span>
                </div>
                <Progress value={completionRate} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{Math.round(completionRate)}% завершено</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Icon name="CheckCircle2" className="mx-auto mb-2 text-green-600" size={24} />
                  <p className="text-2xl font-bold">{stats.completedTasks}</p>
                  <p className="text-xs text-muted-foreground">Выполнено</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Icon name="Clock" className="mx-auto mb-2 text-blue-600" size={24} />
                  <p className="text-2xl font-bold">{stats.totalTasks - stats.completedTasks}</p>
                  <p className="text-xs text-muted-foreground">В процессе</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Достижения 🏆</CardTitle>
              <CardDescription>Ваши награды и успехи</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                  <div className="text-3xl">🔥</div>
                  <div>
                    <p className="font-medium">Огненная серия</p>
                    <p className="text-sm text-muted-foreground">{stats.streakDays} дней подряд</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                  <div className="text-3xl">⭐</div>
                  <div>
                    <p className="font-medium">Первые шаги</p>
                    <p className="text-sm text-muted-foreground">Выполнено 10 задач</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 border rounded-lg opacity-50">
                  <div className="text-3xl">🎯</div>
                  <div>
                    <p className="font-medium">Мастер продуктивности</p>
                    <p className="text-sm text-muted-foreground">Выполнить 100 задач</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 border rounded-lg opacity-50">
                  <div className="text-3xl">📚</div>
                  <div>
                    <p className="font-medium">Вечный студент</p>
                    <p className="text-sm text-muted-foreground">50 задач в режиме "Учёба"</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Активность по категориям</CardTitle>
            <CardDescription>Распределение ваших задач</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon name="GraduationCap" size={16} className="text-purple-600" />
                    <span className="text-sm font-medium">Учёба</span>
                  </div>
                  <span className="text-sm text-muted-foreground">18 задач</span>
                </div>
                <Progress value={38} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon name="Folder" size={16} className="text-orange-600" />
                    <span className="text-sm font-medium">Проекты</span>
                  </div>
                  <span className="text-sm text-muted-foreground">12 задач</span>
                </div>
                <Progress value={26} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon name="User" size={16} className="text-pink-600" />
                    <span className="text-sm font-medium">Личное</span>
                  </div>
                  <span className="text-sm text-muted-foreground">10 задач</span>
                </div>
                <Progress value={21} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon name="Briefcase" size={16} className="text-blue-600" />
                    <span className="text-sm font-medium">Работа</span>
                  </div>
                  <span className="text-sm text-muted-foreground">5 задач</span>
                </div>
                <Progress value={11} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon name="Home" size={16} className="text-green-600" />
                    <span className="text-sm font-medium">Дом</span>
                  </div>
                  <span className="text-sm text-muted-foreground">2 задачи</span>
                </div>
                <Progress value={4} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-center">
          <Button variant="outline" onClick={() => navigate('/login')}>
            <Icon name="LogOut" className="mr-2" size={16} />
            Выйти из аккаунта
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
