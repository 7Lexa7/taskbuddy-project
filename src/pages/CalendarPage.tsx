import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
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

const CalendarPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
      description: `"${task.title}" добавлена на ${new Date(task.dueDate).toLocaleDateString('ru-RU')}`,
    });
  };

  const priorityConfig = {
    high: { label: 'Высокий', emoji: '🔴' },
    medium: { label: 'Средний', emoji: '🟡' },
    low: { label: 'Низкий', emoji: '🟢' }
  };

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate === dateStr);
  };

  const getWeekDates = () => {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();
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
          <h1 className="text-3xl font-bold mb-2">Календарь задач 📅</h1>
          <p className="text-muted-foreground">Планируйте и отслеживайте дедлайны</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Выберите дату</CardTitle>
              <CardDescription>Нажмите на дату для просмотра задач</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Задачи на {date?.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
              </CardTitle>
              <CardDescription>
                {selectedDateTasks.length === 0 ? 'Нет задач' : `Всего задач: ${selectedDateTasks.length}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDateTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="Calendar" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Нет задач на эту дату</p>
                  <Button className="mt-4" size="sm" onClick={() => setAddDialogOpen(true)}>
                    <Icon name="Plus" className="mr-2" size={16} />
                    Добавить задачу
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateTasks.map(task => (
                    <div key={task.id} className="p-4 border-2 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{priorityConfig[task.priority].emoji}</span>
                            <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {task.title}
                            </h3>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {task.category}
                            </Badge>
                            {task.completed && (
                              <Badge variant="outline" className="text-xs bg-green-100 text-green-700">
                                Выполнено
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Icon name="MoreVertical" size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Задачи на неделю</CardTitle>
            <CardDescription>Обзор ближайших дедлайнов</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-7 gap-4">
              {weekDates.map((weekDate, index) => {
                const dayTasks = getTasksForDate(weekDate);
                const isToday = weekDate.toDateString() === new Date().toDateString();
                
                return (
                  <div
                    key={index}
                    className={`p-4 border-2 rounded-lg ${isToday ? 'border-primary bg-primary/5' : ''}`}
                  >
                    <div className="text-center mb-3">
                      <p className={`text-sm font-medium ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                        {weekDate.toLocaleDateString('ru-RU', { weekday: 'short' })}
                      </p>
                      <p className={`text-2xl font-bold ${isToday ? 'text-primary' : ''}`}>
                        {weekDate.getDate()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {dayTasks.length === 0 ? (
                        <p className="text-xs text-center text-muted-foreground">Нет задач</p>
                      ) : (
                        dayTasks.map(task => (
                          <div
                            key={task.id}
                            className="text-xs p-2 bg-muted rounded-md"
                          >
                            <div className="flex items-center gap-1">
                              <span>{priorityConfig[task.priority].emoji}</span>
                              <span className={`truncate ${task.completed ? 'line-through' : ''}`}>
                                {task.title}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <AddTaskDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAddTask={handleAddTask}
        defaultMode="personal"
      />
    </div>
  );
};

export default CalendarPage;