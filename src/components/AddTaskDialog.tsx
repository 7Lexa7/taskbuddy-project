import { useState } from 'react';
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

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: (task: {
    title: string;
    category: string;
    priority: string;
    dueDate: Date;
    description: string;
    mode: string;
  }) => void;
  defaultMode: 'personal' | 'study';
}

const AddTaskDialog = ({ open, onOpenChange, onAddTask, defaultMode }: AddTaskDialogProps) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState<'personal' | 'study'>(defaultMode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !dueDate) {
      alert('Заполните все обязательные поля');
      return;
    }

    onAddTask({
      title,
      category,
      priority,
      dueDate,
      description,
      mode
    });

    setTitle('');
    setCategory('');
    setPriority('medium');
    setDueDate(new Date());
    setDescription('');
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Новая задача</DialogTitle>
          <DialogDescription>
            Создайте задачу с приоритетом, категорией и дедлайном
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Название задачи <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Например: Подготовить презентацию"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание (опционально)</Label>
              <Textarea
                id="description"
                placeholder="Добавьте детали к задаче..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">
                  Категория <span className="text-red-500">*</span>
                </Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category">
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
                <Label htmlFor="priority">Приоритет</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger id="priority">
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
                <Label htmlFor="mode">Режим</Label>
                <Select value={mode} onValueChange={(val) => setMode(val as 'personal' | 'study')}>
                  <SelectTrigger id="mode">
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
              <Icon name="Plus" className="mr-2" size={16} />
              Создать задачу
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;
