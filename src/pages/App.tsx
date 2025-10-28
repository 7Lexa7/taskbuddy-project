import { useState, useEffect } from 'react';
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
import EditTaskDialog from '@/components/EditTaskDialog';
import DeleteTaskDialog from '@/components/DeleteTaskDialog';
import TaskMenu from '@/components/TaskMenu';
import { useToast } from '@/hooks/use-toast';
import { getGoals, createGoal, updateGoal, deleteGoal, Goal } from '@/lib/goals';
import { getAuthData, logout } from '@/lib/auth';

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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = getAuthData();

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const goals = await getGoals();
      const validCategories = ['work', 'study', 'home', 'personal', 'projects'];
      const validPriorities = ['high', 'medium', 'low'];
      
      const mappedTasks: Task[] = goals
        .filter(goal => goal.status !== 'deleted')
        .map(goal => {
          const category = validCategories.includes(goal.category) ? goal.category : 'personal';
          const priority = validPriorities.includes(goal.priority) ? goal.priority : 'medium';
          
          const mode = category === 'study' ? 'study' : 'personal';
          
          return {
            id: goal.id.toString(),
            title: goal.title,
            category: category as Task['category'],
            priority: priority as Task['priority'],
            completed: goal.status === 'completed',
            dueDate: goal.endDate || new Date().toISOString().split('T')[0],
            mode: mode as Task['mode']
          };
        });
      setTasks(mappedTasks);
    } catch (error) {
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить задачи',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const categoryConfig = {
    work: { label: 'Работа', icon: 'Briefcase' as const },
    study: { label: 'Учёба', icon: 'GraduationCap' as const },
    home: { label: 'Дом', icon: 'Home' as const },
    personal: { label: 'Личное', icon: 'User' as const },
    projects: { label: 'Проекты', icon: 'Folder' as const }
  };

  const priorityConfig = {
    high: { label: 'Высокий', emoji: '🔴', color: 'bg-red-50 text-red-700 border-red-200' },
    medium: { label: 'Средний', emoji: '🟡', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    low: { label: 'Низкий', emoji: '🟢', color: 'bg-green-50 text-green-700 border-green-200' }
  };

  const filteredTasks = tasks.filter(task => {
    if (task.mode !== activeMode) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (filterCategory !== 'all' && task.category !== filterCategory) return false;
    if (filterStatus === 'completed' && !task.completed) return false;
    if (filterStatus === 'active' && task.completed) return false;
    return true;
  });
  const allModeTasks = tasks.filter(task => task.mode === activeMode);
  const completedTasks = allModeTasks.filter(task => task.completed).length;
  const totalTasks = allModeTasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    try {
      await updateGoal({
        id: parseInt(id),
        status: task.completed ? 'pending' : 'completed'
      });
      setTasks(tasks.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить задачу',
        variant: 'destructive'
      });
    }
  };

  const handleAddTask = async (newTask: {
    title: string;
    category: string;
    priority: string;
    dueDate: Date;
    description: string;
    mode: string;
  }) => {
    try {
      const goal = await createGoal({
        title: newTask.title,
        description: newTask.description,
        category: newTask.category,
        priority: newTask.priority,
        endDate: newTask.dueDate.toISOString().split('T')[0],
        status: 'pending'
      });
      
      const task: Task = {
        id: goal.id.toString(),
        title: goal.title,
        category: goal.category as Task['category'],
        priority: goal.priority as Task['priority'],
        completed: false,
        dueDate: goal.endDate || new Date().toISOString().split('T')[0],
        mode: newTask.mode as Task['mode']
      };
      
      setTasks([...tasks, task]);
      toast({
        title: 'Задача создана! 🎉',
        description: `"${task.title}" добавлена`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать задачу',
        variant: 'destructive'
      });
    }
  };

  const handleEditTask = async (updatedTask: Task) => {
    try {
      await updateGoal({
        id: parseInt(updatedTask.id),
        title: updatedTask.title,
        category: updatedTask.category,
        priority: updatedTask.priority,
        endDate: updatedTask.dueDate,
        status: updatedTask.completed ? 'completed' : 'pending'
      });
      
      setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
      toast({
        title: 'Задача обновлена! ✏️',
        description: `"${updatedTask.title}" успешно изменена`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить задачу',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteTask = async () => {
    if (selectedTask) {
      try {
        await deleteGoal(parseInt(selectedTask.id));
        setTasks(tasks.filter(task => task.id !== selectedTask.id));
        toast({
          title: 'Задача удалена 🗑️',
          description: `"${selectedTask.title}" удалена из списка`,
        });
        setDeleteDialogOpen(false);
        setSelectedTask(null);
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось удалить задачу',
          variant: 'destructive'
        });
      }
    }
  };

  const openEditDialog = (task: Task) => {
    setSelectedTask(task);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (task: Task) => {
    setSelectedTask(task);
    setDeleteDialogOpen(true);
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
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return tasks.filter(task => task.dueDate === dateStr);
  };

  const selectedDateTasks = date ? getTasksForDate(date) : [];

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
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Выйти"
            >
              <Icon name="LogOut" size={18} />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                Привет, {user?.username || 'Друг'}! <span className="animate-bounce">👋</span>
              </h1>
              <p className="text-muted-foreground text-lg">Сегодня отличный день для продуктивности</p>
            </div>
            <Button size="lg" className="shadow-lg hidden md:flex" onClick={() => setAddDialogOpen(true)}>
              <Icon name="Plus" className="mr-2" size={20} />
              Новая задача
            </Button>
          </div>
        </div>

        <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as 'personal' | 'study')} className="mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
            <TabsTrigger value="personal" className="gap-2 text-base">
              <Icon name="Target" size={18} />
              Личные цели
            </TabsTrigger>
            <TabsTrigger value="study" className="gap-2 text-base">
              <Icon name="GraduationCap" size={18} />
              Учёба
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 hover:shadow-lg transition-all animate-scale-in">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium">Прогресс</CardDescription>
                <Icon name="TrendingUp" size={16} className="text-green-600" />
              </div>
              <CardTitle className="text-4xl font-bold">{completedTasks}<span className="text-2xl text-muted-foreground">/{totalTasks}</span></CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={completionRate} className="h-3 mb-3" />
              <p className="text-sm text-muted-foreground font-medium">{Math.round(completionRate)}% выполнено</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-all animate-scale-in" style={{animationDelay: '0.1s'}}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium">Активных</CardDescription>
                <Icon name="ListTodo" size={16} className="text-blue-600" />
              </div>
              <CardTitle className="text-4xl font-bold">{totalTasks - completedTasks}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(getCategoryStats()).map(([cat, count]) => (
                  <Badge key={cat} variant="secondary" className="gap-1 text-xs">
                    <Icon name={categoryConfig[cat as keyof typeof categoryConfig].icon} size={12} />
                    {count}
                  </Badge>
                ))}
                {Object.keys(getCategoryStats()).length === 0 && (
                  <span className="text-sm text-muted-foreground">Нет активных задач</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-all bg-gradient-to-br from-red-50 to-orange-50 animate-scale-in" style={{animationDelay: '0.2s'}}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium">Срочных</CardDescription>
                <Icon name="AlertCircle" size={16} className="text-red-600" />
              </div>
              <CardTitle className="text-4xl font-bold text-red-600">
                {filteredTasks.filter(t => t.priority === 'high' && !t.completed).length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground font-medium">
                Требуют внимания сегодня
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center mb-4">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Icon name="ListChecks" size={24} />
                    Мои задачи
                  </CardTitle>
                  <Button size="sm" className="shadow-md md:hidden" onClick={() => setAddDialogOpen(true)}>
                    <Icon name="Plus" className="mr-2" size={16} />
                    Добавить
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Icon name="Filter" size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Фильтры:</span>
                  </div>
                  
                  <select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-1.5 text-sm border-2 rounded-lg bg-background hover:bg-accent transition-colors cursor-pointer font-medium"
                  >
                    <option value="all">Все задачи</option>
                    <option value="active">Активные</option>
                    <option value="completed">Выполненные</option>
                  </select>

                  <select 
                    value={filterPriority} 
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="px-3 py-1.5 text-sm border-2 rounded-lg bg-background hover:bg-accent transition-colors cursor-pointer font-medium"
                  >
                    <option value="all">Любой приоритет</option>
                    <option value="high">🔴 Высокий</option>
                    <option value="medium">🟡 Средний</option>
                    <option value="low">🟢 Низкий</option>
                  </select>

                  <select 
                    value={filterCategory} 
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-1.5 text-sm border-2 rounded-lg bg-background hover:bg-accent transition-colors cursor-pointer font-medium"
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
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-16">
                    <Icon name="Inbox" size={64} className="mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="font-semibold text-xl mb-2">Задач не найдено</h3>
                    <p className="text-muted-foreground mb-6">
                      {(filterStatus !== 'all' || filterPriority !== 'all' || filterCategory !== 'all') 
                        ? 'Попробуйте изменить фильтры или создайте новую задачу'
                        : 'Создайте свою первую задачу, чтобы начать'}
                    </p>
                    {(filterStatus !== 'all' || filterPriority !== 'all' || filterCategory !== 'all') ? (
                      <Button 
                        variant="outline" 
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
                      <Button onClick={() => setAddDialogOpen(true)}>
                        <Icon name="Plus" size={16} className="mr-2" />
                        Создать задачу
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredTasks
                      .sort((a, b) => {
                        const priorityOrder = { high: 0, medium: 1, low: 2 };
                        return priorityOrder[a.priority] - priorityOrder[b.priority];
                      })
                      .map((task) => (
                      <div
                        key={task.id}
                        className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                          task.completed ? 'bg-muted/30 opacity-60' : 'bg-card hover:border-primary/20'
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
                                className={`font-semibold text-base ${
                                  task.completed ? 'line-through text-muted-foreground' : ''
                                }`}
                              >
                                {task.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge
                                variant="outline"
                                className={`${priorityConfig[task.priority].color} text-xs font-medium border-2`}
                              >
                                {priorityConfig[task.priority].emoji} {priorityConfig[task.priority].label}
                              </Badge>
                              <Badge variant="secondary" className="text-xs gap-1 font-medium">
                                <Icon
                                  name={categoryConfig[task.category].icon}
                                  size={12}
                                />
                                {categoryConfig[task.category].label}
                              </Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                                <Icon name="Calendar" size={12} />
                                {new Date(task.dueDate).toLocaleDateString('ru-RU', {
                                  day: 'numeric',
                                  month: 'short',
                                })}
                              </span>
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

          <div>
            <Card className="border-2 shadow-lg sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Calendar" size={20} />
                  Календарь
                </CardTitle>
                <CardDescription>Выберите дату для просмотра задач</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-lg border-2"
                />
                {selectedDateTasks.length > 0 && (
                  <div className="mt-6 space-y-2">
                    <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Icon name="ListChecks" size={16} />
                      Задачи на {date?.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}:
                    </p>
                    {selectedDateTasks.map(task => (
                      <div key={task.id} className="text-sm p-3 bg-muted/50 rounded-lg border hover:bg-muted transition-colors">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{priorityConfig[task.priority].emoji}</span>
                          <span className={`font-medium flex-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
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

export default AppPage;