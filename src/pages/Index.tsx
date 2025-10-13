import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Checkbox } from '@/components/ui/checkbox';

interface Task {
  id: string;
  title: string;
  category: 'work' | 'study' | 'home' | 'personal' | 'projects';
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate: string;
  mode: 'personal' | 'study';
}

const Index = () => {
  const [showApp, setShowApp] = useState(false);
  const [activeMode, setActiveMode] = useState<'personal' | 'study'>('personal');
  
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Подготовить презентацию по математике',
      category: 'study',
      priority: 'high',
      completed: false,
      dueDate: '2025-10-14',
      mode: 'study'
    },
    {
      id: '2',
      title: 'Закончить UI дизайн проекта',
      category: 'projects',
      priority: 'high',
      completed: false,
      dueDate: '2025-10-15',
      mode: 'personal'
    },
    {
      id: '3',
      title: 'Выучить 20 английских слов',
      category: 'study',
      priority: 'medium',
      completed: true,
      dueDate: '2025-10-13',
      mode: 'study'
    },
    {
      id: '4',
      title: 'Записаться к стоматологу',
      category: 'personal',
      priority: 'medium',
      completed: false,
      dueDate: '2025-10-16',
      mode: 'personal'
    },
    {
      id: '5',
      title: 'Сдать лабораторную работу по физике',
      category: 'study',
      priority: 'high',
      completed: false,
      dueDate: '2025-10-14',
      mode: 'study'
    }
  ]);

  const categoryConfig = {
    work: { label: 'Работа', color: 'bg-blue-500', icon: 'Briefcase' as const },
    study: { label: 'Учёба', color: 'bg-purple-500', icon: 'GraduationCap' as const },
    home: { label: 'Дом', color: 'bg-green-500', icon: 'Home' as const },
    personal: { label: 'Личное', color: 'bg-pink-500', icon: 'User' as const },
    projects: { label: 'Проекты', color: 'bg-orange-500', icon: 'Folder' as const }
  };

  const priorityConfig = {
    high: { label: 'Высокий', emoji: '🔴', color: 'bg-red-100 text-red-700 border-red-300' },
    medium: { label: 'Средний', emoji: '🟡', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
    low: { label: 'Низкий', emoji: '🟢', color: 'bg-green-100 text-green-700 border-green-300' }
  };

  const filteredTasks = tasks.filter(task => task.mode === activeMode);
  const completedTasks = filteredTasks.filter(task => task.completed).length;
  const totalTasks = filteredTasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const getCategoryStats = () => {
    const stats = filteredTasks.reduce((acc, task) => {
      if (!acc[task.category]) acc[task.category] = 0;
      acc[task.category]++;
      return acc;
    }, {} as Record<string, number>);
    return stats;
  };

  if (!showApp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Icon name="CheckSquare" className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskBuddy
              </span>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" size="lg">Войти</Button>
              <Button size="lg" onClick={() => setShowApp(true)}>
                Попробовать бесплатно
              </Button>
            </div>
          </div>
        </nav>

        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Умный менеджер задач для жизни и учёбы
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              TaskBuddy помогает организовать личные цели и учебные задачи в одном месте. 
              Приоритеты, напоминания, статистика — всё для вашей продуктивности.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="text-lg px-8" onClick={() => setShowApp(true)}>
                <Icon name="Rocket" className="mr-2" size={20} />
                Начать бесплатно
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Icon name="Play" className="mr-2" size={20} />
                Смотреть демо
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <Icon name="Target" className="text-blue-600" size={24} />
                </div>
                <CardTitle>Два режима работы</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Переключайтесь между "Личными целями" и "Учёбой" для разных контекстов жизни
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                  <Icon name="Bell" className="text-purple-600" size={24} />
                </div>
                <CardTitle>Умные уведомления</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Напоминания в Telegram и на сайте, чтобы не пропустить важные дедлайны
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                  <Icon name="TrendingUp" className="text-green-600" size={24} />
                </div>
                <CardTitle>Статистика прогресса</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Отслеживайте продуктивность с наглядными графиками и диаграммами
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                  <Icon name="Flag" className="text-red-600" size={24} />
                </div>
                <CardTitle>Приоритеты задач</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Три уровня приоритета: высокий 🔴, средний 🟡 и низкий 🟢
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                  <Icon name="FolderKanban" className="text-orange-600" size={24} />
                </div>
                <CardTitle>Категории</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Группируйте задачи: Работа, Учёба, Дом, Личное, Проекты
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center mb-4">
                  <Icon name="Repeat" className="text-pink-600" size={24} />
                </div>
                <CardTitle>Повторы</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Автоматическое создание повторяющихся задач и привычек
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        <footer className="border-t py-8 mt-20">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p>© 2025 TaskBuddy. Умный помощник для ваших задач.</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Icon name="CheckSquare" className="text-white" size={18} />
              </div>
              <span className="text-xl font-bold">TaskBuddy</span>
            </div>
            <div className="hidden md:flex gap-1">
              <Button variant="ghost" size="sm">
                <Icon name="Home" className="mr-2" size={16} />
                Главная
              </Button>
              <Button variant="ghost" size="sm">
                <Icon name="ListTodo" className="mr-2" size={16} />
                Задачи
              </Button>
              <Button variant="ghost" size="sm">
                <Icon name="Calendar" className="mr-2" size={16} />
                Календарь
              </Button>
              <Button variant="ghost" size="sm">
                <Icon name="Settings" className="mr-2" size={16} />
                Настройки
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Icon name="Bell" size={18} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="User" size={18} />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Привет! 👋</h1>
          <p className="text-muted-foreground">Сегодня отличный день для продуктивности</p>
        </div>

        <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as 'personal' | 'study')} className="mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="personal" className="gap-2">
              <Icon name="Target" size={16} />
              Личные цели
            </TabsTrigger>
            <TabsTrigger value="study" className="gap-2">
              <Icon name="GraduationCap" size={16} />
              Учёба
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Выполнено задач</CardDescription>
              <CardTitle className="text-3xl">{completedTasks}/{totalTasks}</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={completionRate} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">{Math.round(completionRate)}% завершено</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Активных задач</CardDescription>
              <CardTitle className="text-3xl">{totalTasks - completedTasks}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap mt-2">
                {Object.entries(getCategoryStats()).map(([cat, count]) => (
                  <Badge key={cat} variant="secondary" className="gap-1">
                    <Icon name={categoryConfig[cat as keyof typeof categoryConfig].icon} size={12} />
                    {count}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Срочных задач</CardDescription>
              <CardTitle className="text-3xl text-red-600">
                {filteredTasks.filter(t => t.priority === 'high' && !t.completed).length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mt-2">
                Требуют внимания сегодня
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Мои задачи</CardTitle>
              <Button size="sm">
                <Icon name="Plus" className="mr-2" size={16} />
                Добавить задачу
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredTasks
                .sort((a, b) => {
                  const priorityOrder = { high: 0, medium: 1, low: 2 };
                  return priorityOrder[a.priority] - priorityOrder[b.priority];
                })
                .map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                      task.completed ? 'bg-muted/50 opacity-60' : 'bg-card'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3
                            className={`font-medium ${
                              task.completed ? 'line-through text-muted-foreground' : ''
                            }`}
                          >
                            {task.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className={`${priorityConfig[task.priority].color} text-xs`}
                          >
                            {priorityConfig[task.priority].emoji} {priorityConfig[task.priority].label}
                          </Badge>
                          <Badge variant="secondary" className="text-xs gap-1">
                            <Icon
                              name={categoryConfig[task.category].icon}
                              size={12}
                            />
                            {categoryConfig[task.category].label}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Icon name="Calendar" size={12} />
                            {new Date(task.dueDate).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <Icon name="MoreVertical" size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
