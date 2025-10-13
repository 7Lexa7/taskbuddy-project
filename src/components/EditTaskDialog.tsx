import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Task {
  id: string;
  title: string;
  category: 'work' | 'study' | 'home' | 'personal' | 'projects';
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate: string;
  mode: 'personal' | 'study';
}

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditTask: (task: Task) => void;
  task: Task | null;
}

const EditTaskDialog = ({ open, onOpenChange, onEditTask, task }: EditTaskDialogProps) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState<'personal' | 'study'>('personal');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setCategory(task.category);
      setPriority(task.priority);
      setDueDate(new Date(task.dueDate));
      setMode(task.mode);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !dueDate || !task) {
      alert('Заполните все обязательные поля');
      return;
    }

    const updatedTask: Task = {
      ...task,
      title,
      category: category as Task['category'],
      priority: priority as Task['priority'],
      dueDate: dueDate.toISOString().split('T')[0],
      mode
    };

    onEditTask(updatedTask);
    onOpenChange(false);
  };

  const categoryOptions = [
    { value: 'work', label: 'Работа', icon: 'Briefcase' as const },
    { value: 'study', label: 'Учёба', icon: 'GraduationCap' as const },
    { value: 'home', label: 'Дом', icon: 'Home' as const },
    { value: 'personal', label: 'Личное', icon: 'User' as const },
    { value: 'projects', label: 'Проекты', icon: 'Folder' as const }
  ];

  const priorityOptions = [
    { value: 'high', label: 'Высокий', emoji: '🔴' },
    { value: 'medium', label: 'Средний', emoji: '🟡' },
    { value: 'low', label: 'Низкий', emoji: '🟢' }
  ];

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Редактировать задачу</DialogTitle>
          <DialogDescription>
            Измените детали задачи
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">
                Название задачи <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-title"
                placeholder="Например: Подготовить презентацию"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Описание (опционально)</Label>
              <Textarea
                id="edit-description"
                placeholder="Добавьте детали к задаче..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">
                  Категория <span className="text-red-500">*</span>
                </Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <div className="flex items-center gap-2">
                          <Icon name={cat.icon} size={14} />
                          {cat.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-priority">Приоритет</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger id="edit-priority">
                    <SelectValue placeholder="Выберите приоритет" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        <div className="flex items-center gap-2">
                          <span>{p.emoji}</span>
                          {p.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-mode">Режим</Label>
                <Select value={mode} onValueChange={(val) => setMode(val as 'personal' | 'study')}>
                  <SelectTrigger id="edit-mode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">
                      <div className="flex items-center gap-2">
                        <Icon name="Target" size={14} />
                        Личные цели
                      </div>
                    </SelectItem>
                    <SelectItem value="study">
                      <div className="flex items-center gap-2">
                        <Icon name="GraduationCap" size={14} />
                        Учёба
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  Дедлайн <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Icon name="Calendar" className="mr-2" size={16} />
                      {dueDate ? format(dueDate, 'dd MMM yyyy', { locale: ru }) : 'Выберите дату'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit">
              <Icon name="Check" className="mr-2" size={16} />
              Сохранить изменения
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskDialog;
