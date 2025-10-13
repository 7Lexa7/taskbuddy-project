import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import Icon from '@/components/ui/icon';
import { Checkbox } from '@/components/ui/checkbox';
import AddTaskDialog from '@/components/AddTaskDialog';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title: string;
  category: 'work' | 'study' | 'home' | 'personal' | 'projects';
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate: string;
  mode: 'personal' | 'study';
}

const AppPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeMode, setActiveMode] = useState<'personal' | 'study'>('personal');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  
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
    work: { label: 'Работа', icon: 'Briefcase' as const },
    study: { label: 'Учёба', icon: 'GraduationCap' as const },
    home: { label: 'Дом', icon: 'Home' as const },
    personal: { label: 'Личное', icon: 'User' as const },
    projects: { label: 'Проекты', icon: 'Folder' as const }
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

  const handleAddTask = (newTask: {
    title: string;
    category: string;
    priority: string;
    dueDate: Date;
    description: string;
    mode: string;
  }) => {
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      category: newTask.category as Task['category'],
      priority: newTask.priority as Task['priority'],
      completed: false,
      dueDate: newTask.dueDate.toISOString().split('T')[0],
      mode: newTask.mode as Task['mode']
    };
    setTasks([...tasks, task]);
    toast({
      title: 'Задача создана! 🎉',
      description: `"${task.title}" добавлена в ${task.mode === 'personal' ? 'Личные цели' : 'Учёбу'}`,
    });
  };

  const getCategoryStats = () => {
    const stats = filteredTasks.reduce((acc, task) => {
      if (!acc[task.category]) acc[task.category] = 0;
      acc[task.category]++;
      return acc;
    }, {} as Record<string, number>);
    return stats;
  };

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate === dateStr);
  };

  const selectedDateTasks = date ? getTasksForDate(date) : [];

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

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Мои задачи</CardTitle>
                  <Button size="sm" onClick={() => setAddDialogOpen(true)}>
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

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Календарь</CardTitle>
                <CardDescription>Выберите дату для просмотра задач</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
                {selectedDateTasks.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">Задачи на выбранную дату:</p>
                    {selectedDateTasks.map(task => (
                      <div key={task.id} className="text-sm p-2 bg-muted rounded-md">
                        <div className="flex items-center gap-2">
                          {priorityConfig[task.priority].emoji}
                          <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                            {task.title}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AddTaskDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAddTask={handleAddTask}
        defaultMode={activeMode}
      />
    </div>
  );
};

export default AppPage;