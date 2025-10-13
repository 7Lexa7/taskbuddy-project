import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import AddTaskDialog from '@/components/AddTaskDialog';
import EditTaskDialog from '@/components/EditTaskDialog';
import DeleteTaskDialog from '@/components/DeleteTaskDialog';
import TaskMenu from '@/components/TaskMenu';
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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

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

  const handleEditTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    toast({
      title: 'Задача обновлена! ✏️',
      description: `"${updatedTask.title}" успешно изменена`,
    });
  };

  const handleDeleteTask = () => {
    if (selectedTask) {
      setTasks(tasks.filter(task => task.id !== selectedTask.id));
      toast({
        title: 'Задача удалена 🗑️',
        description: `"${selectedTask.title}" удалена из списка`,
      });
      setDeleteDialogOpen(false);
      setSelectedTask(null);
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const openEditDialog = (task: Task) => {
    setSelectedTask(task);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (task: Task) => {
    setSelectedTask(task);
    setDeleteDialogOpen(true);
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
  const selectedDateTasks = date ? getTasksForDate(date).filter(task => {
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (filterCategory !== 'all' && task.category !== filterCategory) return false;
    if (filterStatus === 'completed' && !task.completed) return false;
    if (filterStatus === 'active' && task.completed) return false;
    return true;
  }) : [];

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
              
              <div className="flex flex-wrap gap-2 pt-4 border-t mt-4">
                <div className="flex items-center gap-2">
                  <Icon name="Filter" size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Фильтры:</span>
                </div>
                
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1.5 text-sm border rounded-md bg-background hover:bg-accent transition-colors cursor-pointer"
                >
                  <option value="all">Все задачи</option>
                  <option value="active">Активные</option>
                  <option value="completed">Выполненные</option>
                </select>

                <select 
                  value={filterPriority} 
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-3 py-1.5 text-sm border rounded-md bg-background hover:bg-accent transition-colors cursor-pointer"
                >
                  <option value="all">Любой приоритет</option>
                  <option value="high">🔴 Высокий</option>
                  <option value="medium">🟡 Средний</option>
                  <option value="low">🟢 Низкий</option>
                </select>

                <select 
                  value={filterCategory} 
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-1.5 text-sm border rounded-md bg-background hover:bg-accent transition-colors cursor-pointer"
                >
                  <option value="all">Все категории</option>
                  <option value="work">💼 Работа</option>
                  <option value="study">🎓 Учёба</option>
                  <option value="home">🏠 Дом</option>
                  <option value="personal">👤 Личное</option>
                  <option value="projects">📁 Проекты</option>
                </select>

                {(filterStatus !== 'all' || filterPriority !== 'all' || filterCategory !== 'all') && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setFilterStatus('all');
                      setFilterPriority('all');
                      setFilterCategory('all');
                    }}
                    className="text-xs"
                  >
                    <Icon name="X" size={14} className="mr-1" />
                    Сбросить
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {selectedDateTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="Inbox" size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="mb-2">
                    {(filterStatus !== 'all' || filterPriority !== 'all' || filterCategory !== 'all') 
                      ? 'Задач не найдено с выбранными фильтрами'
                      : 'Нет задач на эту дату'}
                  </p>
                  {(filterStatus !== 'all' || filterPriority !== 'all' || filterCategory !== 'all') ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setFilterStatus('all');
                        setFilterPriority('all');
                        setFilterCategory('all');
                      }}
                    >
                      <Icon name="X" size={16} className="mr-2" />
                      Сбросить фильтры
                    </Button>
                  ) : (
                    <Button className="mt-2" size="sm" onClick={() => setAddDialogOpen(true)}>
                      <Icon name="Plus" className="mr-2" size={16} />
                      Добавить задачу
                    </Button>
                  )}
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
                        <TaskMenu
                          onEdit={() => openEditDialog(task)}
                          onDelete={() => openDeleteDialog(task)}
                          onToggleComplete={() => toggleTask(task.id)}
                          isCompleted={task.completed}
                        />
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

      <EditTaskDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onEditTask={handleEditTask}
        task={selectedTask}
      />

      <DeleteTaskDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDeleteTask={handleDeleteTask}
        task={selectedTask}
      />
    </div>
  );
};

export default CalendarPage;